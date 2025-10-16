"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ListFilter, Search, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Repair, RepairStatus } from "@/services/repairs";
import { useRouter } from "next/navigation";
import { getStatusSettings, StatusSettings, BadgeVariant } from "@/services/settings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ColumnVisibility = {
  id: boolean;
  customer: boolean;
  device: boolean;
  deviceType: boolean;
  problemDescription: boolean;
  technician: boolean;
  entryDate: boolean;
  status: boolean;
  imeiOrSn: boolean;
  totalQuote: boolean;
}

const statusFilters: RepairStatus[] = ["Cotización", "Confirmado", "En Reparación", "Reparado", "Entregado"];

interface RepairsTableProps {
  repairs: Repair[];
}

export default function RepairsTable({ repairs: initialRepairs }: RepairsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<RepairStatus | "Todas">("Todas");
  const [statusSettings, setStatusSettings] = useState<StatusSettings | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    customer: true,
    device: true,
    problemDescription: true,
    technician: true,
    entryDate: true,
    status: true,
    deviceType: false,
    imeiOrSn: false,
    totalQuote: false,
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchSettings() {
      const settings = await getStatusSettings();
      setStatusSettings(settings);
    }
    fetchSettings();
  }, []);

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({...prev, [column]: !prev[column]}));
  }

  const filteredRepairs = (initialRepairs || [])
    .filter(repair => activeTab === "Todas" || repair.status === activeTab)
    .filter(repair =>
      Object.values(repair).some(value => {
        if (typeof value === 'object' && value !== null) {
            if ('total' in value) {
                return String(value.total).toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );

  const getBadgeVariant = (status: RepairStatus): BadgeVariant => {
    return statusSettings![status] || 'outline';
  };
  
  return (
    <Card>
      <CardHeader>
          <CardTitle>Órdenes de Reparación</CardTitle>
          <CardDescription>Una lista de todos los equipos actualmente en el taller.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as RepairStatus | "Todas")}>
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
                      <DropdownMenuCheckboxItem checked={columnVisibility.deviceType} onCheckedChange={() => toggleColumn('deviceType')}>Tipo de Equipo</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.problemDescription} onCheckedChange={() => toggleColumn('problemDescription')}>Falla Reportada</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.technician} onCheckedChange={() => toggleColumn('technician')}>Técnico Asignado</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.entryDate} onCheckedChange={() => toggleColumn('entryDate')}>Fecha de Ingreso</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.imeiOrSn} onCheckedChange={() => toggleColumn('imeiOrSn')}>IMEI/SN</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked={columnVisibility.totalQuote} onCheckedChange={() => toggleColumn('totalQuote')}>Total Cotizado</DropdownMenuCheckboxItem>
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
              {/* Header */}
               <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground px-4 py-3 border-b">
                  <div className="col-span-3">Cliente / Equipo</div>
                  <div className="col-span-4">Falla Reportada</div>
                  <div className="col-span-2">Técnico</div>
                  <div className="col-span-1">Ingreso</div>
                  <div className="col-span-2">Estado</div>
               </div>
               
               {/* Body */}
               <div>
                {!statusSettings ? (
                  <div className="text-center p-8 text-muted-foreground">Cargando configuración...</div>
                ) : filteredRepairs.length === 0 ? (
                   <div className="text-center p-8 text-muted-foreground">No se encontraron resultados.</div>
                ) : (
                  filteredRepairs.map((repair) => (
                    <div 
                      key={repair.id} 
                      onClick={() => router.push(`/dashboard/entradas/${repair.id}`)}
                      className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b hover:bg-muted/50 transition-colors cursor-pointer text-sm"
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{repair.customer.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{repair.customer}</p>
                          <p className="text-xs text-muted-foreground">{repair.device}</p>
                        </div>
                      </div>

                      <div className="col-span-4 text-muted-foreground truncate">{repair.problemDescription}</div>
                      <div className="col-span-2 text-muted-foreground">{repair.technician}</div>
                      <div className="col-span-1 text-muted-foreground">{repair.entryDate.split('T')[0]}</div>
                      <div className="col-span-2">
                        <Badge variant={getBadgeVariant(repair.status)}>
                          {repair.status}
                        </Badge>
                      </div>

                    </div>
                  ))
                )}
               </div>
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
