"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/ui/SearchInput";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Filter, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
interface SubscriptionRow {
    id: string;
    status: string;
    current_aum: number;
    expiry_date: string | null;
    start_date: string | null;
    clients: any;
    strategies: any;
}

export interface CustomerListClientProps {
    customers: SubscriptionRow[];
    addCustomerButton: React.ReactNode;
}

type StatusFilter = "all" | "active" | "paused" | "expired";

// ─── Config ──────────────────────────────────────────────────────────────────

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "error" }> = {
    active: { label: "Active", variant: "success" },
    paused: { label: "Paused", variant: "warning" },
    expired: { label: "Expired", variant: "error" },
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });

// ─── Component ───────────────────────────────────────────────────────────────

export function CustomerListClient({ customers, addCustomerButton }: CustomerListClientProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const now = useMemo(() => new Date(), []);

    const isExpiringSoon = (date: string) => {
        const diff = new Date(date).getTime() - now.getTime();
        return diff > 0 && diff < SEVEN_DAYS_MS;
    };

    const filtered = useMemo(() => {
        return customers.filter((sub) => {
            // Status filter
            if (statusFilter !== "all" && sub.status !== statusFilter) return false;

            // Search filter
            if (search) {
                const q = search.toLowerCase();
                const name = sub.clients?.name?.toLowerCase() ?? "";
                const email = sub.clients?.email?.toLowerCase() ?? "";
                const strategy = sub.strategies?.name?.toLowerCase() ?? "";
                const clientId = sub.clients?.id?.toLowerCase() ?? "";
                if (
                    !name.includes(q) &&
                    !email.includes(q) &&
                    !strategy.includes(q) &&
                    !clientId.includes(q)
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [customers, search, statusFilter, now]);

    const statusTabs: { label: string; value: StatusFilter; count: number }[] = [
        { label: "全部", value: "all", count: customers.length },
        { label: "Active", value: "active", count: customers.filter((c) => c.status === "active").length },
        { label: "Paused", value: "paused", count: customers.filter((c) => c.status === "paused").length },
        { label: "Expired", value: "expired", count: customers.filter((c) => c.status === "expired").length },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="客戶管理"
                subtitle={`管理所有訂閱客戶與資金狀態 (${customers.length} 位)`}
                actions={
                    <>
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClear={() => setSearch("")}
                            placeholder="搜尋客戶姓名、ID 或策略..."
                            wrapperClassName="flex-1 md:w-64"
                        />
                        {addCustomerButton}
                    </>
                }
            />

            {/* Status filter tabs */}
            <div className="flex gap-2 flex-wrap items-center">
                <Filter className="w-4 h-4 text-slate-400" />
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${statusFilter === tab.value
                            ? "bg-slate-800 text-white shadow-md"
                            : "glass-card text-slate-600 hover:bg-white/60"
                            }`}
                    >
                        {tab.label}
                        <span className="ml-1.5 opacity-60">{tab.count}</span>
                    </button>
                ))}
                {(search || statusFilter !== "all") && (
                    <button
                        onClick={() => { setSearch(""); setStatusFilter("all"); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-red-500 hover:bg-red-50 transition"
                    >
                        <X className="w-3 h-3" />
                        清除篩選
                    </button>
                )}
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
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-slate-400">
                                        {customers.length === 0
                                            ? "尚無客戶資料，請點擊「新增客戶」開始。"
                                            : "沒有符合篩選條件的客戶。"}
                                    </td>
                                </tr>
                            )}
                            {filtered.map((sub) => {
                                const badge = statusBadge[sub.status] ?? statusBadge.active;
                                const expiring = sub.expiry_date && isExpiringSoon(sub.expiry_date);
                                return (
                                    <tr key={sub.id} className={`hover:bg-white/30 transition ${expiring ? "bg-yellow-50/30" : ""}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
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
                                            <Badge variant={badge.variant} dot>
                                                {badge.label}
                                                {expiring && " ⚠️"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {sub.expiry_date ? formatDate(sub.expiry_date) : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/customers/${sub.clients?.id}`}>
                                                <Button variant="text" size="small" color="primary">
                                                    詳情
                                                </Button>
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
