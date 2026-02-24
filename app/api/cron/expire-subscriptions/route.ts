import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/cron/expire-subscriptions
 *
 * Vercel Cron 每天 UTC 00:05 呼叫此 endpoint。
 * 使用 CRON_SECRET 驗證，防止外部非法呼叫。
 *
 * 升級 Supabase Pro 後可改用 pg_cron 直接呼叫 DB function，
 * 屆時可刪除此 API route。
 */
export async function GET(request: Request) {
    // ─── 驗證 CRON_SECRET ────────────────────────────────────────────────
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        return NextResponse.json(
            { error: "CRON_SECRET not configured" },
            { status: 500 }
        );
    }

    // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // ─── 執行訂閱到期更新 ────────────────────────────────────────────────
    try {
        const supabase = createAdminClient();

        const { data, error } = await supabase.rpc("auto_expire_subscriptions");

        if (error) {
            console.error("[Cron] auto_expire_subscriptions failed:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        console.log("[Cron] auto_expire_subscriptions result:", data);

        return NextResponse.json({
            ok: true,
            result: data,
        });
    } catch (err) {
        console.error("[Cron] Unexpected error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
