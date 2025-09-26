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
    ChevronDown
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarMenuBadge } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


const navItems = [
    { name: 'Panel', href: '/dashboard', icon: Home },
    { name: 'Inventario', href: '/dashboard/inventory', icon: Package },
    { name: 'Ventas', href: '/dashboard/sales', icon: ShoppingCart, badge: 6 },
    { name: 'Clientes', href: '/dashboard/customers', icon: Contact },
    { name: 'Empleados', href: '/dashboard/employees', icon: Users },
    { name: 'Alertas', href: '/dashboard/alerts', icon: Bell, badge: 2, variant: 'destructive' as const },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
];

export function DashboardNav() {
    const pathname = usePathname();
    const { state } = useSidebar();
    const isEntradasPath = pathname.startsWith('/dashboard/entradas') || pathname.startsWith('/dashboard/equipos');

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    asChild
                    isActive={pathname === '/dashboard'}
                    tooltip={state === 'collapsed' ? 'Panel' : undefined}
                >
                   <Link href="/dashboard">
                        <Home />
                        <span>Panel</span>
                   </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton 
                    asChild
                    isActive={pathname === '/dashboard/inventory'}
                    tooltip={state === 'collapsed' ? 'Inventario' : undefined}
                >
                   <Link href="/dashboard/inventory">
                        <Package />
                        <span>Inventario</span>
                   </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton 
                    asChild
                    isActive={pathname === '/dashboard/sales'}
                    tooltip={state === 'collapsed' ? 'Ventas' : undefined}
                >
                   <Link href="/dashboard/sales">
                        <ShoppingCart />
                        <span>Ventas</span>
                        <SidebarMenuBadge>{6}</SidebarMenuBadge>
                   </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible asChild>
              <SidebarMenuItem className="flex flex-col">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={isEntradasPath}
                        tooltip={state === 'collapsed' ? 'Entradas' : undefined}
                        className="justify-between"
                    >
                        <div className="flex items-center gap-2">
                           <Wrench />
                           <span>Entradas</span>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/entradas"}>
                                <Link href="/dashboard/entradas">Ver Todas</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                         <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/entradas/registrar"}>
                                <Link href="/dashboard/entradas/registrar">Registrar Nueva</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/equipos"}>
                                <Link href="/dashboard/equipos">Gestionar Equipos</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>


            {navItems.filter(item => !['Panel', 'Inventario', 'Ventas', 'Entradas'].includes(item.name)).map((item) => (
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
