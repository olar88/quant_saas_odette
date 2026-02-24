"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("subscriptions")
        .select(`
      id,
      current_aum,
      status,
      start_date,
      expiry_date,
      clients (id, name, email, avatar_url),
      strategies (id, name)
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching customers:", error);
        return [];
    }

    return data ?? [];
}

export async function getCustomerById(clientId: string) {
    const supabase = await createClient();

    const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

    if (clientError) {
        console.error("Error fetching client:", clientError);
        return null;
    }

    const { data: subscriptions, error: subError } = await supabase
        .from("subscriptions")
        .select(`*, strategies (name)`)
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

    if (subError) {
        console.error("Error fetching subscriptions:", subError);
    }

    return { client, subscriptions: subscriptions ?? [] };
}

export async function getStrategies() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("strategies").select("id, name");
    if (error) {
        console.error("Error fetching strategies:", error);
        return [];
    }
    return data ?? [];
}

export async function createCustomer(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const strategyId = formData.get("strategy_id") as string;
    const aum = parseFloat(formData.get("aum") as string);
    const expiryDate = formData.get("expiry_date") as string;

    // 1. Create client
    const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({ name, email, status: "active" })
        .select()
        .single();

    if (clientError) {
        console.error("Error creating client:", clientError);
        return { error: clientError.message };
    }

    // 2. Create subscription
    const { error: subError } = await supabase
        .from("subscriptions")
        .insert({
            client_id: newClient.id,
            strategy_id: strategyId,
            current_aum: aum,
            start_date: new Date().toISOString(),
            expiry_date: expiryDate,
            status: "active",
        });

    if (subError) {
        console.error("Error creating subscription:", subError);
        return { error: subError.message };
    }

    revalidatePath("/customers");
    revalidatePath("/");
    return { success: true };
}

export async function updateSubscriptionStatus(
    subscriptionId: string,
    status: "active" | "paused" | "expired"
) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("subscriptions")
        .update({ status })
        .eq("id", subscriptionId);

    if (error) {
        console.error("Error updating subscription:", error);
        return { error: error.message };
    }

    revalidatePath("/customers");
    revalidatePath("/");
    return { success: true };
}
