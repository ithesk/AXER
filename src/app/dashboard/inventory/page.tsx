import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const inventory = [
  { model: "iPhone 15 Pro", sku: "APL-15P-256", stock: 22, location: "Centro", company: "Acme Inc.", status: "En Stock" },
  { model: "Samsung Galaxy S24", sku: "SAM-S24-128", stock: 15, location: "Mall of America", company: "Globex Corp.", status: "En Stock" },
  { model: "Google Pixel 8", sku: "GGL-P8-256", stock: 5, location: "Centro", company: "Acme Inc.", status: "Stock Bajo" },
  { model: "iPhone 15", sku: "APL-15-128", stock: 30, location: "Uptown", company: "Acme Inc.", status: "En Stock" },
  { model: "Samsung Galaxy Z Fold 5", sku: "SAM-ZF5-512", stock: 0, location: "Mall of America", company: "Globex Corp.", status: "Agotado" },
  { model: "OnePlus 12", sku: "ONP-12-256", stock: 8, location: "Uptown", company: "Acme Inc.", status: "En Stock" },
];

export default function InventoryPage() {
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
                <TableRow key={item.sku}>
                  <TableCell className="font-medium">{item.model}</TableCell>
                  <TableCell>{item.sku}</TableCell>
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
            Mostrando <strong>1-6</strong> de <strong>{inventory.length}</strong> productos
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
