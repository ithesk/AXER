import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const inventory = [
  { model: "iPhone 15 Pro", sku: "APL-15P-256", stock: 22, location: "Downtown", company: "Acme Inc.", status: "In Stock" },
  { model: "Samsung Galaxy S24", sku: "SAM-S24-128", stock: 15, location: "Mall of America", company: "Globex Corp.", status: "In Stock" },
  { model: "Google Pixel 8", sku: "GGL-P8-256", stock: 5, location: "Downtown", company: "Acme Inc.", status: "Low Stock" },
  { model: "iPhone 15", sku: "APL-15-128", stock: 30, location: "Uptown", company: "Acme Inc.", status: "In Stock" },
  { model: "Samsung Galaxy Z Fold 5", sku: "SAM-ZF5-512", stock: 0, location: "Mall of America", company: "Globex Corp.", status: "Out of Stock" },
  { model: "OnePlus 12", sku: "ONP-12-256", stock: 8, location: "Uptown", company: "Acme Inc.", status: "In Stock" },
];

export default function InventoryPage() {
  return (
    <>
      <PageHeader title="Inventory" description="Manage your product stock across all locations.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>A list of all products in your inventory.</CardDescription>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Company</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.sku}>
                  <TableCell className="font-medium">{item.model}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Out of Stock' ? 'destructive' : item.status === 'Low Stock' ? 'secondary' : 'default'}>
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
            Showing <strong>1-6</strong> of <strong>{inventory.length}</strong> products
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
