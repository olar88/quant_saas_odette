/**
 * 通用格式化工具函式
 */

/**
 * 將數字格式化為美元貨幣字串
 * @param amount - 要格式化的金額
 * @returns 格式化後的貨幣字串，例如 "$1,234,567.89"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
