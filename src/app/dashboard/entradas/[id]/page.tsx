import { getRepairById } from "@/services/repairs";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { User, Smartphone, Wrench, Calendar, Tag, ArrowLeft, KeyRound, HardDrive, FileText, ClipboardPenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid gap-6">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><FileText className="h-5 w-5" /> Descripción del Problema</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{repair.problemDescription}</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><ClipboardPenLine className="h-5 w-5" /> Evaluación Técnica</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{repair.evaluation || "Pendiente de evaluación."}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Información General</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Estado</p>
                    <Badge variant={
                        repair.status === 'Completado' ? 'default' : 
                        repair.status === 'En Progreso' ? 'secondary' : 
                        repair.status === 'Pendiente' ? 'outline' : 'destructive'
                    }>
                      {repair.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Cliente</p>
                        <p className="font-medium">{repair.customer}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Técnico Asignado</p>
                        <p className="font-medium">{repair.technician}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Fecha y Hora de Ingreso</p>
                        <p className="font-medium">{new Date(repair.entryDate).toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Detalles del Equipo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
                <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Producto a Reparar</p>
                        <p className="font-medium">{repair.device}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <HardDrive className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Tipo de Equipo</p>
                        <p className="font-medium">{repair.deviceType}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-muted-foreground font-mono text-xs w-10">S/N</p>
                    <div>
                        <p className="text-muted-foreground">IMEI o Número de Serie</p>
                        <p className="font-medium font-mono">{repair.imeiOrSn}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <KeyRound className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Contraseña del Equipo</p>
                        <p className="font-medium">{repair.password || "No especificada"}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
