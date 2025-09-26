import Link from "next/link";
import { Bell, Package, Home, ShoppingCart, Users, Contact, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { CompanySwitcher } from "@/components/company-switcher";
import { DashboardNav } from "@/components/dashboard-nav";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                     <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 17a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4Z"/><path d="M12 7V5"/><path d="M7 7V5"/><path d="M17 7V5"/></svg>
                        <span className="sr-only group-data-[collapsible=icon]:hidden">AXER</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <DashboardNav />
                </SidebarContent>
                <SidebarFooter>
                    <CompanySwitcher />
                </SidebarFooter>
            </Sidebar>
            <div className="flex flex-col flex-1">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
                    <SidebarTrigger className="shrink-0" />
                    <div className="w-full flex-1" />
                    <Button asChild variant="ghost" size="icon" className="rounded-full">
                        <Link href="/dashboard/alerts">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Toggle notifications</span>
                        </Link>
                    </Button>
                    <UserNav />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
