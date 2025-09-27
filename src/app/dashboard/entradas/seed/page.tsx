"use client";

import { seedRepairs } from "@/services/repairs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Repair } from "@/services/repairs";
import { seedUsers } from "@/services/users";

const repairsData: Omit<Repair, 'evaluation' | 'quote'>[] = [
  { 
    id: "REP-001", 
    customer: "John Doe", 
    device: "iPhone 14", 
    technician: "David Williams", 
    status: "En Reparación", 
    entryDate: new Date("2024-05-10T10:00:00Z").toISOString(),
    deviceType: "Celular",
    problemDescription: "La pantalla está rota y no responde al tacto en la parte superior.",
    imeiOrSn: "356712345678901",
    password: "1234",
  },
  { 
    id: "REP-002", 
    customer: "Jane Smith", 
    device: "Samsung Galaxy S22", 
    technician: "David Williams", 
    status: "Reparado", 
    entryDate: new Date("2024-05-09T14:30:00Z").toISOString(),
    deviceType: "Celular",
    problemDescription: "La batería se descarga muy rápido, dura menos de 4 horas.",
    imeiOrSn: "359876543210987",
  },
  { 
    id: "REP-003", 
    customer: "Peter Jones", 
    device: "Google Pixel 7", 
    technician: "No Asignado", 
    status: "Cotización", 
    entryDate: new Date("2024-05-10T11:00:00Z").toISOString(),
    deviceType: "Celular",
    problemDescription: "El equipo se reinicia constantemente y no pasa del logo de Google.",
    imeiOrSn: "351234567890123",
    password: "No tiene",
  },
  { 
    id: "REP-004", 
    customer: "Mary Johnson", 
    device: "MacBook Pro 14\"", 
    technician: "David Williams", 
    status: "Confirmado", 
    entryDate: new Date("2024-05-08T18:00:00Z").toISOString(),
    deviceType: "Laptop",
    problemDescription: "El teclado no funciona después de un derrame de líquido.",
    imeiOrSn: "C02G1234H8J1",
  },
];


export default function SeedPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSeed = async () => {
        try {
            await seedRepairs(repairsData);
            await seedUsers();
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
                        Poblar Datos de Ejemplo
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
