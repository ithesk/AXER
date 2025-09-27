import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";

export type InventoryItem = {
    id: string; // SKU will be the ID
    model: string;
    stock: number;
    location: string;
    company: string;
    status: "En Stock" | "Stock Bajo" | "Agotado";
};

const inventoryData: Omit<InventoryItem, "id">[] = [
    { model: "iPhone 15 Pro", stock: 22, location: "Centro", company: "Acme Inc.", status: "En Stock" },
    { model: "Samsung Galaxy S24", stock: 15, location: "Mall of America", company: "Globex Corp.", status: "En Stock" },
    { model: "Google Pixel 8", stock: 5, location: "Centro", company: "Acme Inc.", status: "Stock Bajo" },
    { model: "iPhone 15", stock: 30, location: "Uptown", company: "Acme Inc.", status: "En Stock" },
    { model: "Samsung Galaxy Z Fold 5", stock: 0, location: "Mall of America", company: "Globex Corp.", status: "Agotado" },
    { model: "OnePlus 12", stock: 8, location: "Uptown", company: "Acme Inc.", status: "En Stock" },
];

const skus = ["APL-15P-256", "SAM-S24-128", "GGL-P8-256", "APL-15-128", "SAM-ZF5-512", "ONP-12-256"];

export async function getInventory(): Promise<InventoryItem[]> {
    const inventoryCol = collection(db, 'inventory');
    const inventorySnapshot = await getDocs(inventoryCol);
     if (inventorySnapshot.empty) {
        await seedInventory();
        const seededSnapshot = await getDocs(inventoryCol);
        return seededSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InventoryItem));
    }
    return inventorySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InventoryItem));
}

export async function seedInventory() {
    const inventoryCol = collection(db, 'inventory');
    const batch = writeBatch(db);

    inventoryData.forEach((item, index) => {
        const docRef = doc(inventoryCol, skus[index]);
        batch.set(docRef, item);
    });

    await batch.commit();
}
