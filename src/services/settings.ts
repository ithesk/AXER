import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { RepairStatus } from "./repairs";
import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "@/components/ui/badge";

export type BadgeVariant = Exclude<VariantProps<typeof badgeVariants>["variant"], null | undefined>;

export type StatusSettings = {
    [key in RepairStatus]: BadgeVariant;
};

const settingsDocRef = doc(db, 'settings', 'repairStatusStyles');

export async function getStatusSettings(): Promise<StatusSettings> {
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as StatusSettings;
    }
    // Return default settings if none are found
    return {
        "Cotización": "outline",
        "Confirmado": "secondary",
        "En Reparación": "default",
        "Reparado": "default",
        "Entregado": "secondary",
    };
}

export async function saveStatusSettings(settings: StatusSettings): Promise<void> {
    await setDoc(settingsDocRef, settings);
}
