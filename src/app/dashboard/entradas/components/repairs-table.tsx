"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ListFilter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Repair, RepairStatus } from "@/services/repairs";
import { useRouter } from "next/navigation";
import { getStatusSettings, BadgeVariant } from "@/services/settings";
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
    .filter(repair => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        // Search across multiple relevant fields
        return (
            (repair.id?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.customer?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.device?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.technician?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.problemDescription?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.status?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.deviceType?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.imeiOrSn?.toLowerCase() || '').includes(lowerCaseSearchTerm)
        );
    });

  const getBadgeVariant = (status: RepairStatus): BadgeVariant => {
    if (!statusSettings) return 'outline';
    return statusSettings[status] || 'outline';
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
                  <TabsList className="overflow-x-auto">
                      <TabsTrigger key="Todas" value="Todas">Todas</TabsTrigger>
                      {statusFilters.map(status => (
                        <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
                      ))}
                  </TabsList>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 flex-shrink-0">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Vista
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Mostrar/Ocultar Columnas</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {Object.keys(columnVisibility).map((key) => {
                        const colKey = key as keyof ColumnVisibility;
                        // Simple way to format labels
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                         return (
                          <DropdownMenuCheckboxItem 
                            key={key}
                            checked={columnVisibility[colKey]} 
                            onCheckedChange={() => toggleColumn(colKey)}
                          >
                            {label === "Id" ? "ID" : label === "Imei Or Sn" ? "IMEI/SN" : label}
                          </DropdownMenuCheckboxItem>
                         )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
            
            <div className="border rounded-md mt-4">
               {/* Header (optional, for context) */}
               <div className="hidden lg:grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground px-4 py-3 border-b">
                  {columnVisibility.customer && <div className="col-span-3">Cliente / Equipo</div>}
                  {columnVisibility.problemDescription && <div className="col-span-3">Falla Reportada</div>}
                  {columnVisibility.technician && <div className="col-span-2">Técnico</div>}
                  {columnVisibility.entryDate && <div className="col-span-2">Ingreso</div>}
                  {columnVisibility.status && <div className="col-span-2 text-right">Estado</div>}
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
                      className="items-start px-4 py-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer text-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2">

                        {/* Customer & Device */}
                        {columnVisibility.customer && (
                          <div className="md:col-span-3 flex items-center gap-3">
                            <Avatar className="hidden sm:flex h-8 w-8">
                              <AvatarFallback>{repair.customer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{repair.customer}</p>
                              {columnVisibility.device && <p className="text-xs text-muted-foreground">{repair.device}</p>}
                            </div>
                          </div>
                        )}

                        {/* Problem Description */}
                        {columnVisibility.problemDescription && (
                          <div className="md:col-span-3 text-muted-foreground truncate self-center">
                            {repair.problemDescription}
                          </div>
                        )}

                        {/* Technician */}
                        {columnVisibility.technician && (
                          <div className="md:col-span-2 text-muted-foreground self-center">
                            {repair.technician}
                          </div>
                        )}

                        {/* Entry Date */}
                        {columnVisibility.entryDate && (
                          <div className="md:col-span-2 text-muted-foreground self-center">
                            {new Date(repair.entryDate).toLocaleDateString()}
                          </div>
                        )}

                        {/* Status */}
                        {columnVisibility.status && (
                          <div className="md:col-span-2 self-center md:text-right">
                            <Badge variant={getBadgeVariant(repair.status)}>
                              {repair.status}
                            </Badge>
                          </div>
                        )}
                        
                        {/* Other optional columns */}
                         <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs mt-2 pt-2 border-t border-dashed md:border-t-0 md:pt-0 md:mt-0">
                            {columnVisibility.id && (
                                <div className="text-muted-foreground"><span className="font-medium text-foreground">ID:</span> {repair.id}</div>
                            )}
                            {columnVisibility.deviceType && (
                                <div className="text-muted-foreground"><span className="font-medium text-foreground">Tipo:</span> {repair.deviceType}</div>
                            )}
                             {columnVisibility.imeiOrSn && repair.imeiOrSn && (
                                <div className="text-muted-foreground"><span className="font-medium text-foreground">IMEI/SN:</span> {repair.imeiOrSn}</div>
                            )}
                             {columnVisibility.totalQuote && repair.quote && (
                                <div className="text-muted-foreground"><span className="font-medium text-foreground">Cotización:</span> ${repair.quote.total.toFixed(2)}</div>
                            )}
                        </div>
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
