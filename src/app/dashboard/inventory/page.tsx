import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getInventory } from "@/services/inventory";

export default async function InventoryPage() {
  const inventory = await getInventory();

  return (
    <>
      <PageHeader title="Inventario" description="Gestiona el stock de tus productos en todas las ubicaciones.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Una lista de todos los productos en tu inventario.</CardDescription>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar productos..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Empresa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.model}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Agotado' ? 'destructive' : item.status === 'Stock Bajo' ? 'secondary' : 'default'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.company}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-{inventory.length}</strong> de <strong>{inventory.length}</strong> productos
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
