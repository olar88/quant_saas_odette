import { GlassCard } from "@/components/ui/glass-card";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function AuditLogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Link href="/funds" className="p-2 rounded-xl hover:bg-white/40 transition text-slate-500">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">資金審計日誌 (Audit Logs)</h2>
                    <p className="text-slate-500 text-sm">金融合規紀錄：所有資金變更操作</p>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden rounded-3xl">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/30 text-slate-500 font-medium border-b border-white/20">
                        <tr>
                            <th className="px-6 py-4">時間</th>
                            <th className="px-6 py-4">操作人員</th>
                            <th className="px-6 py-4">變更項目</th>
                            <th className="px-6 py-4 text-right">變更金額</th>
                            <th className="px-6 py-4">詳情</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                        {[1, 2, 3].map((i) => (
                            <tr key={i} className="hover:bg-white/30 transition">
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                    2025-02-13 10:3{i} AM
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                        <span className="font-medium text-slate-700">Admin User</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                                        資金注入
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-700">
                                    +$50,000.00
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-slate-400 hover:text-brand-primary transition">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}
