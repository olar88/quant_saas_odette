"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Badge } from "@/components/ui/Badge";
import { Monitor, LogIn, ShieldAlert, KeyRound, UserCog } from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface SystemLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    type: "login" | "permission" | "security" | "config";
    ip: string;
    detail: string;
}

const MOCK_LOGS: SystemLog[] = [
    {
        id: "log-001",
        timestamp: "2026-02-24 14:30:12",
        user: "odette@quant.os",
        action: "登入成功",
        type: "login",
        ip: "203.145.67.89",
        detail: "Browser: Chrome 121 / macOS",
    },
    {
        id: "log-002",
        timestamp: "2026-02-24 13:15:44",
        user: "manager01@quant.os",
        action: "角色變更",
        type: "permission",
        ip: "10.0.1.55",
        detail: "viewer → manager (by super_admin)",
    },
    {
        id: "log-003",
        timestamp: "2026-02-24 11:08:33",
        user: "unknown@hack.com",
        action: "登入失敗 (密碼錯誤)",
        type: "security",
        ip: "185.220.101.45",
        detail: "連續第 3 次嘗試失敗",
    },
    {
        id: "log-004",
        timestamp: "2026-02-23 19:45:21",
        user: "odette@quant.os",
        action: "修改系統設定",
        type: "config",
        ip: "203.145.67.89",
        detail: "啟動雙因素驗證 (2FA)",
    },
    {
        id: "log-005",
        timestamp: "2026-02-23 17:22:03",
        user: "manager01@quant.os",
        action: "登入成功",
        type: "login",
        ip: "10.0.1.55",
        detail: "Browser: Safari 18 / iPadOS",
    },
    {
        id: "log-006",
        timestamp: "2026-02-23 10:00:10",
        user: "odette@quant.os",
        action: "新增用戶",
        type: "permission",
        ip: "203.145.67.89",
        detail: "新增 viewer02@quant.os (role: viewer)",
    },
    {
        id: "log-007",
        timestamp: "2026-02-22 22:11:55",
        user: "unknown@test.com",
        action: "登入失敗 (帳號不存在)",
        type: "security",
        ip: "91.240.118.172",
        detail: "嘗試暴力破解",
    },
    {
        id: "log-008",
        timestamp: "2026-02-22 08:30:00",
        user: "odette@quant.os",
        action: "API 密鑰重新產生",
        type: "config",
        ip: "203.145.67.89",
        detail: "舊密鑰已失效",
    },
];

const typeConfig: Record<
    SystemLog["type"],
    { label: string; variant: "info" | "primary" | "error" | "neutral"; Icon: typeof Monitor }
> = {
    login: { label: "登入", variant: "info", Icon: LogIn },
    permission: { label: "權限", variant: "primary", Icon: UserCog },
    security: { label: "安全", variant: "error", Icon: ShieldAlert },
    config: { label: "設定", variant: "neutral", Icon: KeyRound },
};

type FilterType = "all" | SystemLog["type"];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SystemLogsPage() {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");

    const filtered = MOCK_LOGS.filter((log) => {
        const matchSearch =
            search === "" ||
            log.user.toLowerCase().includes(search.toLowerCase()) ||
            log.action.toLowerCase().includes(search.toLowerCase()) ||
            log.detail.toLowerCase().includes(search.toLowerCase()) ||
            log.ip.includes(search);

        const matchType = filterType === "all" || log.type === filterType;

        return matchSearch && matchType;
    });

    const filterTabs: { label: string; value: FilterType }[] = [
        { label: "全部", value: "all" },
        { label: "登入", value: "login" },
        { label: "權限", value: "permission" },
        { label: "安全", value: "security" },
        { label: "設定", value: "config" },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="系統安全日誌 (System Logs)"
                subtitle="追蹤所有系統訪問、權限變更與安全事件"
                actions={
                    <SearchInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClear={() => setSearch("")}
                        placeholder="搜尋用戶、操作或 IP..."
                        wrapperClassName="w-full md:w-72"
                    />
                }
            />

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilterType(tab.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterType === tab.value
                                ? "bg-slate-800 text-white shadow-lg"
                                : "glass-card text-slate-600 hover:bg-white/60"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <GlassCard className="p-0 overflow-hidden rounded-3xl">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/30 text-slate-500 font-medium border-b border-white/20">
                        <tr>
                            <th className="px-6 py-4">時間</th>
                            <th className="px-6 py-4">類型</th>
                            <th className="px-6 py-4">用戶</th>
                            <th className="px-6 py-4">操作行為</th>
                            <th className="px-6 py-4">IP 位址</th>
                            <th className="px-6 py-4">詳細</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-slate-400">
                                    <Monitor className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    未找到符合條件的日誌記錄。
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
                                            <Badge variant={cfg.variant} dot size="small">
                                                {cfg.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700 text-xs">
                                            {log.user}
                                        </td>
                                        <td className="px-6 py-4 text-slate-700">
                                            {log.action}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                            {log.ip}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate">
                                            {log.detail}
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
