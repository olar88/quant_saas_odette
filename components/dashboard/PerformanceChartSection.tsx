/**
 * PerformanceChartSection — 策略綜合績效圖表區塊
 *
 * 包含：
 * - 標題與副標題說明
 * - 時間區間切換按鈕（1M / 3M / 6M / YTD）
 * - 嵌入 PerformanceChart 圖表元件
 */

import { GlassCard } from "@/components/ui/glass-card";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Activity } from "lucide-react";

/** 可選的時間區間 */
const TIME_PERIODS = ["1M", "3M", "6M", "YTD"] as const;

export function PerformanceChartSection() {
  return (
    <GlassCard className="p-6 rounded-[2rem]">
      {/* ── 標題列 ── */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* 左側：圖表標題與描述 */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-primary" />
            策略綜合績效 (Strategy Performance)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            追蹤 Alpha 趨勢與 Beta 中性策略的歷史回報率
          </p>
        </div>

        {/* 右側：時間區間切換按鈕群組 */}
        <div className="flex bg-white/40 p-1 rounded-xl">
          {TIME_PERIODS.map((period, i) => (
            <button
              key={period}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                i === 0
                  ? "bg-white shadow text-slate-700"
                  : "text-slate-500 hover:bg-white/50"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* ── 圖表本體 ── */}
      <PerformanceChart />
    </GlassCard>
  );
}
