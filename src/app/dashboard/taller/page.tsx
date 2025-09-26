import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const repairs = [
  { id: "REP-001", customer: "John Doe", device: "iPhone 14 - Pantalla rota", technician: "David Williams", status: "En Progreso", entryDate: "2024-05-10" },
  { id: "REP-002", customer: "Jane Smith", device: "Samsung S22 - Cambio de batería", technician: "David Williams", status: "Completado", entryDate: "2024-05-09" },
  { id: "REP-003", customer: "Peter Jones", device: "Google Pixel 7 - Problema de software", technician: "No Asignado", status: "Pendiente", entryDate: "2024-05-10" },
  { id: "REP-004", customer: "Mary Johnson", device: "iPhone 13 - Daño por agua", technician: "David Williams", status: "En Espera (Parte)", entryDate: "2024-05-08" },
];

export default function WorkshopPage() {
  return (
    <>
      <PageHeader title="Taller" description="Gestiona todas las reparaciones y seguimientos de equipos.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Entrada
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Reparación</CardTitle>
          <CardDescription>Una lista de todos los equipos actualmente en el taller.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Reparación</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Equipo y Falla</TableHead>
                <TableHead>Técnico Asignado</TableHead>
                <TableHead>Fecha de Ingreso</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell className="font-medium">{repair.id}</TableCell>
                  <TableCell>{repair.customer}</TableCell>
                  <TableCell>{repair.device}</TableCell>
                  <TableCell>{repair.technician}</TableCell>
                  <TableCell>{repair.entryDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                        repair.status === 'Completado' ? 'default' : 
                        repair.status === 'En Progreso' ? 'secondary' : 
                        repair.status === 'Pendiente' ? 'outline' : 'destructive'
                    }>
                      {repair.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-4</strong> de <strong>{repairs.length}</strong> reparaciones
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
