import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const locations = ["Tienda Principal", "Sucursal Norte", "Bodega Central"];
const repairComponents = ["Pantallas", "Baterías", "Puertos de Carga", "Cámaras"];

export default function RepairSettingsPage() {
  return (
    <>
      <PageHeader
        title="Configuración de Entradas"
        description="Gestiona la configuración específica del módulo de reparaciones y entradas."
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Secuencia de ID</CardTitle>
            <CardDescription>
              Configura el prefijo y el número de inicio para los IDs de las órdenes de reparación.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="id-prefix">Prefijo</label>
              <Input id="id-prefix" defaultValue="REP-" />
            </div>
            <div className="space-y-2">
              <label htmlFor="id-start-number">Número de Inicio</label>
              <Input id="id-start-number" type="number" defaultValue="001" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localidades</CardTitle>
            <CardDescription>Gestiona las localidades o sucursales donde se reciben equipos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
                {locations.map(loc => <li key={loc} className="rounded-md border p-3">{loc}</li>)}
            </ul>
             <Button variant="outline" className="mt-4">Añadir Localidad</Button>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Componentes de Reparación</CardTitle>
            <CardDescription>Gestiona la lista de componentes o piezas comunes utilizadas en reparaciones.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
                {repairComponents.map(comp => <li key={comp} className="rounded-md border p-3">{comp}</li>)}
            </ul>
             <Button variant="outline" className="mt-4">Añadir Componente</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API de Notificaciones</CardTitle>
            <CardDescription>
              Configura la integración con servicios de notificación (ej. WhatsApp, SMS) para mantener a los clientes informados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="api-url">URL del Webhook</label>
              <Input id="api-url" placeholder="https://api.example.com/webhook" />
            </div>
             <div className="space-y-2">
              <label htmlFor="api-key">Clave de API</label>
              <Input id="api-key" type="password" placeholder="********" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button>Guardar Configuración</Button>
        </div>
      </div>
    </>
  );
}
