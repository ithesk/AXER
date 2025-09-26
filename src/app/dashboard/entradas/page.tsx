import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import RepairsTable from "./components/repairs-table";
import { getRepairs, Repair } from "@/services/repairs";
import Link from "next/link";

export default async function EntradasPage() {
  const repairs = await getRepairs();

  return (
    <>
      <PageHeader title="Entradas" description="Gestiona todas las reparaciones y seguimientos de equipos.">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/entradas/seed">Poblar Datos</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/entradas/registrar">
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Entrada
            </Link>
          </Button>
        </div>
      </PageHeader>

      <RepairsTable repairs={repairs} />
    </>
  );
}
