import { GlassCard } from "@/components/ui/glass-card";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { getCustomers } from "@/lib/actions/customers";
import { AddCustomerButton } from "@/components/customers/AddCustomerModal";
import { Button } from "@/components/ui/button";

// Computed once at module level (server component, safe to do)
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const statusConfig = {
    active: { label: "Active", color: "text-green-600 bg-green-100/50", dot: "bg-green-500" },
    paused: { label: "Paused", color: "text-yellow-600 bg-yellow-100/50", dot: "bg-yellow-500" },
    expired: { label: "Expired", color: "text-red-600 bg-red-100/50", dot: "bg-red-500" },
};

export default async function CustomersPage() {
    const customers = await getCustomers();

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });

    const now = new Date();
    const isExpiringSoon = (date: string) => {
        const diff = new Date(date).getTime() - now.getTime();
        return diff > 0 && diff < SEVEN_DAYS_MS;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">客戶管理</h2>
                    <p className="text-slate-500 text-sm mt-1">管理所有訂閱客戶與資金狀態 ({customers.length} 位)</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="搜尋客戶姓名或 ID..."
                            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-700 placeholder:text-slate-400"
                        />
                        <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                    </div>
                    <Button color='secondary' startIcon={<Filter className="w-4 h-4" />}>
                        篩選
                    </Button>
                    <AddCustomerButton />
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/30 text-slate-500 font-medium border-b border-white/20">
                            <tr>
                                <th className="px-6 py-4">客戶名稱</th>
                                <th className="px-6 py-4">訂閱策略</th>
                                <th className="px-6 py-4 text-right">資金規模 (AUM)</th>
                                <th className="px-6 py-4">狀態</th>
                                <th className="px-6 py-4">到期日</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-slate-400">
                                        尚無客戶資料，請點擊「新增客戶」開始。
                                    </td>
                                </tr>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {customers.map((sub: any) => {
                                const status = statusConfig[sub.status as keyof typeof statusConfig] ?? statusConfig.active;
                                const expiring = sub.expiry_date && isExpiringSoon(sub.expiry_date);
                                return (
                                    <tr key={sub.id} className={`hover:bg-white/30 transition ${expiring ? "bg-yellow-50/30" : ""}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {expiring && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-l-full" />
                                                )}
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                                                    {sub.clients?.name?.charAt(0) ?? "?"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-700">{sub.clients?.name ?? "未知客戶"}</p>
                                                    <p className="text-xs text-slate-400">{sub.clients?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-white/50 border border-white/60 text-xs text-slate-600 whitespace-nowrap">
                                                {sub.strategies?.name ?? "未分配"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-700">
                                            {formatCurrency(sub.current_aum ?? 0)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${status.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                                {status.label}
                                                {expiring && " ⚠️"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {sub.expiry_date ? formatDate(sub.expiry_date) : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/customers/${sub.clients?.id}`}>
                                                <button className="text-xs text-brand-primary hover:underline font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition">
                                                    詳情
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
