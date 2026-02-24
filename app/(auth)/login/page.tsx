"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f3f4f6]">
            {/* Background Orbs */}
            <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-brand-accent/20 rounded-full blur-3xl" />

            <GlassCard className="w-full max-w-md p-8 rounded-3xl z-10 mx-4">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-xl shadow-lg mx-auto mb-4">
                        Q
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Quant.OS Admin</h1>
                    <p className="text-slate-500 text-sm mt-2">請登入以存取管理後台</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="glass-input w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/50 transition bg-white/50"
                            placeholder="admin@quant.os"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="glass-input w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/50 transition bg-white/50"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-medium shadow-lg hover:bg-slate-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
}
