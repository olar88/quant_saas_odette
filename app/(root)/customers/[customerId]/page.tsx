import { GlassCard } from "@/components/ui/glass-card";
import { ArrowLeft, Wallet, Calendar, Mail, CheckCircle, PauseCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { getCustomerById } from "@/lib/actions/customers";
import { notFound } from "next/navigation";

const statusConfig = {
    active: {
        label: "訂閱中",
        Icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
    },
    paused: {
        label: "已暫停",
        Icon: PauseCircle,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
    },
    expired: {
        label: "已到期",
        Icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
    },
};

export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params;
    const result = await getCustomerById(customerId);

    if (!result) notFound();

    const { client, subscriptions } = result;
    const activeSub = subscriptions.find((s) => s.status === "active") ?? subscriptions[0];

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(amount);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <Link
                    href="/customers"
                    className="p-2 rounded-xl hover:bg-white/40 transition text-slate-500"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {client.name} — 客戶詳情
                    </h2>
                    <p className="text-slate-500 text-sm">
                        加入時間：{formatDate(client.created_at)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <GlassCard className="p-6 rounded-3xl flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 mb-4 shadow-inner flex items-center justify-center text-3xl font-bold text-indigo-700">
                            {client.name?.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{client.name}</h3>
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1 mb-6">
                            <Mail className="w-3.5 h-3.5" />
                            {client.email ?? "無電子信箱"}
                        </div>

                        <div className="flex gap-2 w-full">
                            <button className="flex-1 bg-slate-800 text-white py-2.5 rounded-xl text-sm font-medium shadow-lg hover:bg-slate-900 transition">
                                續費 (Renew)
                            </button>
                        </div>
                    </GlassCard>

                    {/* Current Subscription Stat */}
                    {activeSub && (
                        <GlassCard className="p-6 rounded-3xl space-y-4">
                            <h4 className="font-bold text-slate-700 border-b border-white/20 pb-2">
                                當前訂閱
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">策略名稱</p>
                                    <p className="font-semibold text-slate-700">
                                        {activeSub.strategies?.name ?? "未分配"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">目前資產 (AUM)</p>
                                    <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-brand-primary" />
                                        {formatCurrency(activeSub.current_aum)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">訂閱到期日</p>
                                    <p className="font-semibold text-slate-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-brand-secondary" />
                                        {activeSub.expiry_date
                                            ? formatDate(activeSub.expiry_date)
                                            : "無到期日"}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    )}
                </div>

                {/* Right Column: Subscription History */}
                <div className="lg:col-span-2">
                    <GlassCard className="p-8 rounded-3xl min-h-[400px]">
                        <h3 className="font-bold text-slate-800 mb-6">訂閱歷史時間軸</h3>

                        {subscriptions.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-10">
                                尚無訂閱記錄。
                            </p>
                        ) : (
                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-8 py-2">
                                {subscriptions.map((sub, index) => {
                                    const status =
                                        statusConfig[sub.status as keyof typeof statusConfig] ??
                                        statusConfig.active;
                                    const { Icon } = status;
                                    return (
                                        <div key={sub.id} className="relative">
                                            <div
                                                className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full ${index === 0 ? "bg-brand-primary" : "bg-slate-300"
                                                    } border-4 border-slate-50 shadow-sm`}
                                            />
                                            <p className="text-sm text-slate-500 mb-1">
                                                {formatDate(sub.created_at)}
                                            </p>
                                            <div className="bg-white/40 p-4 rounded-xl border border-white/50 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-slate-700 text-sm">
                                                        {sub.strategies?.name ?? "未知策略"}
                                                    </p>
                                                    <span
                                                        className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}
                                                    >
                                                        <Icon className="w-3 h-3" />
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="flex gap-6 text-xs text-slate-500">
                                                    <span>
                                                        AUM:{" "}
                                                        <span className="font-semibold text-slate-700">
                                                            {formatCurrency(sub.current_aum)}
                                                        </span>
                                                    </span>
                                                    {sub.expiry_date && (
                                                        <span>
                                                            到期:{" "}
                                                            <span className="font-semibold text-slate-700">
                                                                {formatDate(sub.expiry_date)}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
