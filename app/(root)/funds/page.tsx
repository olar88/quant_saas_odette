import { GlassCard } from "@/components/ui/glass-card";
import { ArrowUpRight, History } from "lucide-react";
import Link from "next/link";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart"; // Reuse chart

export default function FundsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">資金與策略管理 (Fund & Strategy)</h2>
                    <p className="text-slate-500 text-sm mt-1">監控所有策略池的資金流向與績效</p>
                </div>
                <Link href="/funds/audit-logs">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl text-slate-600 text-sm font-medium hover:bg-white transition shadow-sm">
                        <History className="w-4 h-4" />
                        資金審計日誌
                    </button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 rounded-2xl">
                    <p className="text-sm text-slate-500 mb-2">Alpha 策略池總額</p>
                    <h3 className="text-3xl font-bold text-slate-800">$8,245,000</h3>
                    <div className="mt-4 flex items-center text-green-600 text-sm font-bold gap-1">
                        <ArrowUpRight className="w-4 h-4" />
                        +12.5% YoY
                    </div>
                </GlassCard>
                <GlassCard className="p-6 rounded-2xl">
                    <p className="text-sm text-slate-500 mb-2">Beta 中性池總額</p>
                    <h3 className="text-3xl font-bold text-slate-800">$4,105,500</h3>
                    <div className="mt-4 flex items-center text-slate-400 text-sm font-bold gap-1">
                        - 持平
                    </div>
                </GlassCard>
                <GlassCard className="p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-brand-primary/10 to-transparent"></div>
                    <p className="text-sm text-slate-500 mb-2">目前總管理費率</p>
                    <h3 className="text-3xl font-bold text-slate-800">1.8% <span className="text-sm text-slate-400 font-normal">/ yr</span></h3>
                </GlassCard>
            </div>

            {/* Chart Section */}
            <GlassCard className="p-6 rounded-[2rem]">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">策略資金佔比趨勢</h3>
                    <p className="text-xs text-slate-400">Alpha 策略 vs Beta 中性</p>
                </div>
                <PerformanceChart />
            </GlassCard>
        </div>
    );
}
