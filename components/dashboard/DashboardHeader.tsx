/**
 * DashboardHeader — 儀表板頂部標題區塊
 *
 * 包含：
 * - 歡迎訊息與當日概況描述
 * - 客戶 / 策略搜尋輸入框
 * - 「新增資金」按鈕
 */

import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* 左側：歡迎文字 */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">早安, 管理者 👋</h2>
        <p className="text-slate-500 text-sm mt-1">
          以下是今日的資金與訂閱概況。
        </p>
      </div>

      {/* 右側：搜尋框 + 新增按鈕 */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* 搜尋輸入框 */}
        <div className="relative flex-1 md:w-64">
          <input
            type="text"
            placeholder="搜尋客戶或策略..."
            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-700 placeholder:text-slate-400"
          />
          <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
        </div>

        {/* 新增資金按鈕 */}
        <Button startIcon={<Plus className="w-4 h-4" />}>新增資金</Button>
      </div>
    </header>
  );
}
