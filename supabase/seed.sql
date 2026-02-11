-- Insert Strategies (if not exists)
INSERT INTO public.strategies (name, risk_level, description) VALUES 
('Alpha Trend Strategy', 'high', 'Follows market trends with leverage.'),
('Beta Neutral Strategy', 'medium', 'Market neutral approach.'),
('High Frequency V2', 'extreme', 'Ultra-low latency arbitrage.')
ON CONFLICT DO NOTHING;

-- Insert Clients
INSERT INTO public.clients (id, name, email, status) VALUES 
('c132897e-03bf-4077-8575-3f7aba96bcea', '王大明', 'wang@example.com', 'active'),
('d5a35bc0-3f4b-436b-9955-f78d54c8c870', '陳怡君', 'chen@example.com', 'active'),
('e91a204b-36df-432d-ad52-e2da35d0d770', '林志豪', 'lin@example.com', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert Subscriptions
INSERT INTO public.subscriptions (client_id, strategy_id, status, current_aum, start_date, expiry_date) 
SELECT 
    c.id, 
    s.id, 
    'active', 
    CASE WHEN c.name = '王大明' THEN 1200000 
         WHEN c.name = '陳怡君' THEN 500000 
         ELSE 3250000 END,
    NOW() - INTERVAL '30 days',
    CASE WHEN c.name = '陳怡君' THEN NOW() + INTERVAL '5 days' -- Expiring soon
         ELSE NOW() + INTERVAL '60 days' END
FROM public.clients c
JOIN public.strategies s ON 
    (c.name = '王大明' AND s.name = 'Alpha Trend Strategy') OR
    (c.name = '陳怡君' AND s.name = 'Beta Neutral Strategy') OR
    (c.name = '林志豪' AND s.name = 'High Frequency V2');
