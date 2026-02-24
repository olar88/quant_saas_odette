"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface SearchInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
    /** Current search value (controlled) */
    value?: string;
    /** Callback when the clear button is clicked */
    onClear?: () => void;
    /** Size variant */
    size?: "small" | "medium";
    /** Extra className for the wrapper */
    wrapperClassName?: string;
}

const sizeStyles = {
    small: "pl-8 pr-8 py-1.5 text-xs rounded-lg",
    medium: "pl-10 pr-10 py-2.5 text-sm rounded-xl",
};

const iconSizeStyles = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            value,
            onClear,
            size = "medium",
            wrapperClassName,
            className,
            placeholder = "搜尋...",
            ...rest
        },
        ref
    ) => {
        const showClear = value && value.length > 0;

        return (
            <div className={cn("relative", wrapperClassName)}>
                <Search
                    className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none",
                        iconSizeStyles[size]
                    )}
                />
                <input
                    ref={ref}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    className={cn(
                        "glass-input w-full text-slate-700 placeholder:text-slate-400 outline-none transition-all",
                        sizeStyles[size],
                        className
                    )}
                    {...rest}
                />
                {showClear && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                        <X className={iconSizeStyles[size]} />
                    </button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput";
