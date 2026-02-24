import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import type { ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DataGridColumn<T> {
    /** Unique key for this column (used as React key) */
    key: string;
    /** Column header label */
    header: string;
    /** Render the cell content for this column */
    render: (row: T, index: number) => ReactNode;
    /** Header alignment */
    align?: "left" | "center" | "right";
    /** Extra className for header th */
    headerClassName?: string;
    /** Extra className for body td */
    cellClassName?: string;
}

export interface DataGridProps<T> {
    /** Column definitions */
    columns: DataGridColumn<T>[];
    /** Data rows */
    rows: T[];
    /** Unique key extractor for each row */
    getRowKey: (row: T, index: number) => string | number;
    /** Show loading skeleton */
    loading?: boolean;
    /** Number of skeleton rows to show when loading */
    skeletonRows?: number;
    /** Custom empty state message */
    emptyMessage?: string;
    /** Custom empty state node */
    emptyState?: ReactNode;
    /** Row click handler */
    onRowClick?: (row: T, index: number) => void;
    /** Conditional row className */
    rowClassName?: (row: T, index: number) => string;
    /** Extra className for the wrapper GlassCard */
    className?: string;
}

// ─── Skeleton Row ────────────────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: number }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 rounded-lg bg-slate-200/60 animate-pulse w-3/4" />
                </td>
            ))}
        </tr>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DataGrid<T>({
    columns,
    rows,
    getRowKey,
    loading = false,
    skeletonRows = 5,
    emptyMessage = "目前沒有資料。",
    emptyState,
    onRowClick,
    rowClassName,
    className,
}: DataGridProps<T>) {
    const alignMap = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <GlassCard className={cn("p-0 overflow-hidden rounded-3xl", className)}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/30 text-slate-500 font-medium border-b border-white/20">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        "px-6 py-4",
                                        alignMap[col.align ?? "left"],
                                        col.headerClassName
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                        {loading
                            ? Array.from({ length: skeletonRows }).map((_, i) => (
                                <SkeletonRow key={i} cols={columns.length} />
                            ))
                            : rows.length === 0
                                ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="text-center py-16 text-slate-400"
                                        >
                                            {emptyState ?? emptyMessage}
                                        </td>
                                    </tr>
                                )
                                : rows.map((row, idx) => (
                                    <tr
                                        key={getRowKey(row, idx)}
                                        className={cn(
                                            "hover:bg-white/30 transition",
                                            onRowClick && "cursor-pointer",
                                            rowClassName?.(row, idx)
                                        )}
                                        onClick={() => onRowClick?.(row, idx)}
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={cn(
                                                    "px-6 py-4",
                                                    alignMap[col.align ?? "left"],
                                                    col.cellClassName
                                                )}
                                            >
                                                {col.render(row, idx)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
