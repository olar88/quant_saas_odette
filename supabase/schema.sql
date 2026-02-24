-- ================================================================
-- Quant.OS — 基礎資料表建立
-- 執行順序：1. schema.sql → 2. rbac_migration.sql → 3. seed.sql
-- ================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables

-- 使用者 Profile（與 auth.users 1:1 對應）
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'viewer',
  updated_at TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 策略
CREATE TABLE public.strategies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  risk_level TEXT,
  base_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 客戶
CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  status TEXT DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 訂閱（客戶 ↔ 策略 的核心關聯）
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  strategy_id UUID REFERENCES public.strategies(id) NOT NULL,
  status TEXT DEFAULT 'active',
  current_aum NUMERIC(15, 2) DEFAULT 0.00,
  start_date DATE NOT NULL,
  expiry_date DATE,
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 資金異動紀錄（稽核追蹤）
CREATE TABLE public.fund_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  previous_balance NUMERIC(15, 2),
  new_balance NUMERIC(15, 2),
  change_amount NUMERIC(15, 2),
  change_reason TEXT,
  changed_by UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Temporary open policies（僅用於開發初期，rbac_migration 會替換這些）
CREATE POLICY "profiles: authenticated read" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles: insert own" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles: update own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "strategies: public read" ON public.strategies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "clients: authenticated read" ON public.clients
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "clients: authenticated insert" ON public.clients
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "clients: authenticated update" ON public.clients
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "subscriptions: authenticated read" ON public.subscriptions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "subscriptions: authenticated insert" ON public.subscriptions
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "subscriptions: authenticated update" ON public.subscriptions
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "audit_logs: authenticated read" ON public.fund_audit_logs
  FOR SELECT TO authenticated USING (true);
