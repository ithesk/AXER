import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sales = [
  { id: "SALE-001", date: "2024-05-01", device: "iPhone 15 Pro", customer: "John Doe", payment: "Tarjeta de Crédito", total: 999.00, company: "Acme Inc." },
  { id: "SALE-002", date: "2024-05-01", device: "Samsung Galaxy S24", customer: "Jane Smith", payment: "PayPal", total: 799.00, company: "Globex Corp." },
  { id: "SALE-003", date: "2024-05-02", device: "Google Pixel 8", customer: "Peter Jones", payment: "Financiación", total: 699.00, company: "Acme Inc." },
  { id: "SALE-004", date: "2024-05-03", device: "iPhone 15", customer: "Mary Johnson", payment: "Tarjeta de Crédito", total: 799.00, company: "Acme Inc." },
  { id: "SALE-005", date: "2024-05-04", device: "OnePlus 12", customer: "David Williams", payment: "Efectivo", total: 699.00, company: "Acme Inc." },
];

export default function SalesPage() {
  return (
    <>
      <PageHeader title="Ventas" description="Revisa y gestiona todas las transacciones de venta.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Nueva Venta
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Transacciones</CardTitle>
          <CardDescription>Una lista de transacciones de venta recientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.device}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{sale.payment}</Badge>
                  </TableCell>
                  <TableCell>{sale.company}</TableCell>
                  <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-5</strong> de <strong>{sales.length}</strong> transacciones
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
