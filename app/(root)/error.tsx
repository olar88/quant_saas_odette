"use client";

import { useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <GlassCard className="max-w-md w-full p-8 text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                    <AlertCircle className="w-8 h-8" />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong!</h2>
                    <p className="text-slate-500 text-sm">
                        {error.message || "An unexpected error occurred while loading this page."}
                    </p>
                </div>

                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl shadow-lg hover:bg-slate-900 transition active:scale-95"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </button>
            </GlassCard>
        </div>
    );
}
