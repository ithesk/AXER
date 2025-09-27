import { getRepairById } from "@/services/repairs";
import { PageHeader } from "@/components/page-header";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RepairDetails from "./components/repair-details";

export default async function RepairDetailPage({ params }: { params: { id: string } }) {
  const repair = await getRepairById(params.id);

  if (!repair) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Detalle de Reparación`} description={`ID de Reparación: ${repair.id}`}>
        <Button variant="outline" asChild>
          <Link href="/dashboard/entradas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Entradas
          </Link>
        </Button>
      </PageHeader>

      <RepairDetails initialRepair={repair} />
      
    </div>
  );
}
