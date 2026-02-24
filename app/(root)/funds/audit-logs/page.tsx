"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/IconButton";
import Link from "next/link";
import {
    ArrowLeft,
    FileText,
    Download,
    Filter,
    X,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCw,
    TrendingUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    type: "deposit" | "withdraw" | "profit" | "adjustment";
    client: string;
    strategy: string;
    amount: number;
    reason: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
        id: "al-001",
        timestamp: "2026-02-24 10:31",
        user: "Odette Liu",
        type: "deposit",
        client: "陳大文",
        strategy: "Alpha 多空策略",
        amount: 50000,
        reason: "季度追加入金",
    },
    {
        id: "al-002",
        timestamp: "2026-02-24 10:32",
        user: "Odette Liu",
        type: "deposit",
        client: "王小明",
        strategy: "Beta 中性策略",
        amount: 100000,
        reason: "新客戶首期入金",
    },
    {
        id: "al-003",
        timestamp: "2026-02-23 16:45",
        user: "Manager A",
        type: "withdraw",
        client: "林美惠",
        strategy: "Alpha 多空策略",
        amount: -30000,
        reason: "客戶要求部分出金",
    },
    {
        id: "al-004",
        timestamp: "2026-02-23 14:22",
        user: "Odette Liu",
        type: "profit",
        client: "陳大文",
        strategy: "Alpha 多空策略",
        amount: 8500,
        reason: "月度績效結算",
    },
    {
        id: "al-005",
        timestamp: "2026-02-22 11:10",
        user: "Odette Liu",
        type: "adjustment",
        client: "黃小華",
        strategy: "Beta 中性策略",
        amount: -2000,
        reason: "手續費調整",
    },
    {
        id: "al-006",
        timestamp: "2026-02-22 09:35",
        user: "Manager B",
        type: "deposit",
        client: "張三",
        strategy: "Alpha 多空策略",
        amount: 200000,
        reason: "年度展期續費入金",
    },
    {
        id: "al-007",
        timestamp: "2026-02-21 17:00",
        user: "Odette Liu",
        type: "withdraw",
        client: "王小明",
        strategy: "Beta 中性策略",
        amount: -60000,
        reason: "到期全額出金",
    },
    {
        id: "al-008",
        timestamp: "2026-02-21 15:20",
        user: "Manager A",
        type: "profit",
        client: "林美惠",
        strategy: "Alpha 多空策略",
        amount: 12300,
        reason: "Q4 績效分潤",
    },
];

const typeConfig: Record<
    AuditLog["type"],
    { label: string; variant: "info" | "error" | "success" | "neutral"; Icon: typeof ArrowUpCircle }
> = {
    deposit: { label: "入金", variant: "info", Icon: ArrowUpCircle },
    withdraw: { label: "出金", variant: "error", Icon: ArrowDownCircle },
    profit: { label: "損益", variant: "success", Icon: TrendingUp },
    adjustment: { label: "調整", variant: "neutral", Icon: RefreshCw },
};

type AuditFilterType = "all" | AuditLog["type"];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AuditLogsPage() {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<AuditFilterType>("all");

    const filtered = useMemo(() => {
        return MOCK_AUDIT_LOGS.filter((log) => {
            if (filterType !== "all" && log.type !== filterType) return false;
            if (search) {
                const q = search.toLowerCase();
                return (
                    log.user.toLowerCase().includes(q) ||
                    log.client.toLowerCase().includes(q) ||
                    log.strategy.toLowerCase().includes(q) ||
                    log.reason.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [search, filterType]);

    const filterTabs: { label: string; value: AuditFilterType }[] = [
        { label: "全部", value: "all" },
        { label: "入金", value: "deposit" },
        { label: "出金", value: "withdraw" },
        { label: "損益", value: "profit" },
        { label: "調整", value: "adjustment" },
    ];

    const formatAmount = (amount: number) => {
        const prefix = amount >= 0 ? "+" : "";
        return `${prefix}${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)}`;
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="資金審計日誌 (Audit Logs)"
                subtitle="金融合規紀錄：所有資金變更操作"
                backAction={
                    <Link href="/funds" className="p-2 rounded-xl hover:bg-white/40 transition text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                }
                actions={
                    <>
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClear={() => setSearch("")}
                            placeholder="搜尋用戶、客戶或原因..."
                            wrapperClassName="flex-1 md:w-64"
                        />
                        <Button
                            color="secondary"
                            variant="contained"
                            size="small"
                            startIcon={<Download className="w-4 h-4" />}
                        >
                            匯出
                        </Button>
                    </>
                }
            />

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap items-center">
                <Filter className="w-4 h-4 text-slate-400" />
                {filterTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilterType(tab.value)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${filterType === tab.value
                                ? "bg-slate-800 text-white shadow-md"
                                : "glass-card text-slate-600 hover:bg-white/60"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
                {(search || filterType !== "all") && (
                    <button
                        onClick={() => { setSearch(""); setFilterType("all"); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-red-500 hover:bg-red-50 transition"
                    >
                        <X className="w-3 h-3" />
                        清除
                    </button>
                )}
            </div>

            <GlassCard className="p-0 overflow-hidden rounded-3xl">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/30 text-slate-500 font-medium border-b border-white/20">
                        <tr>
                            <th className="px-6 py-4">時間</th>
                            <th className="px-6 py-4">操作人員</th>
                            <th className="px-6 py-4">類型</th>
                            <th className="px-6 py-4">客戶</th>
                            <th className="px-6 py-4">策略</th>
                            <th className="px-6 py-4 text-right">變更金額</th>
                            <th className="px-6 py-4">原因</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-16 text-slate-400">
                                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    未找到符合條件的審計記錄。
                                </td>
                            </tr>
                        ) : (
                            filtered.map((log) => {
                                const cfg = typeConfig[log.type];
                                return (
                                    <tr key={log.id} className="hover:bg-white/30 transition">
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
                                            {log.timestamp}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {log.user.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-700 text-xs">{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={cfg.variant} dot size="small">
                                                {cfg.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 text-xs">{log.client}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-lg bg-white/50 border border-white/60 text-xs text-slate-600">
                                                {log.strategy}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold text-sm ${log.amount >= 0 ? "text-green-600" : "text-red-500"
                                            }`}>
                                            {formatAmount(log.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 max-w-[160px] truncate">
                                            {log.reason}
                                        </td>
                                        <td className="px-6 py-4">
                                            <IconButton size="small" title="查看詳情">
                                                <FileText className="w-4 h-4" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}
