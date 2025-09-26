import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, writeBatch } from "firebase/firestore";

export type Repair = {
    id: string;
    customer: string;
    device: string;
    technician: string;
    status: "En Progreso" | "Completado" | "Pendiente" | "En Espera (Parte)";
    entryDate: string;
};

export async function getRepairs(): Promise<Repair[]> {
    const repairsCol = collection(db, 'repairs');
    const repairsSnapshot = await getDocs(repairsCol);
    const repairsList = repairsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Repair));
    return repairsList;
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
