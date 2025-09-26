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
      <PageHeader title="Customers" description="Manage your customer base and view their history.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>A list of all customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link href={`/dashboard/customers/${customer.id}`}>View details</Link></DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
            Showing <strong>1-5</strong> of <strong>{customers.length}</strong> customers
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
