import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import type { UserRole } from "@/lib/actions/users";

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile for role-based UI
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    const userRole = (profile?.role ?? "viewer") as UserRole;
    const userName = profile?.full_name ?? user.email?.split("@")[0] ?? "User";
    // Use email as seed so avatar is consistent per user
    const avatarSeed = user.email ?? "default";

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar userRole={userRole} userName={userName} avatarSeed={avatarSeed} />
            <main className="flex-1 ml-20 md:ml-64 relative min-h-screen overflow-y-auto">
                {/* Background Orbs */}
                <div className="fixed top-10 right-10 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none -z-10 animate-orb-float"></div>
                <div className="fixed bottom-10 left-64 w-80 h-80 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none -z-10 animate-orb-float" style={{ animationDelay: '2s' }}></div>

                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
