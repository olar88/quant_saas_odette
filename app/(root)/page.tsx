/**
 * Home — 儀表板首頁（Server Component）
 *
 * 此頁面為量化基金管理系統的主儀表板，負責：
 * 1. 從伺服器端取得儀表板資料（getDashboardData）
 * 2. 將資料分發給各子元件進行渲染
 *
 * 頁面區塊組成（由上而下）：
 * - DashboardHeader：頂部標題、搜尋框與新增資金按鈕
 * - AumHeroCard：總管理資產（AUM）大數字卡片
 * - PerformanceChartSection：策略綜合績效折線圖
 * - RecentClientsSection：最新客戶動態列表（左欄）
 * - StrategyDistributionCard：策略資金分佈甜甜圈圖（右欄）
 * - SystemStatusCard：系統運行狀態指示（右欄）
 */

import { getDashboardData } from "@/lib/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AumHeroCard } from "@/components/dashboard/AumHeroCard";
import { PerformanceChartSection } from "@/components/dashboard/PerformanceChartSection";
import { RecentClientsSection } from "@/components/dashboard/RecentClientsSection";
import { StrategyDistributionCard } from "@/components/dashboard/StrategyDistributionCard";
import { SystemStatusCard } from "@/components/dashboard/SystemStatusCard";

export default async function Home() {
  // 從伺服器取得儀表板所需的所有資料
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* 頂部標題區：歡迎訊息、搜尋框、新增資金按鈕 */}
      <DashboardHeader />

      {/* 總管理資產（AUM）主視覺卡片 */}
      <AumHeroCard
        totalAum={data.totalAum}
        clientCount={data.clientCount}
        mrr={data.mrr}
        expiringCount={data.expiringCount}
      />

      {/* 策略綜合績效圖表 */}
      <PerformanceChartSection />

      {/* 下方分欄佈局：左 2/3 客戶列表 + 右 1/3 統計與狀態 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左欄：最新客戶動態列表 */}
        <RecentClientsSection clients={data.recentClients} />

        {/* 右欄：策略分佈圖 + 系統狀態 */}
        <div className="space-y-6">
          <StrategyDistributionCard />
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );
}
