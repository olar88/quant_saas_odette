"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type IconButtonSize = "small" | "medium" | "large";
type IconButtonColor = "default" | "primary" | "error" | "success" | "warning";
type IconButtonVariant = "contained" | "outlined" | "text";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Icon to render inside the button */
    children: ReactNode;
    /** Size of the button */
    size?: IconButtonSize;
    /** Color theme */
    color?: IconButtonColor;
    /** Visual variant */
    variant?: IconButtonVariant;
    /** Tooltip string (native title) */
    title?: string;
    /** Disables the button */
    disabled?: boolean;
    /** Extra className */
    className?: string;
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeMap: Record<IconButtonSize, { btn: string; icon: string }> = {
    small: { btn: "w-7 h-7", icon: "w-3.5 h-3.5" },
    medium: { btn: "w-9 h-9", icon: "w-4 h-4" },
    large: { btn: "w-11 h-11", icon: "w-5 h-5" },
};

const colorMap: Record<IconButtonColor, Record<IconButtonVariant, string>> = {
    default: {
        contained: "bg-slate-100 text-slate-600 hover:bg-slate-200",
        outlined: "border border-slate-300 text-slate-600 hover:bg-slate-50",
        text: "text-slate-500 hover:bg-slate-100/70",
    },
    primary: {
        contained: "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-200",
        outlined: "border border-indigo-400 text-indigo-600 hover:bg-indigo-50",
        text: "text-indigo-500 hover:bg-indigo-50",
    },
    error: {
        contained: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200",
        outlined: "border border-red-400 text-red-600 hover:bg-red-50",
        text: "text-red-500 hover:bg-red-50",
    },
    success: {
        contained: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200",
        outlined: "border border-emerald-400 text-emerald-600 hover:bg-emerald-50",
        text: "text-emerald-500 hover:bg-emerald-50",
    },
    warning: {
        contained: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-200",
        outlined: "border border-amber-400 text-amber-600 hover:bg-amber-50",
        text: "text-amber-500 hover:bg-amber-50",
    },
};

// ─── Component ───────────────────────────────────────────────────────────────

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            children,
            size = "medium",
            color = "default",
            variant = "text",
            disabled = false,
            className,
            ...rest
        },
        ref
    ) => {
        const { btn, icon } = sizeMap[size];
        const colorStyle = colorMap[color][variant];

        return (
            <button
                ref={ref}
                type="button"
                disabled={disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400 cursor-pointer",
                    btn,
                    colorStyle,
                    disabled && "opacity-40 pointer-events-none cursor-not-allowed",
                    className
                )}
                {...rest}
            >
                <span className={cn("inline-flex shrink-0", icon)}>{children}</span>
            </button>
        );
    }
);

IconButton.displayName = "IconButton";
