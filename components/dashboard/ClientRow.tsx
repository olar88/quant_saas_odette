/**
 * ClientRow — 單一客戶列表行
 *
 * 顯示一位客戶的基本資訊，包含：
 * - 頭像首字縮寫（過期客戶以紅色標示）
 * - 客戶名稱與短 ID
 * - 所屬策略標籤
 * - 管理資產金額與月變化率
 * - 「管理」操作按鈕
 * - 若 7 日內即將到期，左側顯示黃色警示條
 */

import { GlassCard } from "@/components/ui/glass-card";
import { formatCurrency } from "@/lib/format";
import type { DashboardClient } from "@/lib/types/dashboard";

interface ClientRowProps {
  /** 客戶資料物件 */
  client: DashboardClient;
}

export function ClientRow({ client }: Readonly<ClientRowProps>) {
  /** 判斷是否已過期 */
  const isExpired = client.expiry && new Date(client.expiry) < new Date();

  /** 判斷是否即將在 7 天內到期 */
  const isExpiringSoon =
    client.expiry &&
    new Date(client.expiry) <
      new Date(new Date().setDate(new Date().getDate() + 7));

  return (
    <GlassCard
      className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center group cursor-pointer relative overflow-hidden"
      hoverEffect
    >
      {/* ── 即將到期 → 左側黃色警示條 ── */}
      {isExpiringSoon && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
      )}

      {/* ── 頭像與名稱 ── */}
      <div className="col-span-4 w-full flex items-center gap-4">
        {/* 首字縮寫頭像：過期 = 紅底，正常 = 靛色底 */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${
            isExpired
              ? "bg-red-100 text-red-600"
              : "bg-indigo-100 text-indigo-600"
          }`}
        >
          {client.name?.charAt(0) || "?"}
        </div>
        <div>
          <p className="font-bold text-slate-700">{client.name}</p>
          <p className="text-xs text-slate-400">ID: #{client.clientId}</p>
        </div>
      </div>

      {/* ── 策略方案標籤 ── */}
      <div className="col-span-3 w-full">
        <span className="px-3 py-1 rounded-lg bg-white/50 border border-white/60 text-xs font-medium text-slate-600">
          {client.strategy || "未分配"}
        </span>
      </div>

      {/* ── 資金規模與月變化 ── */}
      <div className="col-span-3 w-full text-left md:text-right">
        <p className="font-bold text-slate-700">{formatCurrency(client.aum)}</p>
        {/* 註：月變化率目前為模擬值，待接入真實資料 */}
        <p className="text-[10px] text-green-500 font-medium">+2.1% 本月</p>
      </div>

      {/* ── 管理按鈕 ── */}
      <div className="col-span-2 w-full flex justify-end">
        <button className="bg-indigo-500 text-white text-xs px-4 py-1.5 rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-600 transition">
          管理
        </button>
      </div>
    </GlassCard>
  );
}
