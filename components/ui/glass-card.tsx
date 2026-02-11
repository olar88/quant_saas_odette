import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({
    children,
    className,
    hoverEffect = false,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card rounded-2xl transition-all duration-300",
                hoverEffect && "hover:shadow-glass-hover hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
