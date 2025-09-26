import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import PredictNeedsForm from "./components/predict-needs-form";

const customer = {
  id: "CUST-001",
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "123-456-7890",
  company: "Acme Inc.",
  signedUp: "2023-01-15",
  avatar: "https://picsum.photos/seed/avatar1/100/100",
};

const purchaseHistory = [
  { id: "SALE-001", date: "2024-05-01", device: "iPhone 15 Pro", total: 999.00 },
  { id: "TRD-001", date: "2024-05-01", device: "iPhone 13 Pro (Canje)", total: -450.00 },
  { id: "ACC-012", date: "2024-05-01", device: "Funda y Protector de Pantalla", total: 79.99 },
  { id: "ACC-005", date: "2023-08-20", device: "AirPods Pro", total: 249.00 },
];

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customerData = `
    Nombre: ${customer.name},
    Email: ${customer.email},
    Teléfono: ${customer.phone},
    Afiliación de la empresa: ${customer.company},
    Miembro desde: ${customer.signedUp}
  `;

  const purchaseHistoryData = purchaseHistory.map(p => 
    `Fecha: ${p.date}, Artículo: ${p.device}, Cantidad: $${p.total.toFixed(2)}`
  ).join('; ');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={customer.name} description={`ID de Cliente: ${params.id}`} />
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-6">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Historial de Compras</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID de Transacción</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseHistory.map(purchase => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.id}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{purchase.device}</TableCell>
                      <TableCell className="text-right">${purchase.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
            <Card>
            <CardHeader className="items-center">
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={customer.avatar} data-ai-hint="person portrait" />
                    <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center font-headline">{customer.name}</CardTitle>
                <CardDescription className="text-center">{customer.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
                <div className="grid gap-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Teléfono</span>
                        <span>{customer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Empresa</span>
                        <span>{customer.company}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Miembro Desde</span>
                        <span>{customer.signedUp}</span>
                    </div>
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
      
      <Separator />

      <PredictNeedsForm customerData={customerData} purchaseHistory={purchaseHistoryData} />

    </div>
  );
}
