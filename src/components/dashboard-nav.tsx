"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarMenuBadge } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";


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

export function DashboardNav() {
    const pathname = usePathname();
    const { state } = useSidebar();

    return (
        <SidebarMenu>
            {navItems.map((item) => (
                 <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                        asChild
                        isActive={pathname === item.href}
                        tooltip={state === 'collapsed' ? item.name : undefined}
                    >
                       <Link href={item.href}>
                            <item.icon />
                            <span>{item.name}</span>
                             {item.badge && (
                                <SidebarMenuBadge className={cn(item.variant === 'destructive' && 'bg-destructive text-destructive-foreground')}>
                                    {item.badge}
                                </SidebarMenuBadge>
                            )}
                       </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
