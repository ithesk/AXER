"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ListFilter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Repair, RepairStatus } from "@/services/repairs";
import { useRouter } from "next/navigation";
import { getStatusSettings, type StatusSettings } from "@/services/settings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { BadgeVariant } from "@/components/ui/badge";

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
        // Search in the most relevant fields regardless of visibility
        return (
            (repair.id?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.customer?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.device?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.technician?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (repair.problemDescription?.toLowerCase() || '').includes(lowerCaseSearchTerm)
        );
    });

  const getBadgeVariant = (status: RepairStatus): BadgeVariant => {
    if (!statusSettings) return 'outline';
    return statusSettings[status] || 'outline';
  };
  
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[1]) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  }
  
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
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                         return (
                          <DropdownMenuCheckboxItem 
                            key={key}
                            checked={columnVisibility[colKey]} 
                            onCheckedChange={() => toggleColumn(colKey)}
                          >
                            {label === "Id" ? "ID" : label === "Imei Or Sn" ? "IMEI/SN" : label === 'Total Quote' ? 'Cotización' : label}
                          </DropdownMenuCheckboxItem>
                         )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
            
            <div className="border rounded-md mt-4">
               {!statusSettings ? (
                  <div className="text-center p-8 text-muted-foreground">Cargando configuración...</div>
                ) : filteredRepairs.length === 0 ? (
                   <div className="text-center p-8 text-muted-foreground">No se encontraron resultados.</div>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columnVisibility.customer && <TableHead>Cliente</TableHead>}
                      {columnVisibility.device && <TableHead>Equipo</TableHead>}
                      {columnVisibility.problemDescription && <TableHead>Problema</TableHead>}
                      {columnVisibility.technician && <TableHead>Técnico</TableHead>}
                      {columnVisibility.status && <TableHead>Estado</TableHead>}
                      {columnVisibility.entryDate && <TableHead className="text-right">Fecha Ingreso</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRepairs.map((repair) => (
                      <TableRow 
                        key={repair.id} 
                        onClick={() => router.push(`/dashboard/entradas/${repair.id}`)}
                        className="cursor-pointer"
                      >
                        {columnVisibility.customer && (
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{getInitials(repair.customer)}</AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="font-medium text-foreground">{repair.customer}</p>
                                 {columnVisibility.id && <p className="text-xs text-muted-foreground">{repair.id}</p>}
                              </div>
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.device && (
                           <TableCell>
                             <div className="flex flex-col">
                                <span className="font-medium text-foreground">{repair.device}</span>
                                {columnVisibility.deviceType && <span className="text-xs text-muted-foreground">{repair.deviceType}</span>}
                             </div>
                           </TableCell>
                        )}
                         {columnVisibility.problemDescription && (
                          <TableCell className="text-muted-foreground truncate max-w-xs">{repair.problemDescription}</TableCell>
                        )}
                         {columnVisibility.technician && (
                          <TableCell className="text-muted-foreground">{repair.technician}</TableCell>
                        )}
                         {columnVisibility.status && (
                          <TableCell>
                            <Badge variant={getBadgeVariant(repair.status)} className="capitalize">
                              {repair.status}
                            </Badge>
                          </TableCell>
                        )}
                         {columnVisibility.entryDate && (
                          <TableCell className="text-right text-muted-foreground">
                            {new Date(repair.entryDate).toLocaleDateString()}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
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
