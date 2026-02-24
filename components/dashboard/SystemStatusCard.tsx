/**
 * SystemStatusCard — 系統狀態指示卡片
 *
 * 顯示系統目前的運行狀態以及最後同步時間。
 * 使用綠色漸層圖示表達「正常」狀態。
 */

import { GlassCard } from "@/components/ui/glass-card";
import { Activity } from "lucide-react";

export function SystemStatusCard() {
  return (
    <GlassCard className="p-5 rounded-3xl flex items-center gap-4">
      {/* 狀態圖示 */}
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-200">
        <Activity className="w-6 h-6" />
      </div>

      {/* 狀態文字 */}
      <div>
        <p className="font-bold text-slate-700">系統狀態正常</p>
        <p className="text-xs text-slate-500">上次同步: 剛才</p>
      </div>
    </GlassCard>
  );
}
