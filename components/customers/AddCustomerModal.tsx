"use client";

import { useState, useTransition } from "react";
import { createCustomer, getStrategies } from "@/lib/actions/customers";
import { X, Loader2, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "../ui/button";

type Strategy = { id: string; name: string };

interface AddCustomerModalProps {
    strategies: Strategy[];
    onClose: () => void;
}

export function AddCustomerModal({ strategies, onClose }: AddCustomerModalProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setError(null);

        startTransition(async () => {
            const result = await createCustomer(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                onClose();
            }
        });
    };

    // Get min date for expiry (today)
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <GlassCard className="w-full max-w-lg p-8 rounded-3xl shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">新增客戶</h3>
                        <p className="text-sm text-slate-500 mt-0.5">建立新客戶與訂閱方案</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/50 transition text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">客戶姓名</label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="王大明"
                                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-primary/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">電子信箱</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="wang@example.com"
                                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-primary/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">訂閱策略</label>
                        <select
                            name="strategy_id"
                            required
                            className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none bg-white/50"
                        >
                            <option value="" disabled selected>選擇策略方案...</option>
                            {strategies.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">初始 AUM (USD)</label>
                            <input
                                name="aum"
                                type="number"
                                required
                                min={0}
                                step={1000}
                                placeholder="1000000"
                                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-primary/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">到期日</label>
                            <input
                                name="expiry_date"
                                type="date"
                                required
                                min={today}
                                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button className="flex-1" color='secondary' startIcon={<Plus className="w-4 h-4" />} onClick={onClose} >
                            取消
                        </Button>
                        <Button className="flex-1" type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "建立客戶"}
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}

// Wrapper component that fetches strategies and manages modal state
export function AddCustomerButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [strategies, setStrategies] = useState<Strategy[]>([]);

    const handleOpen = async () => {
        // Fetch strategies when opening for the first time
        if (strategies.length === 0) {
            const data = await getStrategies();
            setStrategies(data);
        }
        setIsOpen(true);
    };

    return (
        <>
            <Button startIcon={<Plus className="w-4 h-4" />} onClick={handleOpen} >
                新增客戶
            </Button>
            {isOpen && (
                <AddCustomerModal
                    strategies={strategies}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
