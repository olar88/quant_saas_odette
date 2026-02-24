/**
 * StrategyDistributionCard — 策略資金分佈卡片
 *
 * 以 SVG 甜甜圈圖呈現各策略的資金佔比：
 * - Alpha 趨勢：65%
 * - Beta 中性：25%
 * - 其他策略：10%
 *
 * 註：目前圖表數值為靜態，待接入真實策略分佈資料
 */

import { GlassCard } from "@/components/ui/glass-card";

/** 策略分佈資料（靜態模擬） */
const STRATEGY_ITEMS = [
  { label: "Alpha 趨勢", color: "bg-indigo-500", percentage: 65 },
  { label: "Beta 中性", color: "bg-pink-400", percentage: 25 },
  { label: "其他策略", color: "bg-slate-300", percentage: 10 },
] as const;

export function StrategyDistributionCard() {
  return (
    <GlassCard className="p-6 rounded-3xl relative overflow-hidden">
      {/* ── 標題列 ── */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-700">策略資金分佈</h3>
        <button className="text-xs bg-white/50 px-2 py-1 rounded hover:bg-white transition">
          編輯
        </button>
      </div>

      {/* ── SVG 甜甜圈圖 ── */}
      <div className="flex items-center justify-center mb-6 relative">
        <svg viewBox="0 0 36 36" className="w-40 h-40 transform -rotate-90">
          {/* 底層灰色圓環 */}
          <path
            className="text-slate-200"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          {/* Alpha 趨勢（靛色，佔 65%） */}
          <path
            className="text-indigo-500"
            strokeDasharray="65, 100"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ animation: "progress 1s ease-out forwards" }}
          />
          {/* Beta 中性（粉色，佔 25%，偏移 -65） */}
          <path
            className="text-pink-400"
            strokeDasharray="25, 100"
            strokeDashoffset="-65"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ animation: "progress 1s ease-out forwards" }}
          />
        </svg>
        {/* 中央百分比文字 */}
        <div className="absolute text-center">
          <p className="text-xs text-slate-400">總佔比</p>
          <p className="text-2xl font-bold text-slate-700">100%</p>
        </div>
      </div>

      {/* ── 圖例清單 ── */}
      <div className="space-y-3">
        {STRATEGY_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
              <span className="text-slate-600">{item.label}</span>
            </div>
            <span className="font-bold text-slate-700">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
