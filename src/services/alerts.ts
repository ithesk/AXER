// In a real app, this data would be in a database
// For now, we'll mock it
import type { AlertVariant } from "@/components/ui/alert";
import type { LucideIcon } from "lucide-react";
import { PackageSearch, CalendarClock } from "lucide-react";

export type Alert = {
    id: number;
    type: "Inventario" | "Horario";
    title: string;
    description: string;
    icon: LucideIcon;
    variant: AlertVariant["variant"];
    date: string;
};

const alerts: Alert[] = [
    { id: 1, type: "Inventario", title: "Advertencia de Stock Bajo", description: "El stock de iPhone 15 Pro es de 5 unidades en la tienda del centro.", icon: PackageSearch, variant: "destructive" as const, date: "Hace 2 horas" },
    { id: 2, type: "Horario", title: "Conflicto de Horario", description: "John Doe y Jane Smith tienen turnos superpuestos el viernes.", icon: CalendarClock, variant: "default" as const, date: "Hace 1 día" },
    { id: 3, type: "Inventario", title: "Agotado", description: "Samsung Galaxy Z Fold 5 está agotado en el Mall of America.", icon: PackageSearch, variant: "destructive" as const, date: "Hace 3 días" },
];

export async function getAlerts(): Promise<Alert[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return alerts;
}
