import { GlassCard } from "@/components/ui/glass-card";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Search, Plus, ArrowUp, ChevronRight, Activity } from "lucide-react";
import { getDashboardData } from "@/lib/actions/dashboard";

export default async function Home() {
  const data = await getDashboardData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">早安, 管理者 👋</h2>
          <p className="text-slate-500 text-sm mt-1">以下是今日的資金與訂閱概況。</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="搜尋客戶或策略..."
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-700 placeholder:text-slate-400"
            />
            <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          </div>
          <button className="bg-slate-800 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-slate-900 transition text-sm font-medium whitespace-nowrap flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新增資金
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <GlassCard className="relative overflow-hidden rounded-[2rem] border-none shadow-xl p-0">
        {/* Inner Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-white opacity-80 z-0" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/40 to-transparent z-0" />

        {/* 3D Orb Effect */}
        <div className="absolute -right-10 -top-20 w-80 h-80 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full blur-2xl opacity-20 animate-pulse" />

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
          <div>
            <p className="text-slate-500 font-medium mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
              目前總管理資產 (Total AUM)
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight">
              {formatCurrency(data.totalAum)}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-green-600 shadow-sm border border-white/50 flex items-center gap-1">
                <ArrowUp className="w-3 h-3" /> 3.2%
              </span>
              <span className="text-sm text-slate-500">較上月成長</span>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 min-w-[140px] shadow-sm">
              <p className="text-xs text-slate-500 mb-1">活躍客戶數</p>
              <p className="text-xl font-bold text-slate-800">{data.clientCount} <span className="text-xs font-normal text-slate-400">位</span></p>
            </div>
            <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 min-w-[140px] shadow-sm">
              <p className="text-xs text-slate-500 mb-1">預估月營收 (MRR)</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(data.mrr)}</p>
            </div>
            <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 min-w-[140px] shadow-sm border-l-4 border-l-brand-accent">
              <p className="text-xs text-brand-accent mb-1 font-bold">即將到期 (7日)</p>
              <p className="text-xl font-bold text-slate-800">{data.expiringCount} <span className="text-xs font-normal text-slate-400">位</span></p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Performance Chart Section */}
      <GlassCard className="p-6 rounded-[2rem]">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary" />
              策略綜合績效 (Strategy Performance)
            </h3>
            <p className="text-xs text-slate-400 mt-1">追蹤 Alpha 趨勢與 Beta 中性策略的歷史回報率</p>
          </div>

          <div className="flex bg-white/40 p-1 rounded-xl">
            {['1M', '3M', '6M', 'YTD'].map((period, i) => (
              <button
                key={period}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${i === 0 ? 'bg-white shadow text-slate-700' : 'text-slate-500 hover:bg-white/50'}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <PerformanceChart />
      </GlassCard>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Client List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-700">最新客戶動態</h3>
            <a href="#" className="text-sm text-brand-primary font-medium hover:underline flex items-center">查看全部 <ChevronRight className="w-4 h-4" /></a>
          </div>

          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">客戶名稱</div>
            <div className="col-span-3">策略方案</div>
            <div className="col-span-3 text-right">資金規模</div>
            <div className="col-span-2 text-right">狀態</div>
          </div>

          {/* Dynamic Client List */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data.recentClients.map((client: any) => (
            <GlassCard key={client.id} className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center group cursor-pointer relative overflow-hidden" hoverEffect>
              {/* Warning Strip for Expiring */}
              {client.expiry && new Date(client.expiry) < new Date(new Date().setDate(new Date().getDate() + 7)) && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
              )}

              <div className="col-span-4 w-full flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${client.expiry && new Date(client.expiry) < new Date() ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {client.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-slate-700">{client.name}</p>
                  <p className="text-xs text-slate-400">ID: #{client.clientId}</p>
                </div>
              </div>
              <div className="col-span-3 w-full">
                <span className="px-3 py-1 rounded-lg bg-white/50 border border-white/60 text-xs font-medium text-slate-600">
                  {client.strategy || '未分配'}
                </span>
              </div>
              <div className="col-span-3 w-full text-left md:text-right">
                <p className="font-bold text-slate-700">{formatCurrency(client.aum)}</p>
                {/* Mock Change */}
                <p className="text-[10px] text-green-500 font-medium">+2.1% 本月</p>
              </div>
              <div className="col-span-2 w-full flex justify-end">
                <button className="bg-indigo-500 text-white text-xs px-4 py-1.5 rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-600 transition">管理</button>
              </div>
            </GlassCard>
          ))}

          {data.recentClients.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">
              尚無客戶資料，請先在資料庫建立 Subscriptions。
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Donut Chart Card */}
          <GlassCard className="p-6 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-700">策略資金分佈</h3>
              <button className="text-xs bg-white/50 px-2 py-1 rounded hover:bg-white transition">編輯</button>
            </div>

            <div className="flex items-center justify-center mb-6 relative">
              <svg viewBox="0 0 36 36" className="w-40 h-40 transform -rotate-90">
                <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-indigo-500" strokeDasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: 'progress 1s ease-out forwards' }} />
                <path className="text-pink-400" strokeDasharray="25, 100" strokeDashoffset="-65" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ animation: 'progress 1s ease-out forwards' }} />
              </svg>
              <div className="absolute text-center">
                <p className="text-xs text-slate-400">總佔比</p>
                <p className="text-2xl font-bold text-slate-700">100%</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  <span className="text-slate-600">Alpha 趨勢</span>
                </div>
                <span className="font-bold text-slate-700">65%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-400"></span>
                  <span className="text-slate-600">Beta 中性</span>
                </div>
                <span className="font-bold text-slate-700">25%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                  <span className="text-slate-600">其他策略</span>
                </div>
                <span className="font-bold text-slate-700">10%</span>
              </div>
            </div>
          </GlassCard>

          {/* System Status */}
          <GlassCard className="p-5 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-700">系統狀態正常</p>
              <p className="text-xs text-slate-500">上次同步: 剛才</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
