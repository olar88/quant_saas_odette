import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ButtonVariant = "contained" | "outlined" | "text";
type ButtonColor =
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "warning"
    | "inherit";
type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
    /** The variant to use. */
    variant?: ButtonVariant;
    /** The color of the component. */
    color?: ButtonColor;
    /** The size of the component. */
    size?: ButtonSize;
    /** Element placed before the children. */
    startIcon?: ReactNode;
    /** Element placed after the children. */
    endIcon?: ReactNode;
    /** If `true`, the button will take up the full width of its container. */
    fullWidth?: boolean;
    /** If `true`, no elevation (shadow) is used. */
    disableElevation?: boolean;
    /** If `true`, the ripple effect is disabled. (reserved for future use) */
    disableRipple?: boolean;
    /** If `true`, the component is disabled. */
    disabled?: boolean;
    /** If `true`, show a loading spinner and disable the button. */
    loading?: boolean;
    /** If provided, the component renders as an `<a>` tag. */
    href?: string;
    /** Custom className for overriding / extending styles. */
    className?: string;
    /** The content of the component. */
    children?: ReactNode;
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const colorMap: Record<
    ButtonColor,
    { contained: string; outlined: string; text: string }
> = {
    primary: {
        contained:
            "bg-slate-800 text-white hover:bg-slate-900 shadow-lg shadow-slate-300/30",
        outlined:
            "border border-slate-800 text-slate-800 hover:bg-slate-800/5",
        text: "text-slate-800 hover:bg-slate-800/5",
    },
    secondary: {
        contained:
            "glass-card text-slate-600 hover:bg-gray-100 shadow-lg shadow-indigo-200/50",
        outlined:
            "border border-slate-600 text-slate-600 hover:bg-white/50",
        text: "text-slate-600 hover:bg-white/50",
    },
    error: {
        contained:
            "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200/50",
        outlined:
            "border border-red-500 text-red-500 hover:bg-red-500/5",
        text: "text-red-500 hover:bg-red-500/5",
    },
    success: {
        contained:
            "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200/50",
        outlined:
            "border border-emerald-500 text-emerald-500 hover:bg-emerald-500/5",
        text: "text-emerald-500 hover:bg-emerald-500/5",
    },
    warning: {
        contained:
            "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200/50",
        outlined:
            "border border-amber-500 text-amber-500 hover:bg-amber-500/5",
        text: "text-amber-500 hover:bg-amber-500/5",
    },
    inherit: {
        contained: "bg-gray-500 text-white hover:bg-gray-600",
        outlined: "border border-current hover:bg-current/5",
        text: "hover:bg-current/5",
    },
};

const sizeMap: Record<ButtonSize, string> = {
    small: "px-3 py-1.5 text-xs gap-1.5",
    medium: "px-5 py-2.5 text-sm gap-2",
    large: "px-7 py-3 text-base gap-2.5",
};

const iconSizeMap: Record<ButtonSize, string> = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
    large: "w-5 h-5",
};

// ─── Loading Spinner ─────────────────────────────────────────────────────────

function Spinner({ className }: { className?: string }) {
    return (
        <svg
            className={cn("animate-spin", className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "contained",
            color = "primary",
            size = "medium",
            startIcon,
            endIcon,
            fullWidth = false,
            disableElevation = false,
            disabled = false,
            loading = false,
            href,
            className,
            children,
            type = "button",
            ...rest
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        const baseStyles =
            "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400";

        const colorStyles = colorMap[color][variant];
        const sizeStyles = sizeMap[size];

        const composedClassName = cn(
            baseStyles,
            colorStyles,
            sizeStyles,
            fullWidth && "w-full",
            disableElevation && "shadow-none",
            isDisabled && "opacity-50 pointer-events-none cursor-not-allowed",
            className
        );

        const iconSize = iconSizeMap[size];

        const content = (
            <>
                {loading ? (
                    <Spinner className={iconSize} />
                ) : (
                    startIcon && (
                        <span className={cn("inline-flex shrink-0", iconSize)}>
                            {startIcon}
                        </span>
                    )
                )}
                {children && <span>{children}</span>}
                {endIcon && !loading && (
                    <span className={cn("inline-flex shrink-0", iconSize)}>
                        {endIcon}
                    </span>
                )}
            </>
        );

        // If href is provided, render as an anchor tag
        if (href && !isDisabled) {
            return (
                <a href={href} className={composedClassName} tabIndex={0}>
                    {content}
                </a>
            );
        }

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                className={composedClassName}
                {...rest}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = "Button";
