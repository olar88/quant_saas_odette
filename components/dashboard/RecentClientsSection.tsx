/**
 * RecentClientsSection — 最新客戶動態列表區塊
 *
 * 包含：
 * - 標題列（含「查看全部」連結）
 * - 表頭欄位：客戶名稱 / 策略方案 / 資金規模 / 狀態
 * - 動態客戶列表（使用 ClientRow 元件渲染每一行）
 * - 無資料時顯示空狀態提示
 */

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ClientRow } from "@/components/dashboard/ClientRow";
import type { DashboardClient } from "@/lib/types/dashboard";

interface RecentClientsSectionProps {
  /** 最近的客戶清單 */
  clients: DashboardClient[];
}

export function RecentClientsSection({ clients }: Readonly<RecentClientsSectionProps>) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {/* ── 標題列 ── */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-slate-700">最新客戶動態</h3>
        <Link
          href="/customers"
          className="text-sm text-brand-primary font-medium hover:underline flex items-center"
        >
          查看全部 <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── 表頭（僅在 md 以上螢幕顯示） ── */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <div className="col-span-4">客戶名稱</div>
        <div className="col-span-3">策略方案</div>
        <div className="col-span-3 text-right">資金規模</div>
        <div className="col-span-2 text-right">狀態</div>
      </div>

      {/* ── 客戶列表 ── */}
      {clients.map((client) => (
        <ClientRow key={client.id} client={client} />
      ))}

      {/* ── 空狀態提示 ── */}
      {clients.length === 0 && (
        <div className="text-center py-10 text-slate-400 text-sm">
          尚無客戶資料，請先在資料庫建立 Subscriptions。
        </div>
      )}
    </div>
  );
}
