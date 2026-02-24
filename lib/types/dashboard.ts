/**
 * 儀表板相關的型別定義
 */

/** 客戶資料（由 getDashboardData 回傳的扁平化格式） */
export interface DashboardClient {
  /** 客戶 UUID */
  id: string;
  /** 客戶名稱 */
  name: string;
  /** 短 ID（前 8 碼） */
  clientId: string;
  /** 所屬策略名稱 */
  strategy: string | null;
  /** 管理資產金額 */
  aum: number;
  /** 訂閱狀態 */
  status: string;
  /** 到期日 */
  expiry: string | null;
  /** 頭像網址 */
  avatar: string | null;
}

/** getDashboardData 回傳的完整資料結構 */
export interface DashboardData {
  /** 總管理資產（Total AUM） */
  totalAum: number;
  /** 活躍客戶數量 */
  clientCount: number;
  /** 7 日內即將到期的訂閱數量 */
  expiringCount: number;
  /** 最近的客戶清單（最多 5 筆） */
  recentClients: DashboardClient[];
  /** 預估月營收（Monthly Recurring Revenue） */
  mrr: number;
}
