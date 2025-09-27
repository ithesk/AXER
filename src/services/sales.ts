// In a real app, this data would be in a database
// For now, we'll mock it
export type Sale = {
    id: string;
    date: string;
    device: string;
    customer: string;
    payment: string;
    total: number;
    company: string;
};

const sales: Sale[] = [
    { id: "SALE-001", date: "2024-05-01", device: "iPhone 15 Pro", customer: "John Doe", payment: "Tarjeta de Crédito", total: 999.00, company: "Acme Inc." },
    { id: "SALE-002", date: "2024-05-01", device: "Samsung Galaxy S24", customer: "Jane Smith", payment: "PayPal", total: 799.00, company: "Globex Corp." },
    { id: "SALE-003", date: "2024-05-02", device: "Google Pixel 8", customer: "Peter Jones", payment: "Financiación", total: 699.00, company: "Acme Inc." },
    { id: "SALE-004", date: "2024-05-03", device: "iPhone 15", customer: "Mary Johnson", payment: "Tarjeta de Crédito", total: 799.00, company: "Acme Inc." },
    { id: "SALE-005", date: "2024-05-04", device: "OnePlus 12", customer: "David Williams", payment: "Efectivo", total: 699.00, company: "Acme Inc." },
];

export async function getSales(): Promise<Sale[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return sales;
}
