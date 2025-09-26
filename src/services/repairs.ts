import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, writeBatch, getDoc } from "firebase/firestore";

export type Repair = {
    id: string;
    customer: string;
    device: string; // This will now be the product to repair, e.g., "iPhone 14"
    technician: string;
    status: "En Progreso" | "Completado" | "Pendiente" | "En Espera (Parte)";
    entryDate: string; // Should be in a format that can include time, e.g., ISO string
    deviceType: 'Tablet' | 'Celular' | 'Reloj' | 'Laptop';
    problemDescription: string;
    imeiOrSn: string;
    password?: string;
    evaluation?: string;
};

export async function getRepairs(): Promise<Repair[]> {
    const repairsCol = collection(db, 'repairs');
    const repairsSnapshot = await getDocs(repairsCol);
    const repairsList = repairsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Repair));
    return repairsList;
}

export async function getRepairById(id: string): Promise<Repair | null> {
    const repairDocRef = doc(db, 'repairs', id);
    const repairSnapshot = await getDoc(repairDocRef);

    if (repairSnapshot.exists()) {
        return { id: repairSnapshot.id, ...repairSnapshot.data() } as Repair;
    } else {
        return null;
    }
}


export async function seedRepairs(repairs: Repair[]) {
    const repairsCol = collection(db, 'repairs');
    const batch = writeBatch(db);
    
    repairs.forEach(repair => {
        const docRef = doc(repairsCol, repair.id);
        batch.set(docRef, repair);
    });

    await batch.commit();
}
