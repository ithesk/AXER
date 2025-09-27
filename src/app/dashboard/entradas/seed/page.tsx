"use client";

import { seedRepairs } from "@/services/repairs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { seedUsers } from "@/services/users";
import { seedAlerts } from "@/services/alerts";
import { seedCommonProblems } from "@/services/common-problems";
import { seedDeviceData } from "@/services/devices";
import { seedInventory } from "@/services/inventory";
import { seedSales } from "@/services/sales";
import { seedSchedule } from "@/services/schedule";
import { seedCustomers } from "@/services/customers";


export default function SeedPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSeed = async () => {
        try {
            // This will seed all data collections
            await Promise.all([
                seedRepairs(),
                seedUsers(),
                seedAlerts(),
                seedCommonProblems(),
                seedDeviceData(),
                seedInventory(),
                seedSales(),
                seedSchedule(),
                seedCustomers(),
            ]);
            
            toast({
                title: "Éxito",
                description: "La base de datos ha sido poblada con datos de ejemplo.",
            });
            router.push("/dashboard/entradas");
            router.refresh();

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
                        Haz clic en el botón para añadir datos de ejemplo a todas las colecciones en Firestore. Esto sobrescribirá los datos existentes con los mismos IDs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeed} className="w-full">
                        Poblar Todos los Datos
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
