import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeviceData, DeviceData } from "@/services/devices";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ManageDevicesPage() {
  const deviceData = await getDeviceData();
  const deviceTypes = Object.keys(deviceData) as (keyof DeviceData)[];

  return (
    <>
      <PageHeader title="Gestionar Equipos" description="Añade, edita y elimina marcas y modelos de dispositivos.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Equipo
        </Button>
      </PageHeader>

      <Tabs defaultValue={deviceTypes[0]} className="w-full">
        <TabsList>
          {deviceTypes.map(type => (
            <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
          ))}
        </TabsList>
        {deviceTypes.map(type => (
            <TabsContent key={type} value={type}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {deviceData[type].brands.map(brand => (
                    <Card key={brand.name}>
                        <CardHeader>
                            <CardTitle>{brand.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {brand.models.map(model => (
                                    <li key={model}>{model}</li>
                                ))}
                           </ul>
                        </CardContent>
                    </Card>
                ))}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
