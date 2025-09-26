"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { PlusCircle, ListFilter, Search, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ColumnVisibility = {
  id: boolean;
  customer: boolean;
  device: boolean;
  technician: boolean;
  entryDate: boolean;
  status: boolean;
}

const repairsData = [
  { id: "REP-001", customer: "John Doe", device: "iPhone 14 - Pantalla rota", technician: "David Williams", status: "En Progreso", entryDate: "2024-05-10" },
  { id: "REP-002", customer: "Jane Smith", device: "Samsung S22 - Cambio de batería", technician: "David Williams", status: "Completado", entryDate: "2024-05-09" },
  { id: "REP-003", customer: "Peter Jones", device: "Google Pixel 7 - Problema de software", technician: "No Asignado", status: "Pendiente", entryDate: "2024-05-10" },
  { id: "REP-004", customer: "Mary Johnson", device: "iPhone 13 - Daño por agua", technician: "David Williams", status: "En Espera (Parte)", entryDate: "2024-05-08" },
];

const statusFilters = ["Todas", "Pendiente", "En Progreso", "Completado", "En Espera (Parte)"];

export default function EntradasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Todas");
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

  const filteredRepairs = repairsData
    .filter(repair => activeTab === "Todas" || repair.status === activeTab)
    .filter(repair =>
      Object.values(repair).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const renderTableRows = (repairs: typeof repairsData) => {
    if (repairs.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="h-24 text-center">
            No se encontraron resultados.
          </TableCell>
        </TableRow>
      );
    }
    return repairs.map((repair) => (
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
    ))
  };

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
            <CardTitle>Órdenes de Reparación</CardTitle>
            <CardDescription>Una lista de todos los equipos actualmente en el taller.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, equipo, estado..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <TabsList>
                    {statusFilters.map(status => (
                      <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
                    ))}
                  </TabsList>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 flex">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Vista
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Mostrar/Ocultar Columnas</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked={columnVisibility.id} onCheckedChange={() => toggleColumn('id')}>ID de Reparación</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.customer} onCheckedChange={() => toggleColumn('customer')}>Cliente</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.device} onCheckedChange={() => toggleColumn('device')}>Equipo y Falla</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.technician} onCheckedChange={() => toggleColumn('technician')}>Técnico Asignado</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.entryDate} onCheckedChange={() => toggleColumn('entryDate')}>Fecha de Ingreso</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.status} onCheckedChange={() => toggleColumn('status')}>Estado</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9">
                              <Settings className="h-4 w-4" />
                              <span className="sr-only">Configuración</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Configuración del Módulo</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ajustes de Notificaciones</DropdownMenuItem>
                          <DropdownMenuItem>Estados Personalizados</DropdownMenuItem>
                          <DropdownMenuItem>Técnicos</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columnVisibility.id && <TableHead>ID</TableHead>}
                    {columnVisibility.customer && <TableHead>Cliente</TableHead>}
                    {columnVisibility.device && <TableHead>Equipo y Falla</TableHead>}
                    {columnVisibility.technician && <TableHead>Técnico</TableHead>}
                    {columnVisibility.entryDate && <TableHead>Ingreso</TableHead>}
                    {columnVisibility.status && <TableHead>Estado</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableRows(filteredRepairs)}
                </TableBody>
              </Table>
            </div>

          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>{filteredRepairs.length}</strong> de <strong>{repairsData.length}</strong> entradas
          </div>
        </CardFooter>
      </Card>
    </>
  );
}