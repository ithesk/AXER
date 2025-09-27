import { getRepairById } from "@/services/repairs";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { User, Smartphone, Wrench, Calendar, ArrowLeft, KeyRound, HardDrive, FileText, ClipboardPenLine, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RepairStatusProgress from "../components/repair-status-progress";
import { Badge } from "@/components/ui/badge";
import type { FunctionalityTestResult } from "@/services/repairs";
import type { BadgeVariant } from "@/components/ui/badge";

const functionalityTestItems: { name: keyof Omit<import("@/services/repairs").FunctionalityTestResults, 'other'>; label: string }[] = [
    { name: "cameraFront", label: "Cámara Frontal" },
    { name: "cameraBack", label: "Cámara Trasera" },
    { name: "chargingPort", label: "Puerto de Carga" },
    { name: "screen", label: "Pantalla (Brillo/Colores)" },
    { name: "touch", label: "Táctil" },
    { name: "buttons", label: "Botones (Volumen/Encendido)" },
    { name: "earpiece", label: "Altavoz Auricular" },
    { name: "speaker", label: "Altavoz Principal" },
    { name: "microphone", label: "Micrófono" },
    { name: "wifi", label: "Wi-Fi / Red" },
    { name: "biometrics", label: "Face ID / Lector de Huella" },
];


export default async function RepairDetailPage({ params }: { params: { id: string } }) {
  const repair = await getRepairById(params.id);

  if (!repair) {
    notFound();
  }
  
  const getStatusVariant = (status: FunctionalityTestResult): BadgeVariant => {
    switch (status) {
        case "ok": return "default";
        case "fail": return "destructive";
        case "na": return "secondary";
        default: return "outline";
    }
  }

  const getStatusLabel = (status: FunctionalityTestResult): string => {
    switch(status) {
      case "ok": return "OK";
      case "fail": return "Falla";
      case "na": return "N/A";
    }
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
          <CardTitle className="font-headline">Progreso de la Reparación</CardTitle>
        </CardHeader>
        <CardContent>
          <RepairStatusProgress currentStatus={repair.status} />
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 grid gap-6">
           <div className="grid gap-2">
            <h2 className="text-xl font-bold font-headline flex items-center gap-2"><FileText className="h-5 w-5" /> Descripción del Problema</h2>
            <p className="text-muted-foreground">{repair.problemDescription}</p>
          </div>
           <div className="grid gap-2">
            <h2 className="text-xl font-bold font-headline flex items-center gap-2"><ClipboardPenLine className="h-5 w-5" /> Evaluación Técnica</h2>
            <p className="text-muted-foreground">{repair.evaluation || "Pendiente de evaluación."}</p>
          </div>

          {repair.functionalityTest && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  Prueba de Funciones
                </CardTitle>
                 <CardDescription>Resultados de la prueba de funciones realizada al momento del ingreso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                  {functionalityTestItems.map(item => {
                      const result = repair.functionalityTest![item.name];
                      return (
                          <div key={item.name} className="flex items-center justify-between">
                              <span>{item.label}</span>
                              <Badge variant={getStatusVariant(result)} className="capitalize w-14 justify-center">{getStatusLabel(result)}</Badge>
                          </div>
                      )
                  })}
                </div>
                {repair.functionalityTest.other && (
                    <div className="pt-2">
                        <h4 className="text-sm font-medium">Otras Observaciones:</h4>
                        <p className="text-sm text-muted-foreground">{repair.functionalityTest.other}</p>
                    </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Información del Equipo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
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
                <hr className="my-2" />
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
                <div className="flex items-start gap-3">
                    <p className="text-muted-foreground font-mono text-xs w-5 flex-shrink-0 mt-1">S/N</p>
                    <div>
                        <p className="text-muted-foreground">IMEI o Número de Serie</p>
                        <p className="font-medium font-mono break-all">{repair.imeiOrSn}</p>
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
