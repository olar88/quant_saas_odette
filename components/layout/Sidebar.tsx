"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PieChart, Settings, Shield, FileText } from "lucide-react";
import type { UserRole } from "@/lib/actions/users";

const roleLabels: Record<UserRole, string> = {
    super_admin: "超級管理員",
    manager: "客戶經理",
    viewer: "唯讀觀察員",
};

interface SidebarProps {
    userRole?: UserRole;
    userName?: string;
    avatarSeed?: string;
}

export function Sidebar({ userRole = "viewer", userName = "User", avatarSeed = "Felix" }: SidebarProps) {
    const pathname = usePathname();
    const isSuperAdmin = userRole === "super_admin";
    const canWrite = userRole !== "viewer";

    const navLinks = [
        {
            href: "/",
            label: "總覽儀表板",
            Icon: LayoutDashboard,
            show: true,
            /** Match exact / only */
            exact: true,
        },
        {
            href: "/customers",
            label: "客戶列表",
            Icon: Users,
            show: true,
            exact: false,
        },
        {
            href: "/funds",
            label: "資金報表",
            Icon: PieChart,
            show: canWrite,
            exact: false,
        },
        {
            href: "/settings/system-logs",
            label: "系統日誌",
            Icon: FileText,
            show: isSuperAdmin,
            exact: false,
        },
        {
            href: "/settings/profile",
            label: "用戶管理",
            Icon: Shield,
            show: isSuperAdmin,
            exact: false,
        },
    ];

    const isActive = (href: string, exact: boolean) => {
        if (exact) return pathname === href;
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <aside className="w-20 md:w-64 glass-sidebar fixed h-full flex flex-col justify-between py-6 transition-all duration-300 z-20">
            <div>
                {/* Logo */}
                <div className="px-6 mb-10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        Q
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent hidden md:block">
                        Quant.OS
                    </span>
                </div>

                {/* Role Badge */}
                {isSuperAdmin && (
                    <div className="mx-4 mb-4 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                        <Shield className="w-3.5 h-3.5 text-brand-primary" />
                        <span className="text-xs font-bold text-brand-primary">Super Admin</span>
                    </div>
                )}

                {/* Navigation */}
                <nav className="space-y-1 px-4">
                    {navLinks
                        .filter((link) => link.show)
                        .map(({ href, label, Icon, exact }) => {
                            const active = isActive(href, exact);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${active
                                            ? "bg-white/60 text-brand-primary font-semibold shadow-sm"
                                            : "hover:bg-white/40 text-slate-500"
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="hidden md:block">{label}</span>
                                </Link>
                            );
                        })}
                </nav>
            </div>

            {/* User Profile */}
            <div className="px-4 space-y-2">
                {/* Settings link */}
                <Link
                    href="/settings/profile"
                    className={`flex items-center gap-4 px-4 py-2.5 rounded-2xl transition-all ${pathname.startsWith("/settings/profile")
                            ? "bg-white/50 text-brand-primary"
                            : "hover:bg-white/40 text-slate-400"
                        }`}
                >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden md:block text-sm">設定</span>
                </Link>

                {/* User card */}
                <Link href="/settings/profile">
                    <div className="flex items-center gap-3 p-3 glass-card rounded-2xl cursor-pointer hover:bg-white/50 transition border-none shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                            className="w-8 h-8 rounded-full bg-white shadow-sm flex-shrink-0"
                            alt={userName}
                        />
                        <div className="hidden md:block min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate">{userName}</p>
                            <p className="text-xs text-slate-400">{roleLabels[userRole]}</p>
                        </div>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
