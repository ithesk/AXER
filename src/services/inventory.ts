// In a real app, this data would be in a database
// For now, we'll mock it
export type InventoryItem = {
    model: string;
    sku: string;
    stock: number;
    location: string;
    company: string;
    status: "En Stock" | "Stock Bajo" | "Agotado";
};

const inventory: InventoryItem[] = [
    { model: "iPhone 15 Pro", sku: "APL-15P-256", stock: 22, location: "Centro", company: "Acme Inc.", status: "En Stock" },
    { model: "Samsung Galaxy S24", sku: "SAM-S24-128", stock: 15, location: "Mall of America", company: "Globex Corp.", status: "En Stock" },
    { model: "Google Pixel 8", sku: "GGL-P8-256", stock: 5, location: "Centro", company: "Acme Inc.", status: "Stock Bajo" },
    { model: "iPhone 15", sku: "APL-15-128", stock: 30, location: "Uptown", company: "Acme Inc.", status: "En Stock" },
    { model: "Samsung Galaxy Z Fold 5", sku: "SAM-ZF5-512", stock: 0, location: "Mall of America", company: "Globex Corp.", status: "Agotado" },
    { model: "OnePlus 12", sku: "ONP-12-256", stock: 8, location: "Uptown", company: "Acme Inc.", status: "En Stock" },
];

export async function getInventory(): Promise<InventoryItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return inventory;
}
