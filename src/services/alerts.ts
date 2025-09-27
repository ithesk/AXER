import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import type { AlertVariant } from "@/components/ui/alert";
import type { LucideIcon } from "lucide-react";
import { PackageSearch, CalendarClock } from "lucide-react";

// Map icon names to components
const iconMap: { [key: string]: LucideIcon } = {
    "PackageSearch": PackageSearch,
    "CalendarClock": CalendarClock,
};

export type Alert = {
    id: string;
    type: "Inventario" | "Horario";
    title: string;
    description: string;
    iconName: keyof typeof iconMap; // Store icon name
    variant: AlertVariant["variant"];
    date: string;
};

// This type is used for seeding, before the component is attached
type AlertData = Omit<Alert, 'icon'>;


const alertsData: AlertData[] = [
    { id: "alert-1", type: "Inventario", title: "Advertencia de Stock Bajo", description: "El stock de iPhone 15 Pro es de 5 unidades en la tienda del centro.", iconName: "PackageSearch", variant: "destructive" as const, date: "Hace 2 horas" },
    { id: "alert-2", type: "Horario", title: "Conflicto de Horario", description: "John Doe y Jane Smith tienen turnos superpuestos el viernes.", iconName: "CalendarClock", variant: "default" as const, date: "Hace 1 día" },
    { id: "alert-3", type: "Inventario", title: "Agotado", description: "Samsung Galaxy Z Fold 5 está agotado en el Mall of America.", iconName: "PackageSearch", variant: "destructive" as const, date: "Hace 3 días" },
];

export async function getAlerts(): Promise<(Alert & { icon: LucideIcon })[]> {
    const alertsCol = collection(db, 'alerts');
    const alertsSnapshot = await getDocs(alertsCol);
    if (alertsSnapshot.empty) {
        await seedAlerts();
        const seededSnapshot = await getDocs(alertsCol);
        return seededSnapshot.docs.map(doc => {
            const data = doc.data() as Alert;
            return { ...data, icon: iconMap[data.iconName] };
        });
    }

    const alertsList = alertsSnapshot.docs.map(doc => {
        const data = doc.data() as Alert;
        return { ...data, icon: iconMap[data.iconName] };
    });
    return alertsList;
}

export async function seedAlerts() {
    const alertsCol = collection(db, 'alerts');
    const batch = writeBatch(db);

    alertsData.forEach(alert => {
        const docRef = doc(alertsCol, alert.id);
        batch.set(docRef, alert);
    });

    await batch.commit();
}
