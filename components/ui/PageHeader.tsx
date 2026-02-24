import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface PageHeaderProps {
    /** Page title */
    title: string;
    /** Subtitle / description */
    subtitle?: string;
    /** Right-side actions (buttons, search, etc.) */
    actions?: ReactNode;
    /** Back link slot (e.g. a Link with ArrowLeft icon) */
    backAction?: ReactNode;
    /** Extra className */
    className?: string;
}

export function PageHeader({
    title,
    subtitle,
    actions,
    backAction,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
                className
            )}
        >
            <div className="flex items-center gap-4">
                {backAction}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                    {subtitle && (
                        <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex gap-3 w-full md:w-auto items-center">
                    {actions}
                </div>
            )}
        </div>
    );
}
