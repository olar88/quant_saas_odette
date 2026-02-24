"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { GlassCard } from "./glass-card";

// ─── Types ───────────────────────────────────────────────────────────────────

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
    /** Controls visibility */
    open: boolean;
    /** Called when the modal requests to close */
    onClose: () => void;
    /** Modal title */
    title?: string;
    /** Subtitle below title */
    subtitle?: string;
    /** Content */
    children: ReactNode;
    /** Footer actions slot */
    footer?: ReactNode;
    /** Width preset */
    size?: ModalSize;
    /** Hide the default close (X) button */
    hideCloseButton?: boolean;
    /** Extra className for the glass-card container */
    className?: string;
}

// ─── Size Map ────────────────────────────────────────────────────────────────

const sizeMap: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
};

// ─── Component ───────────────────────────────────────────────────────────────

export function Modal({
    open,
    onClose,
    title,
    subtitle,
    children,
    footer,
    size = "md",
    hideCloseButton = false,
    className,
}: ModalProps) {
    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Content */}
            <GlassCard
                className={cn(
                    "relative w-full p-0 rounded-3xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col",
                    sizeMap[size],
                    className
                )}
            >
                {/* Header */}
                {(title || !hideCloseButton) && (
                    <div className="flex justify-between items-start p-6 pb-0">
                        <div>
                            {title && (
                                <h3 className="text-xl font-bold text-slate-800">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {!hideCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-white/50 transition text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="p-6 pt-0 flex gap-3 justify-end">
                        {footer}
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
