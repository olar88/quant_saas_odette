"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UserRole = "super_admin" | "manager" | "viewer";

export interface Profile {
    id: string;
    full_name: string | null;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
    email?: string;
}

/** 取得目前登入者的完整 Profile（包含角色） */
export async function getMyProfile(): Promise<Profile | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
    return { ...data, email: user.email };
}

/** 取得目前登入者的角色（quick helper） */
export async function getMyRole(): Promise<UserRole | null> {
    const profile = await getMyProfile();
    return profile?.role ?? null;
}

/** [super_admin only] 取得所有後台用戶清單 */
export async function getAllUsers(): Promise<Profile[]> {
    const supabase = await createClient();

    // Verify caller is super_admin
    const role = await getMyRole();
    if (role !== "super_admin") return [];

    // Get all profiles joined with auth.users for email
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    return profiles ?? [];
}

/** [super_admin only] 取得某個用戶目前被指派的所有 client IDs */
export async function getUserAssignedClients(userId: string): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("manager_client_assignments")
        .select("client_id")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching assignments:", error);
        return [];
    }
    return data?.map((d) => d.client_id) ?? [];
}

/** [super_admin only] 指派 client 給某個用戶 */
export async function assignClientToUser(userId: string, clientId: string) {
    const supabase = await createClient();

    const role = await getMyRole();
    if (role !== "super_admin") {
        return { error: "權限不足：只有 Super Admin 可以指派客戶" };
    }

    const myProfile = await getMyProfile();
    const { error } = await supabase
        .from("manager_client_assignments")
        .insert({
            user_id: userId,
            client_id: clientId,
            assigned_by: myProfile?.id,
        });

    if (error) {
        // If it's a unique violation, it's already assigned — not a real error
        if (error.code === "23505") return { success: true };
        console.error("Error assigning client:", error);
        return { error: error.message };
    }

    revalidatePath("/settings/profile");
    return { success: true };
}

/** [super_admin only] 移除某個用戶對某 client 的存取權 */
export async function removeClientFromUser(userId: string, clientId: string) {
    const supabase = await createClient();

    const role = await getMyRole();
    if (role !== "super_admin") {
        return { error: "權限不足：只有 Super Admin 可以移除指派" };
    }

    const { error } = await supabase
        .from("manager_client_assignments")
        .delete()
        .eq("user_id", userId)
        .eq("client_id", clientId);

    if (error) {
        console.error("Error removing assignment:", error);
        return { error: error.message };
    }

    revalidatePath("/settings/profile");
    return { success: true };
}

/** [super_admin only] 更新某個用戶的角色 */
export async function updateUserRole(userId: string, newRole: UserRole) {
    const supabase = await createClient();

    const role = await getMyRole();
    if (role !== "super_admin") {
        return { error: "權限不足：只有 Super Admin 可以變更角色" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

    if (error) {
        console.error("Error updating role:", error);
        return { error: error.message };
    }

    revalidatePath("/settings/profile");
    return { success: true };
}

/** [super_admin only] 建立新的後台用戶（送出 magic link / 確認 email） */
export async function inviteUser(email: string, fullName: string, role: UserRole) {
    const supabase = await createClient();

    const myRole = await getMyRole();
    if (myRole !== "super_admin") {
        return { error: "權限不足：只有 Super Admin 可以邀請用戶" };
    }

    // Use Supabase Admin API to invite user
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName, role },
    });

    if (error) {
        console.error("Error inviting user:", error);
        return { error: error.message };
    }

    revalidatePath("/settings/profile");
    return { success: true, userId: data.user.id };
}
