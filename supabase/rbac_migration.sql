-- ================================================================
-- Quant.OS — RBAC 權限升級腳本
-- 三層級角色權限系統 (super_admin > manager > viewer)
-- 
-- 執行順序：先執行 schema.sql，再執行本檔案
-- 本腳本可安全重複執行（Idempotent）
-- ================================================================

-- ================================================================
-- STEP 1: 清除所有舊政策（確保可重複執行）
-- ================================================================
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  -- 清除 profiles 上所有政策
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;

  -- 清除 strategies 上所有政策
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'strategies' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.strategies', pol.policyname);
  END LOOP;

  -- 清除 clients 上所有政策
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'clients' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.clients', pol.policyname);
  END LOOP;

  -- 清除 subscriptions 上所有政策
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'subscriptions' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.subscriptions', pol.policyname);
  END LOOP;

  -- 清除 fund_audit_logs 上所有政策
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'fund_audit_logs' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.fund_audit_logs', pol.policyname);
  END LOOP;

  -- 清除 manager_client_assignments 上所有政策（若存在）
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'manager_client_assignments' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.manager_client_assignments', pol.policyname);
  END LOOP;
END $$;

-- 清除舊的 trigger 和 functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_super_admin();
DROP FUNCTION IF EXISTS public.get_my_role();
DROP FUNCTION IF EXISTS public.can_access_client(UUID);

-- ================================================================
-- STEP 2: 更新 profiles 資料表，新增 manager 角色
-- ================================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('super_admin', 'manager', 'viewer'));

-- ================================================================
-- STEP 3: 新增 管理員-客戶 指派關聯表
-- ================================================================
CREATE TABLE IF NOT EXISTS public.manager_client_assignments (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id   UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, client_id)
);

ALTER TABLE public.manager_client_assignments ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- STEP 4: 建立 Helper Functions
-- 
-- 重要：使用 SECURITY DEFINER 讓函數以建立者(postgres)身份執行
-- 這樣函數內部的查詢不受 RLS 限制，避免遞迴
-- ================================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'super_admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.can_access_client(p_client_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM public.manager_client_assignments
      WHERE user_id = auth.uid() AND client_id = p_client_id
    );
$$;

-- ================================================================
-- STEP 5: 重建所有 RLS Policies
-- 
-- ⚠️ 關鍵設計：profiles 的 SELECT 政策不呼叫任何查詢 profiles 的函數
--    避免 RLS → function → query profiles → RLS 的無限遞迴
-- ================================================================

-- ---- profiles ----
-- 安全：只用 auth.uid() 比對，不呼叫 helper function，避免遞迴
CREATE POLICY "profiles: read own"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

-- super_admin 能讀取所有 profiles（透過 SECURITY DEFINER function 安全繞過）
-- 這裡用兩個獨立政策，PostgreSQL 會 OR 合併
CREATE POLICY "profiles: admin reads all"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "profiles: insert own"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles: admin updates any"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_super_admin());

-- ---- strategies ----
CREATE POLICY "strategies: all read"
  ON public.strategies FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "strategies: admin write"
  ON public.strategies FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "strategies: admin update"
  ON public.strategies FOR UPDATE TO authenticated
  USING (public.is_super_admin());

-- ---- clients ----
CREATE POLICY "clients: role based read"
  ON public.clients FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM public.manager_client_assignments
      WHERE user_id = auth.uid() AND client_id = public.clients.id
    )
  );

CREATE POLICY "clients: admin insert"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (public.get_my_role() IN ('super_admin', 'manager'));

CREATE POLICY "clients: admin manager update"
  ON public.clients FOR UPDATE TO authenticated
  USING (public.can_access_client(id) AND public.get_my_role() != 'viewer');

-- ---- subscriptions ----
CREATE POLICY "subs: role based read"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (public.can_access_client(client_id));

CREATE POLICY "subs: admin manager insert"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (public.get_my_role() IN ('super_admin', 'manager'));

CREATE POLICY "subs: admin manager update"
  ON public.subscriptions FOR UPDATE TO authenticated
  USING (public.can_access_client(client_id) AND public.get_my_role() != 'viewer');

-- ---- fund_audit_logs ----
CREATE POLICY "audit: role based read"
  ON public.fund_audit_logs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.id = fund_audit_logs.subscription_id
      AND public.can_access_client(s.client_id)
    )
  );

CREATE POLICY "audit: admin manager insert"
  ON public.fund_audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.get_my_role() != 'viewer');

-- ---- manager_client_assignments ----
CREATE POLICY "assignments: admin full access"
  ON public.manager_client_assignments FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "assignments: see own"
  ON public.manager_client_assignments FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ================================================================
-- STEP 6: 自動建立 Profile (新用戶註冊時觸發)
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- 即使出錯也不影響用戶註冊/登入
  RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
