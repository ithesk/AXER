"use client";

import { seedRepairs } from "@/services/repairs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const repairsData = [
  { id: "REP-001", customer: "John Doe", device: "iPhone 14 - Pantalla rota", technician: "David Williams", status: "En Progreso", entryDate: "2024-05-10" },
  { id: "REP-002", customer: "Jane Smith", device: "Samsung S22 - Cambio de batería", technician: "David Williams", status: "Completado", entryDate: "2024-05-09" },
  { id: "REP-003", customer: "Peter Jones", device: "Google Pixel 7 - Problema de software", technician: "No Asignado", status: "Pendiente", entryDate: "2024-05-10" },
  { id: "REP-004", customer: "Mary Johnson", device: "iPhone 13 - Daño por agua", technician: "David Williams", status: "En Espera (Parte)", entryDate: "2024-05-08" },
] as const;


export default function SeedPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSeed = async () => {
        try {
            await seedRepairs([...repairsData]);
            toast({
                title: "Éxito",
                description: "La base de datos ha sido poblada con datos de ejemplo.",
            });
            router.push("/dashboard/entradas");
        } catch (error) {
            console.error("Failed to seed database:", error);
            toast({
                title: "Error",
                description: "No se pudo poblar la base de datos.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle>Poblar Base de Datos</CardTitle>
                    <CardDescription>
                        Haz clic en el botón para añadir datos de ejemplo a tu base de datos de Firestore. Esto sobrescribirá los datos existentes con los mismos IDs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeed} className="w-full">
                        Poblar Datos de Reparaciones
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}