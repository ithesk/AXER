"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Bell,
    Contact,
    Home,
    LineChart,
    Menu,
    Package,
    Settings,
    ShoppingCart,
    Users,
    Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";

const navItems = [
    { name: 'Panel', href: '/dashboard', icon: Home },
    { name: 'Inventario', href: '/dashboard/inventory', icon: Package },
    { name: 'Ventas', href: '/dashboard/sales', icon: ShoppingCart, badge: 6 },
    { name: 'Entradas', href: '/dashboard/entradas', icon: Wrench },
    { name: 'Clientes', href: '/dashboard/customers', icon: Contact },
    { name: 'Empleados', href: '/dashboard/employees', icon: Users },
    { name: 'Alertas', href: '/dashboard/alerts', icon: Bell, badge: 2, variant: 'destructive' as const },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
];

interface DashboardNavProps {
    isMobile: boolean;
}

export function DashboardNav({ isMobile }: DashboardNavProps) {
    const pathname = usePathname();

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                    {item.badge && (
                        <Badge className={cn("ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full", item.variant === 'destructive' && 'bg-destructive text-destructive-foreground')}>
                            {item.badge}
                        </Badge>
                    )}
                </Link>
            ))}
        </nav>
    );
}
