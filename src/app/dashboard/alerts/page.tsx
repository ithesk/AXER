import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PackageWarning, CalendarClock, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const alerts = [
    { id: 1, type: "Inventario", title: "Advertencia de Stock Bajo", description: "El stock de iPhone 15 Pro es de 5 unidades en la tienda del centro.", icon: PackageWarning, variant: "destructive" as const, date: "Hace 2 horas" },
    { id: 2, type: "Horario", title: "Conflicto de Horario", description: "John Doe y Jane Smith tienen turnos superpuestos el viernes.", icon: CalendarClock, variant: "default" as const, date: "Hace 1 día" },
    { id: 3, type: "Inventario", title: "Agotado", description: "Samsung Galaxy Z Fold 5 está agotado en el Mall of America.", icon: PackageWarning, variant: "destructive" as const, date: "Hace 3 días" },
];

export default function AlertsPage() {
    return (
        <>
            <PageHeader title="Alertas y Notificaciones" description="Eventos y actualizaciones importantes que requieren tu atención." />

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="inventory">Inventario</TabsTrigger>
                    <TabsTrigger value="schedule">Horario</TabsTrigger>
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
                         {alerts.filter(a => a.type === 'Inventario').map(alert => (
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
                         {alerts.filter(a => a.type === 'Horario').map(alert => (
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
