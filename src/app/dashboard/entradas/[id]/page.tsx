import { getRepairById } from "@/services/repairs";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { User, Smartphone, Wrench, Calendar, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function RepairDetailPage({ params }: { params: { id: string } }) {
  const repair = await getRepairById(params.id);

  if (!repair) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Detalle de Reparación`} description={`ID de Reparación: ${repair.id}`}>
        <Button variant="outline" asChild>
          <Link href="/dashboard/entradas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Entradas
          </Link>
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Información de la Reparación</CardTitle>
          <CardDescription>Resumen completo de la orden de reparación.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{repair.customer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Equipo y Falla</p>
                  <p className="font-medium">{repair.device}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Técnico Asignado</p>
                  <p className="font-medium">{repair.technician}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                  <p className="font-medium">{repair.entryDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant={
                      repair.status === 'Completado' ? 'default' : 
                      repair.status === 'En Progreso' ? 'secondary' : 
                      repair.status === 'Pendiente' ? 'outline' : 'destructive'
                  }>
                    {repair.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
