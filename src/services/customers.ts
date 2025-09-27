import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, getDoc, writeBatch } from "firebase/firestore";

export type Customer = {
    id: string;
    name: string;
    phone: string;
    email?: string;
    idNumber?: string; // Cédula
    taxId?: string; // RNC
    company?: string;
    signedUp: string;
    avatar: string;
};

export type NewCustomer = Omit<Customer, 'id' | 'signedUp' | 'avatar'>;

const customersData = [
    { id: "cust-001", name: "John Doe", phone: "809-123-4567", email: "john.doe@email.com", company: "Acme Inc.", signedUp: "2023-01-15", avatar: "https://picsum.photos/seed/avatar1/100/100" },
    { id: "cust-002", name: "Jane Smith", phone: "829-987-6543", email: "jane.smith@email.com", company: "Globex Corp.", signedUp: "2023-03-22", avatar: "https://picsum.photos/seed/avatar2/100/100" },
    { id: "cust-003", name: "Peter Jones", phone: "849-555-1234", email: "peter.jones@email.com", company: "Acme Inc.", signedUp: "2023-05-30", avatar: "https://picsum.photos/seed/avatar3/100/100" },
    { id: "cust-004", name: "Mary Johnson", phone: "809-222-3333", company: "Stark Industries", signedUp: "2024-01-20", avatar: "https://picsum.photos/seed/avatar5/100/100" },
    { id: "cust-005", name: "David Williams", phone: "829-444-5555", email: "david.w@email.com", signedUp: "2024-02-10", avatar: "https://picsum.photos/seed/avatar4/100/100" },
];


export async function getCustomers(): Promise<Customer[]> {
    const customersCol = collection(db, 'customers');
    const customerSnapshot = await getDocs(customersCol);
    if (customerSnapshot.empty) {
        await seedCustomers();
        const seededSnapshot = await getDocs(customersCol);
        return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    }
    const customerList = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    return customerList;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
    const customerDocRef = doc(db, 'customers', id);
    const customerSnapshot = await getDoc(customerDocRef);
    if (customerSnapshot.exists()) {
        return { id: customerSnapshot.id, ...customerSnapshot.data() } as Customer;
    }
    return null;
}

export async function addCustomer(customerData: Omit<NewCustomer, 'signedUp' | 'avatar'>): Promise<Customer> {
    const customersCol = collection(db, 'customers');
    const newCustomerData = {
        ...customerData,
        signedUp: new Date().toISOString().split('T')[0],
        avatar: `https://picsum.photos/seed/avatar${Math.floor(Math.random() * 100)}/100/100`
    }
    const docRef = await addDoc(customersCol, newCustomerData);
    return { id: docRef.id, ...newCustomerData };
}

export async function seedCustomers() {
    const customersCol = collection(db, 'customers');
    const batch = writeBatch(db);

    customersData.forEach(customer => {
        const docRef = doc(customersCol, customer.id);
        const { id, ...data } = customer;
        batch.set(docRef, data);
    });

    await batch.commit();
}
