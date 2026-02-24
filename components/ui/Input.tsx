"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type InputSize = "small" | "medium" | "large";

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    /** Label text above the input */
    label?: string;
    /** Helper text shown below the input */
    helperText?: string;
    /** Error state — turns the border / text red */
    error?: boolean;
    /** Error message (implies error=true) */
    errorMessage?: string;
    /** Icon or element at the start (left) */
    startAdornment?: ReactNode;
    /** Icon or element at the end (right) */
    endAdornment?: ReactNode;
    /** Size variant */
    size?: InputSize;
    /** Take full width */
    fullWidth?: boolean;
    /** Wrapper className */
    wrapperClassName?: string;
    /** Input className override */
    className?: string;
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeMap: Record<InputSize, { input: string; label: string }> = {
    small: { input: "px-3 py-1.5 text-xs rounded-lg", label: "text-xs" },
    medium: { input: "px-4 py-2.5 text-sm rounded-xl", label: "text-sm" },
    large: { input: "px-5 py-3 text-base rounded-xl", label: "text-sm" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error = false,
            errorMessage,
            startAdornment,
            endAdornment,
            size = "medium",
            fullWidth = true,
            wrapperClassName,
            className,
            disabled,
            id,
            ...rest
        },
        ref
    ) => {
        const hasError = error || !!errorMessage;
        const { input: inputSize, label: labelSize } = sizeMap[size];
        const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

        return (
            <div className={cn("space-y-1.5", fullWidth && "w-full", wrapperClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "font-medium text-slate-700",
                            labelSize,
                            hasError && "text-red-600"
                        )}
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {startAdornment && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {startAdornment}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        className={cn(
                            "glass-input w-full text-slate-700 placeholder:text-slate-400 outline-none transition-all",
                            inputSize,
                            startAdornment && "pl-10",
                            endAdornment && "pr-10",
                            hasError &&
                            "border-red-300 focus:ring-red-400/50 text-red-700 placeholder:text-red-300",
                            disabled && "opacity-50 cursor-not-allowed bg-slate-50/50",
                            className
                        )}
                        {...rest}
                    />

                    {endAdornment && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {endAdornment}
                        </span>
                    )}
                </div>

                {(helperText || errorMessage) && (
                    <p
                        className={cn(
                            "text-xs",
                            hasError ? "text-red-500" : "text-slate-400"
                        )}
                    >
                        {errorMessage ?? helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
