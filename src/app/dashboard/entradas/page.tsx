"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { PlusCircle, ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

type ColumnVisibility = {
  id: boolean;
  customer: boolean;
  device: boolean;
  technician: boolean;
  entryDate: boolean;
  status: boolean;
}

const repairs = [
  { id: "REP-001", customer: "John Doe", device: "iPhone 14 - Pantalla rota", technician: "David Williams", status: "En Progreso", entryDate: "2024-05-10" },
  { id: "REP-002", customer: "Jane Smith", device: "Samsung S22 - Cambio de batería", technician: "David Williams", status: "Completado", entryDate: "2024-05-09" },
  { id: "REP-003", customer: "Peter Jones", device: "Google Pixel 7 - Problema de software", technician: "No Asignado", status: "Pendiente", entryDate: "2024-05-10" },
  { id: "REP-004", customer: "Mary Johnson", device: "iPhone 13 - Daño por agua", technician: "David Williams", status: "En Espera (Parte)", entryDate: "2024-05-08" },
];

export default function EntradasPage() {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    customer: true,
    device: true,
    technician: true,
    entryDate: true,
    status: true,
  });

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({...prev, [column]: !prev[column]}));
  }

  return (
    <>
      <PageHeader title="Entradas" description="Gestiona todas las reparaciones y seguimientos de equipos.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Entrada
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Órdenes de Reparación</CardTitle>
              <CardDescription>Una lista de todos los equipos actualmente en el taller.</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8 flex">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Vista
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mostrar/Ocultar Columnas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={columnVisibility.id} onCheckedChange={() => toggleColumn('id')}>
                  ID de Reparación
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={columnVisibility.customer} onCheckedChange={() => toggleColumn('customer')}>
                  Cliente
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={columnVisibility.device} onCheckedChange={() => toggleColumn('device')}>
                  Equipo y Falla
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={columnVisibility.technician} onCheckedChange={() => toggleColumn('technician')}>
                  Técnico Asignado
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={columnVisibility.entryDate} onCheckedChange={() => toggleColumn('entryDate')}>
                  Fecha de Ingreso
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={columnVisibility.status} onCheckedChange={() => toggleColumn('status')}>
                  Estado
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columnVisibility.id && <TableHead>ID de Reparación</TableHead>}
                {columnVisibility.customer && <TableHead>Cliente</TableHead>}
                {columnVisibility.device && <TableHead>Equipo y Falla</TableHead>}
                {columnVisibility.technician && <TableHead>Técnico Asignado</TableHead>}
                {columnVisibility.entryDate && <TableHead>Fecha de Ingreso</TableHead>}
                {columnVisibility.status && <TableHead>Estado</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairs.map((repair) => (
                <TableRow key={repair.id}>
                  {columnVisibility.id && <TableCell className="font-medium">{repair.id}</TableCell>}
                  {columnVisibility.customer && <TableCell>{repair.customer}</TableCell>}
                  {columnVisibility.device && <TableCell>{repair.device}</TableCell>}
                  {columnVisibility.technician && <TableCell>{repair.technician}</TableCell>}
                  {columnVisibility.entryDate && <TableCell>{repair.entryDate}</TableCell>}
                  {columnVisibility.status && <TableCell>
                    <Badge variant={
                        repair.status === 'Completado' ? 'default' : 
                        repair.status === 'En Progreso' ? 'secondary' : 
                        repair.status === 'Pendiente' ? 'outline' : 'destructive'
                    }>
                      {repair.status}
                    </Badge>
                  </TableCell>}
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
