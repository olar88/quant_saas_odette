import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "primary";
type BadgeSize = "small" | "medium";

export interface BadgeProps {
    /** The color variant of the badge */
    variant?: BadgeVariant;
    /** Size of the badge */
    size?: BadgeSize;
    /** Show a colored dot before the label */
    dot?: boolean;
    /** Optional icon to show before label (overrides dot) */
    icon?: ReactNode;
    /** Badge content */
    children: ReactNode;
    /** Extra className */
    className?: string;
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const variantMap: Record<BadgeVariant, { badge: string; dot: string }> = {
    success: {
        badge: "bg-green-100/70 text-green-700 border-green-200/60",
        dot: "bg-green-500",
    },
    warning: {
        badge: "bg-yellow-100/70 text-yellow-700 border-yellow-200/60",
        dot: "bg-yellow-500",
    },
    error: {
        badge: "bg-red-100/70 text-red-700 border-red-200/60",
        dot: "bg-red-500",
    },
    info: {
        badge: "bg-blue-100/70 text-blue-700 border-blue-200/60",
        dot: "bg-blue-500",
    },
    neutral: {
        badge: "bg-slate-100/70 text-slate-600 border-slate-200/60",
        dot: "bg-slate-400",
    },
    primary: {
        badge: "bg-indigo-100/70 text-indigo-700 border-indigo-200/60",
        dot: "bg-indigo-500",
    },
};

const sizeMap: Record<BadgeSize, string> = {
    small: "text-[10px] px-2 py-0.5 gap-1",
    medium: "text-xs px-2.5 py-1 gap-1.5",
};

// ─── Component ───────────────────────────────────────────────────────────────

export function Badge({
    variant = "neutral",
    size = "medium",
    dot = false,
    icon,
    children,
    className,
}: BadgeProps) {
    const styles = variantMap[variant];

    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full border w-fit whitespace-nowrap",
                styles.badge,
                sizeMap[size],
                className
            )}
        >
            {icon ? (
                <span className="inline-flex shrink-0 w-3 h-3">{icon}</span>
            ) : dot ? (
                <span className={cn("inline-block w-1.5 h-1.5 rounded-full flex-shrink-0", styles.dot)} />
            ) : null}
            {children}
        </span>
    );
}
