"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListFilter, Search, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Repair, RepairStatus } from "@/services/repairs";
import { useRouter } from "next/navigation";

type ColumnVisibility = {
  id: boolean;
  customer: boolean;
  device: boolean;
  problemDescription: boolean;
  technician: boolean;
  entryDate: boolean;
  status: boolean;
}

const statusFilters: RepairStatus[] = ["Cotización", "Confirmado", "En Reparación", "Reparado", "Entregado"];

interface RepairsTableProps {
  repairs: Repair[];
}

export default function RepairsTable({ repairs: initialRepairs }: RepairsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<RepairStatus | "Todas">("Todas");
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    customer: true,
    device: true,
    problemDescription: true,
    technician: true,
    entryDate: true,
    status: true,
  });
  const router = useRouter();

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({...prev, [column]: !prev[column]}));
  }

  const filteredRepairs = (initialRepairs || [])
    .filter(repair => activeTab === "Todas" || repair.status === activeTab)
    .filter(repair =>
      Object.values(repair).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const getBadgeVariant = (status: RepairStatus) => {
    switch (status) {
      case "Entregado":
        return "default";
      case "En Reparación":
        return "secondary";
      case "Reparado":
        return "secondary";
      case "Cotización":
        return "outline";
      case "Confirmado":
        return "outline";
      default:
        return "destructive";
    }
  };

  const renderTableRows = () => {
    if (filteredRepairs.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="h-24 text-center">
            No se encontraron resultados.
          </TableCell>
        </TableRow>
      );
    }
    return filteredRepairs.map((repair) => (
      <TableRow 
        key={repair.id} 
        onClick={() => router.push(`/dashboard/entradas/${repair.id}`)}
        className="cursor-pointer"
      >
        {columnVisibility.id && <TableCell className="font-medium">{repair.id}</TableCell>}
        {columnVisibility.customer && <TableCell>{repair.customer}</TableCell>}
        {columnVisibility.device && <TableCell>{repair.device}</TableCell>}
        {columnVisibility.problemDescription && <TableCell className="truncate max-w-xs">{repair.problemDescription}</TableCell>}
        {columnVisibility.technician && <TableCell>{repair.technician}</TableCell>}
        {columnVisibility.entryDate && <TableCell>{repair.entryDate.split('T')[0]}</TableCell>}
        {columnVisibility.status && <TableCell>
          <Badge variant={getBadgeVariant(repair.status)}>
            {repair.status}
          </Badge>
        </TableCell>}
      </TableRow>
    ));
  };
  
  return (
    <Card>
      <CardHeader>
          <CardTitle>Órdenes de Reparación</CardTitle>
          <CardDescription>Una lista de todos los equipos actualmente en el taller.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                      <TabsTrigger key="Todas" value="Todas">Todas</TabsTrigger>
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
                      <DropdownMenuCheckboxItem checked={columnVisibility.device} onCheckedChange={() => toggleColumn('device')}>Equipo</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.problemDescription} onCheckedChange={() => toggleColumn('problemDescription')}>Falla Reportada</DropdownMenuCheckboxItem>
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
            <div className="border rounded-md mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columnVisibility.id && <TableHead>ID</TableHead>}
                    {columnVisibility.customer && <TableHead>Cliente</TableHead>}
                    {columnVisibility.device && <TableHead>Equipo</TableHead>}
                    {columnVisibility.problemDescription && <TableHead>Falla Reportada</TableHead>}
                    {columnVisibility.technician && <TableHead>Técnico</TableHead>}
                    {columnVisibility.entryDate && <TableHead>Ingreso</TableHead>}
                    {columnVisibility.status && <TableHead>Estado</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableRows()}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>{filteredRepairs.length}</strong> de <strong>{initialRepairs.length}</strong> entradas
        </div>
      </CardFooter>
    </Card>
  );
}
