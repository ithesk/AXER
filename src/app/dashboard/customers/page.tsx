import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const customers = [
  { id: "CUST-001", name: "John Doe", email: "john.doe@email.com", lastPurchase: "2024-05-01", company: "Acme Inc." },
  { id: "CUST-002", name: "Jane Smith", email: "jane.smith@email.com", lastPurchase: "2024-05-01", company: "Globex Corp." },
  { id: "CUST-003", name: "Peter Jones", email: "peter.jones@email.com", lastPurchase: "2024-05-02", company: "Acme Inc." },
  { id: "CUST-004", name: "Mary Johnson", email: "mary.johnson@email.com", lastPurchase: "2024-05-03", company: "Acme Inc." },
  { id: "CUST-005", name: "David Williams", email: "david.w@email.com", lastPurchase: "2024-05-04", company: "Acme Inc." },
];

export default function CustomersPage() {
  return (
    <>
      <PageHeader title="Clientes" description="Gestiona tu base de clientes y consulta su historial.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Cliente
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Una lista de todos los clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.company}</Badge>
                  </TableCell>
                  <TableCell>{customer.lastPurchase}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link href={`/dashboard/customers/${customer.id}`}>Ver detalles</Link></DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-5</strong> de <strong>{customers.length}</strong> clientes
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
