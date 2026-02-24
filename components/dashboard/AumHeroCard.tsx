/**
 * AumHeroCard — 總管理資產（AUM）主視覺卡片
 *
 * 包含：
 * - 總 AUM 金額顯示
 * - 月成長率標示
 * - 三組迷你統計：活躍客戶數、預估月營收（MRR）、即將到期數
 * - 裝飾性漸層背景與 3D 球體光暈效果
 */

import { GlassCard } from "@/components/ui/glass-card";
import { ArrowUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DashboardData } from "@/lib/types/dashboard";

interface AumHeroCardProps {
  /** 總管理資產金額 */
  totalAum: DashboardData["totalAum"];
  /** 活躍客戶數 */
  clientCount: DashboardData["clientCount"];
  /** 預估月營收 */
  mrr: DashboardData["mrr"];
  /** 7 日內即將到期的訂閱數量 */
  expiringCount: DashboardData["expiringCount"];
}

export function AumHeroCard({
  totalAum,
  clientCount,
  mrr,
  expiringCount,
}: Readonly<AumHeroCardProps>) {
  return (
    <GlassCard className="relative overflow-hidden rounded-[2rem] border-none shadow-xl p-0">
      {/* ── 裝飾性背景漸層 ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-white opacity-80 z-0" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/40 to-transparent z-0" />

      {/* ── 3D 球體光暈裝飾 ── */}
      <div className="absolute -right-10 -top-20 w-80 h-80 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full blur-2xl opacity-20 animate-pulse" />

      {/* ── 主要內容 ── */}
      <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
        {/* 左側：AUM 數字與成長率 */}
        <div>
          <p className="text-slate-500 font-medium mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
            {"目前總管理資產 (Total AUM)"}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight">
            {formatCurrency(totalAum)}
          </h1>
          {/* 月成長率徽章 */}
          <div className="mt-4 flex items-center gap-3">
            <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-green-600 shadow-sm border border-white/50 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 3.2%
            </span>
            <span className="text-sm text-slate-500">較上月成長</span>
          </div>
        </div>

        {/* 右側：三組迷你統計指標 */}
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {/* 活躍客戶數 */}
          <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 min-w-[140px] shadow-sm">
            <p className="text-xs text-slate-500 mb-1">活躍客戶數</p>
            <p className="text-xl font-bold text-slate-800">
              {clientCount}{" "}
              <span className="text-xs font-normal text-slate-400">位</span>
            </p>
          </div>

          {/* 預估月營收 */}
          <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 min-w-[140px] shadow-sm">
            <p className="text-xs text-slate-500 mb-1">預估月營收 (MRR)</p>
            <p className="text-xl font-bold text-slate-800">
              {formatCurrency(mrr)}
            </p>
          </div>

          {/* 即將到期（7 日內） */}
          <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 min-w-[140px] shadow-sm border-l-4 border-l-brand-accent">
            <p className="text-xs text-brand-accent mb-1 font-bold">
              即將到期 (7日)
            </p>
            <p className="text-xl font-bold text-slate-800">
              {expiringCount}{" "}
              <span className="text-xs font-normal text-slate-400">位</span>
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
