import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PackageWarning, CalendarClock, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const alerts = [
    { id: 1, type: "Inventory", title: "Low Stock Warning", description: "iPhone 15 Pro stock is at 5 units in Downtown store.", icon: PackageWarning, variant: "destructive" as const, date: "2 hours ago" },
    { id: 2, type: "Schedule", title: "Scheduling Conflict", description: "John Doe and Jane Smith have overlapping shifts on Friday.", icon: CalendarClock, variant: "default" as const, date: "1 day ago" },
    { id: 3, type: "Inventory", title: "Out of Stock", description: "Samsung Galaxy Z Fold 5 is out of stock at Mall of America.", icon: PackageWarning, variant: "destructive" as const, date: "3 days ago" },
];

export default function AlertsPage() {
    return (
        <>
            <PageHeader title="Alerts & Notifications" description="Important events and updates requiring your attention." />

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                <div className="mt-4 space-y-4">
                    <TabsContent value="all">
                        {alerts.map(alert => (
                            <Alert key={alert.id} variant={alert.variant}>
                                <alert.icon className="h-4 w-4" />
                                <AlertTitle>{alert.title} <span className="text-xs text-muted-foreground font-normal ml-2">{alert.date}</span></AlertTitle>
                                <AlertDescription>
                                    {alert.description}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </TabsContent>
                    <TabsContent value="inventory">
                         {alerts.filter(a => a.type === 'Inventory').map(alert => (
                            <Alert key={alert.id} variant={alert.variant}>
                                <alert.icon className="h-4 w-4" />
                                <AlertTitle>{alert.title} <span className="text-xs text-muted-foreground font-normal ml-2">{alert.date}</span></AlertTitle>
                                <AlertDescription>
                                    {alert.description}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </TabsContent>
                    <TabsContent value="schedule">
                         {alerts.filter(a => a.type === 'Schedule').map(alert => (
                            <Alert key={alert.id} variant={alert.variant}>
                                <alert.icon className="h-4 w-4" />
                                <AlertTitle>{alert.title} <span className="text-xs text-muted-foreground font-normal ml-2">{alert.date}</span></AlertTitle>
                                <AlertDescription>
                                    {alert.description}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </TabsContent>
                </div>
            </Tabs>
        </>
    );
}
