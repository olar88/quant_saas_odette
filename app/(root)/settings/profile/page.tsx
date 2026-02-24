import { GlassCard } from "@/components/ui/glass-card";
import { User, Shield, Key } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">個人資料設定</h2>
                <p className="text-slate-500 text-sm mt-1">管理您的帳戶資訊與安全設定</p>
            </div>

            <GlassCard className="p-8 rounded-[2rem] space-y-8">
                <div className="flex items-center gap-6 border-b border-gray-200/50 pb-8">
                    <div className="w-24 h-24 rounded-full bg-slate-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full rounded-full" />
                        <button className="absolute bottom-0 right-0 p-2 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition">
                            <User className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Odette Liu</h3>
                        <p className="text-slate-500">Super Administrator</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full">
                            ROOT ACCESS
                        </span>
                    </div>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Display Name</label>
                            <input type="text" defaultValue="Odette Liu" className="glass-input w-full px-4 py-2.5 rounded-xl border border-white/40 focus:ring-2 focus:ring-brand-primary/50 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" defaultValue="odette@quant.os" className="glass-input w-full px-4 py-2.5 rounded-xl border border-white/40 focus:ring-2 focus:ring-brand-primary/50 outline-none" disabled />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" className="px-6 py-2.5 bg-slate-800 text-white rounded-xl shadow-lg hover:bg-slate-900 transition font-medium">
                            Save Changes
                        </button>
                        <button type="button" className="px-6 py-2.5 glass-card rounded-xl text-slate-600 hover:bg-white/50 transition font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </GlassCard>

            <GlassCard className="p-8 rounded-[2rem]">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-primary" />
                    Security & Login
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-white/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Key className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-700 text-sm">Password</p>
                                <p className="text-xs text-slate-400">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <button className="text-sm text-brand-primary font-medium hover:underline">Update</button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
