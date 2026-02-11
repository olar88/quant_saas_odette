-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (handled via auth.users, create public profile table if needed)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('super_admin', 'viewer')),
  updated_at TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Strategies Table
CREATE TABLE public.strategies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'extreme')),
  base_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Clients Table
CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Subscriptions Table (Core Relationship)
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  strategy_id UUID REFERENCES public.strategies(id) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
  current_aum NUMERIC(15, 2) DEFAULT 0.00,
  start_date DATE NOT NULL,
  expiry_date DATE,
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fund Audit Logs (Compliance)
CREATE TABLE public.fund_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subscription_id UUID REFERENCES public.subscriptions(id) NOT NULL,
  previous_balance NUMERIC(15, 2),
  new_balance NUMERIC(15, 2),
  change_amount NUMERIC(15, 2),
  change_reason TEXT,
  changed_by UUID REFERENCES auth.users(id), -- Admin who made the change
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users (Viewers & Admins)
CREATE POLICY "Enable read access for all authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON public.strategies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON public.subscriptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON public.fund_audit_logs FOR SELECT TO authenticated USING (true);

-- Allow write access only to Super Admins (simplified for now to all authenticated, can be refined later)
CREATE POLICY "Enable insert for authenticated users" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users based on email" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Seed Data (Optional)
INSERT INTO public.strategies (name, risk_level) VALUES 
('Alpha Trend Strategy', 'high'),
('Beta Neutral Strategy', 'medium'),
('High Frequency V2', 'extreme');
