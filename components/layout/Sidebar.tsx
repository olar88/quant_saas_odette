import Link from "next/link";
import { LayoutDashboard, Users, PieChart } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="w-20 md:w-64 glass-sidebar fixed h-full flex flex-col justify-between py-6 transition-all duration-300 z-20">
            <div>
                <div className="px-6 mb-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        Q
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent hidden md:block">
                        Quant.OS
                    </span>
                </div>

                <nav className="space-y-2 px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/60 text-brand-primary font-semibold shadow-sm transition-all"
                    >
                        <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                        <span className="hidden md:block">總覽儀表板</span>
                    </Link>
                    <Link
                        href="/clients"
                        className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/40 text-slate-500 transition-all"
                    >
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <span className="hidden md:block">客戶列表</span>
                    </Link>
                    <Link
                        href="/funds"
                        className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/40 text-slate-500 transition-all"
                    >
                        <PieChart className="w-5 h-5 flex-shrink-0" />
                        <span className="hidden md:block">資金報表</span>
                    </Link>
                </nav>
            </div>

            <div className="px-6">
                <div className="flex items-center gap-3 p-3 glass-card rounded-2xl cursor-pointer hover:bg-white/50 transition border-none shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        className="w-8 h-8 rounded-full bg-white shadow-sm"
                        alt="Admin"
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-slate-700">Odette Liu</p>
                        <p className="text-xs text-slate-400">超級管理員</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
