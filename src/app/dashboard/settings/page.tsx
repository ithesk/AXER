"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStatusSettings, saveStatusSettings, StatusSettings, BadgeVariant } from "@/services/settings";
import type { RepairStatus } from "@/services/repairs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const users = [
  { id: 1, name: "Peter Jones", email: "peter.jones@email.com", role: "Gerente", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar3/40/40" },
  { id: 2, name: "John Doe", email: "john.doe@email.com", role: "Asociado de Ventas", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar1/40/40" },
  { id: 3, name: "Jane Smith", email: "jane.smith@email.com", role: "Gerente", company: "Globex Corp.", avatar: "https://picsum.photos/seed/avatar2/40/40" },
  { id: 4, name: "David Williams", email: "david.w@email.com", role: "Técnico", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar4/40/40" },
  { id: 5, name: "Mary Johnson", email: "mary.johnson@email.com", role: "Asociado de Ventas", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar5/40/40" },
];

const repairStatuses: RepairStatus[] = ["Cotización", "Confirmado", "En Reparación", "Reparado", "Entregado"];
const badgeVariants: BadgeVariant[] = ["default", "secondary", "destructive", "outline"];

export default function SettingsPage() {
  const [statusSettings, setStatusSettings] = useState<StatusSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      const settings = await getStatusSettings();
      setStatusSettings(settings);
    }
    fetchSettings();
  }, []);

  const handleStatusChange = (status: RepairStatus, variant: BadgeVariant) => {
    if (statusSettings) {
      setStatusSettings({ ...statusSettings, [status]: variant });
    }
  };

  const handleSaveChanges = async () => {
    if (statusSettings) {
      try {
        await saveStatusSettings(statusSettings);
        toast({
          title: "Éxito",
          description: "La configuración de estados ha sido guardada.",
        });
      } catch (error) {
        console.error("Error saving settings:", error);
        toast({
          title: "Error",
          description: "No se pudo guardar la configuración.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <PageHeader title="Configuración" description="Gestiona la configuración de la aplicación, los usuarios y los roles." />
      
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Gestiona los roles y permisos de los usuarios para cada empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                         <AvatarImage src={user.avatar} data-ai-hint="person portrait" />
                         <AvatarFallback>{user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.company}</TableCell>
                  <TableCell>
                    <Select defaultValue={user.role}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Asociado de Ventas">Asociado de Ventas</SelectItem>
                        <SelectItem value="Técnico">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Guardar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Personalización de Estados</CardTitle>
          <CardDescription>Personaliza los colores de las insignias para cada estado de reparación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusSettings && repairStatuses.map((status) => (
            <div key={status} className="flex items-center justify-between">
              <p className="font-medium">{status}</p>
              <Select
                value={statusSettings[status] || 'default'}
                onValueChange={(value: BadgeVariant) => handleStatusChange(status, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar estilo" />
                </SelectTrigger>
                <SelectContent>
                  {badgeVariants.map((variant) => (
                    <SelectItem key={variant} value={variant || 'default'} className="capitalize">
                      {variant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveChanges} disabled={!statusSettings}>Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
