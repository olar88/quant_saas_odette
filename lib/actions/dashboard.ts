"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardData() {
    const supabase = await createClient();

    // 1. Fetch Total AUM (Sum of all active subscriptions)
    const { data: aumData, error: aumError } = await supabase
        .from("subscriptions")
        .select("current_aum")
        .eq("status", "active");

    if (aumError) {
        console.error("Error fetching AUM:", aumError);
    }

    const totalAum = aumData?.reduce((acc, curr) => acc + (Number(curr.current_aum) || 0), 0) || 0;

    // 2. Fetch Active Clients Count
    const { count: clientCount, error: clientError } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

    if (clientError) {
        console.error("Error fetching clients:", clientError);
    }

    // 3. Fetch Expiring Soon (Next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const { count: expiringCount, error: expiringError } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .lte("expiry_date", sevenDaysFromNow.toISOString());

    if (expiringError) {
        console.error("Error fetching expiring:", expiringError);
    }

    // 4. Fetch Recent Client List (with strategy name)
    const { data: recentClients, error: recentError } = await supabase
        .from("subscriptions")
        .select(`
      *,
      clients (name, id, avatar_url),
      strategies (name)
    `)
        .order("created_at", { ascending: false })
        .limit(5);

    if (recentError) {
        console.error("Error fetching recent clients:", recentError);
    }

    // Flatten data for UI
    const flatClients = recentClients?.map(sub => ({
        id: sub.clients?.id,
        name: sub.clients?.name,
        clientId: sub.clients?.id?.slice(0, 8), // Mock short ID
        strategy: sub.strategies?.name,
        aum: sub.current_aum,
        status: sub.status,
        expiry: sub.expiry_date,
        avatar: sub.clients?.avatar_url
    })) || [];

    return {
        totalAum,
        clientCount: clientCount || 0,
        expiringCount: expiringCount || 0,
        recentClients: flatClients,
        mrr: totalAum * 0.002 // Mock MRR calculation (e.g. 0.2% management fee)
    };
}
