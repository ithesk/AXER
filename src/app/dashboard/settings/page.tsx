import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
  { id: 1, name: "Peter Jones", email: "peter.jones@email.com", role: "Gerente", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar3/40/40" },
  { id: 2, name: "John Doe", email: "john.doe@email.com", role: "Asociado de Ventas", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar1/40/40" },
  { id: 3, name: "Jane Smith", email: "jane.smith@email.com", role: "Gerente", company: "Globex Corp.", avatar: "https://picsum.photos/seed/avatar2/40/40" },
  { id: 4, name: "David Williams", email: "david.w@email.com", role: "Técnico", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar4/40/40" },
  { id: 5, name: "Mary Johnson", email: "mary.johnson@email.com", role: "Asociado de Ventas", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar5/40/40" },
];

export default function SettingsPage() {
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
    </>
  );
}
