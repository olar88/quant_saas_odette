# Quant.OS — 量化交易客戶訂閱與資金管理 SaaS

> Next.js 16 + Supabase + Tailwind CSS 4 的量化基金後台管理系統

## 快速開始

```bash
# 安裝依賴
npm install

# 複製環境變數
cp .env.example .env.local
# → 填入 Supabase URL / Anon Key / Service Role Key / CRON_SECRET

# 啟動開發伺服器
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 即可使用。

---

## 環境變數

| 變數 | 說明 | 來源 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL | Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 匿名密鑰（前端可見） | Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | 服務角色密鑰（**僅 server-side**） | Dashboard → Settings → API → `service_role` |
| `CRON_SECRET` | Cron Job 驗證密鑰 | 自行產生：`openssl rand -hex 32` |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` 擁有完整資料庫權限，**絕對不能暴露在前端**。部署到 Vercel 時也需在 Settings → Environment Variables 加入。

---

## 資料庫設定

SQL 執行順序：

```
1. supabase/schema.sql           — 基礎資料表
2. supabase/rbac_migration.sql   — RBAC 角色與 RLS 策略
3. supabase/seed.sql             — 種子資料
4. supabase/expire_subscriptions.sql — 訂閱自動到期函數
```

使用 Supabase Dashboard → SQL Editor 依序執行。

---

## 訂閱自動到期系統 (Cron Job)

### 運作邏輯

系統每天自動檢查所有訂閱的 `expiry_date`，執行以下規則：

| 條件 | 動作 |
|------|------|
| `auto_renew = true` 且已到期 | 延長 `expiry_date` 一年，`start_date` 更新為今天，保持 `active` |
| `status = active` 且已到期 | 設為 `expired` |
| `status = paused` 且已到期 | 設為 `expired` |

### 目前方案：Vercel Cron（免費 plan）

- **排程**：每天 UTC 00:05（台北 08:05）
- **路徑**：`GET /api/cron/expire-subscriptions`
- **驗證**：需帶 `Authorization: Bearer <CRON_SECRET>` header
- **設定檔**：`vercel.json`

手動測試：

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/expire-subscriptions
```

### 升級 Supabase Pro 後切換至 pg_cron

1. Dashboard → Database → Extensions → 開啟 `pg_cron`
2. 在 SQL Editor 執行：

```sql
SELECT cron.schedule(
  'auto-expire-subscriptions',
  '5 0 * * *',
  'SELECT public.auto_expire_subscriptions()'
);
```

3. 刪除 `vercel.json` 中的 `crons` 區塊
4. 可選：刪除 `app/api/cron/` 和 `lib/supabase/admin.ts`

取消 pg_cron 排程：

```sql
SELECT cron.unschedule('auto-expire-subscriptions');
```

---

## 專案結構

```
app/
├── (auth)/login/              — 登入頁面
├── (root)/                    — 受保護區塊 (需登入)
│   ├── layout.tsx             — Sidebar + 主內容佈局
│   ├── page.tsx               — 儀表板首頁 (AUM / KPI)
│   ├── customers/             — 客戶管理
│   │   ├── page.tsx           — 客戶列表 (搜尋 / 篩選)
│   │   └── [customerId]/      — 客戶詳情 & 訂閱時間軸
│   ├── funds/                 — 資金策略
│   │   ├── page.tsx           — 策略池監控
│   │   └── audit-logs/        — 資金審計日誌
│   └── settings/
│       ├── profile/           — 個人設定
│       └── system-logs/       — 系統安全日誌
├── api/cron/                  — Cron Job API
│   └── expire-subscriptions/
└── globals.css                — Glass OS 設計系統

components/
├── ui/                        — 共用 UI 元件 (Badge, Button, DataGrid, ...)
├── layout/                    — Sidebar
├── dashboard/                 — 儀表板子元件
└── customers/                 — 客戶模組元件

lib/
├── supabase/server.ts         — SSR Supabase client
├── supabase/admin.ts          — service_role client (server-only)
└── actions/                   — Server actions

supabase/                      — SQL migrations & seed
```

---

## 部署

```bash
# 在 Vercel 上部署
vercel deploy --prod
```

確認在 Vercel Dashboard → Settings → Environment Variables 加入所有環境變數。

詳見 [Next.js 部署文件](https://nextjs.org/docs/app/building-your-application/deploying)。
