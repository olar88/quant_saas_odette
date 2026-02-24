import { GlassCard } from "@/components/ui/glass-card";

export default function SystemLogsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">系統登入日誌 (System Logs)</h2>
                <p className="text-slate-500 text-sm mt-1">追蹤所有系統訪問與登入嘗試</p>
            </div>

            <GlassCard className="p-6 rounded-[2rem]">
                <div className="text-center py-20 text-slate-400">
                    <p>System logs not connected to backend yet.</p>
                    <p className="text-sm mt-2">Check back later.</p>
                </div>
            </GlassCard>
        </div>
    );
}
