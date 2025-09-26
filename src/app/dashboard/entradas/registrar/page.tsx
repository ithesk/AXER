import { PageHeader } from "@/components/page-header";
import RepairForm from "../components/repair-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterRepairPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Registrar Nueva Entrada" 
        description="Siga los pasos para registrar una nueva orden de reparación." 
      />

      <Card>
        <CardHeader>
            <CardTitle>Detalles de la Reparación</CardTitle>
            <CardDescription>Proporcione todos los detalles del cliente y del equipo.</CardDescription>
        </CardHeader>
        <CardContent>
            <RepairForm />
        </CardContent>
      </Card>
    </div>
  );
}
