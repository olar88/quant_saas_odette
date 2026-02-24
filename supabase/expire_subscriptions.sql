-- ================================================================
-- 訂閱自動到期 & 續期函數
-- 
-- 邏輯：
--   1. auto_renew = true 且已到期 → 延長 expiry_date 一年，status 保持 active
--   2. active / paused 且已到期 → status = 'expired'
--   3. 回傳 JSON 結果 { renewed, expired }
--
-- 使用方式：
--   SELECT public.auto_expire_subscriptions();
-- ================================================================

CREATE OR REPLACE FUNCTION public.auto_expire_subscriptions()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    renewed_count INT := 0;
    expired_count INT := 0;
BEGIN
    -- Step 1: 自動續期 (auto_renew = true)
    -- 將到期日延長一年，保持 active 狀態
    UPDATE subscriptions
    SET
        expiry_date = expiry_date + INTERVAL '1 year',
        start_date  = CURRENT_DATE
    WHERE
        auto_renew = TRUE
        AND status = 'active'
        AND expiry_date IS NOT NULL
        AND expiry_date < CURRENT_DATE;
    
    GET DIAGNOSTICS renewed_count = ROW_COUNT;

    -- Step 2: 將已到期的 active / paused 訂閱標記為 expired
    UPDATE subscriptions
    SET status = 'expired'
    WHERE
        status IN ('active', 'paused')
        AND expiry_date IS NOT NULL
        AND expiry_date < CURRENT_DATE;
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;

    RETURN json_build_object(
        'renewed', renewed_count,
        'expired', expired_count,
        'executed_at', NOW()
    );
END;
$$;

-- ================================================================
-- 🚀 升級 Supabase Pro 後的懶人切換
-- 
-- 1. 在 Dashboard → Database → Extensions 開啟 pg_cron
-- 2. 取消以下註解並在 SQL Editor 中執行
-- 3. 刪除 vercel.json 中的 crons 設定即可
--
-- SELECT cron.schedule(
--   'auto-expire-subscriptions',   -- job 名稱
--   '5 0 * * *',                   -- 每天 UTC 00:05
--   'SELECT public.auto_expire_subscriptions()'
-- );
--
-- 如需取消 pg_cron job：
-- SELECT cron.unschedule('auto-expire-subscriptions');
-- ================================================================
