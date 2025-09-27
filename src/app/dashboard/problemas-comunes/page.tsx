import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommonProblems } from "@/services/common-problems";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function CommonProblemsPage() {
  const commonProblems = await getCommonProblems();

  return (
    <>
      <PageHeader title="Gestionar Problemas Comunes" description="Añade, edita y elimina problemas comunes para agilizar el registro de reparaciones.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Problema
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Problemas Comunes</CardTitle>
          <CardDescription>Estos son los problemas que aparecerán como sugerencias en el formulario de registro.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {commonProblems.map(problem => (
                    <Card key={problem} className="flex items-center p-4">
                        <p className="font-medium">{problem}</p>
                    </Card>
                ))}
            </div>
        </CardContent>
      </Card>
    </>
  );
}
