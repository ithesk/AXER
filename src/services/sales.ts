import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";

export type Sale = {
    id: string;
    date: string;
    device: string;
    customer: string;
    payment: string;
    total: number;
    company: string;
};

const salesData: Omit<Sale, 'id'>[] = [
    { date: "2024-05-01", device: "iPhone 15 Pro", customer: "John Doe", payment: "Tarjeta de Crédito", total: 999.00, company: "Acme Inc." },
    { date: "2024-05-01", device: "Samsung Galaxy S24", customer: "Jane Smith", payment: "PayPal", total: 799.00, company: "Globex Corp." },
    { date: "2024-05-02", device: "Google Pixel 8", customer: "Peter Jones", payment: "Financiación", total: 699.00, company: "Acme Inc." },
    { date: "2024-05-03", device: "iPhone 15", customer: "Mary Johnson", payment: "Tarjeta de Crédito", total: 799.00, company: "Acme Inc." },
    { date: "2024-05-04", device: "OnePlus 12", customer: "David Williams", payment: "Efectivo", total: 699.00, company: "Acme Inc." },
];

export async function getSales(): Promise<Sale[]> {
    const salesCol = collection(db, 'sales');
    const salesSnapshot = await getDocs(salesCol);
     if (salesSnapshot.empty) {
        await seedSales();
        const seededSnapshot = await getDocs(salesCol);
        return seededSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Sale));
    }
    return salesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Sale));
}

export async function seedSales() {
    const salesCol = collection(db, 'sales');
    const batch = writeBatch(db);

    salesData.forEach((sale, index) => {
        const saleId = `SALE-00${index + 1}`;
        const docRef = doc(salesCol, saleId);
        batch.set(docRef, sale);
    });

    await batch.commit();
}
