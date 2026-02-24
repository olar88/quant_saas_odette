import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client (service_role)
 *
 * 此 client 使用 service_role key，繞過 RLS。
 * ⚠️ 僅限 server-side 使用（API route / cron job / server action）
 * ⚠️ 絕對不能暴露在前端
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
        );
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
