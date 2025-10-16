import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, CheckCircle2, XCircle, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getInventory, InventoryItem } from "@/services/inventory";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default async function InventoryPage() {
  const inventory = await getInventory();

  const getStatusInfo = (status: InventoryItem['status']) => {
    switch (status) {
      case "En Stock":
        return { variant: "success" as const, icon: <CheckCircle2 className="h-4 w-4" /> };
      case "Stock Bajo":
        return { variant: "warning" as const, icon: <TriangleAlert className="h-4 w-4" /> };
      case "Agotado":
        return { variant: "destructive" as const, icon: <XCircle className="h-4 w-4" /> };
    }
  }

  const getStockProgress = (stock: number) => {
    if (stock > 20) return 100;
    if (stock <= 0) return 0;
    return (stock / 20) * 100;
  }

  return (
    <>
      <PageHeader title="Inventario" description="Gestiona el stock de tus productos en todas las ubicaciones.">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar productos..." className="pl-8" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
          </Button>
        </div>
      </PageHeader>
      <Card>
        <CardHeader>
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground px-4">
            <div className="col-span-2">Modelo</div>
            <div>SKU</div>
            <div>Estado</div>
            <div className="text-right">Stock</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            {inventory.map((item) => {
               const statusInfo = getStatusInfo(item.status);
              return (
                <div key={item.id} className="grid grid-cols-5 gap-4 items-center px-4 py-3 border-b hover:bg-muted/50 transition-colors cursor-pointer">
                   <div className="col-span-2 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{item.model.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.model}</p>
                      <p className="text-sm text-muted-foreground">{item.company}</p>
                    </div>
                  </div>

                  <div className="text-muted-foreground">{item.id}</div>
                  
                  <div>
                     <Badge variant={statusInfo.variant} className="flex items-center gap-1.5">
                       {statusInfo.icon}
                       {item.status}
                     </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 justify-end">
                     <span className="font-medium">{item.stock}</span>
                     <Progress value={getStockProgress(item.stock)} className="h-2 w-20" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-6">
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-{inventory.length}</strong> de <strong>{inventory.length}</strong> productos
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button variant="outline" size="sm">Siguiente</Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
