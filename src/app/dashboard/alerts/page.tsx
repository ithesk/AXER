import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAlerts } from "@/services/alerts";

export default async function AlertsPage() {
    const alerts = await getAlerts();

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
