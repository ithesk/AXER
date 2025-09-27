import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, writeBatch } from "firebase/firestore";

export type UserRole = "Gerente" | "Asociado de Ventas" | "Técnico";

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    company: string;
    avatar: string;
};

const usersData: Omit<User, 'id'>[] = [
    { name: "Peter Jones", email: "peter.jones@email.com", role: "Gerente", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar3/40/40" },
    { name: "John Doe", email: "john.doe@email.com", role: "Asociado de Ventas", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar1/40/40" },
    { name: "Jane Smith", email: "jane.smith@email.com", role: "Gerente", company: "Globex Corp.", avatar: "https://picsum.photos/seed/avatar2/40/40" },
    { name: "David Williams", email: "david.w@email.com", role: "Técnico", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar4/40/40" },
    { name: "Mary Johnson", email: "mary.johnson@email.com", role: "Asociado de Ventas", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar5/40/40" },
    { name: "Juan Perez", email: "juan.perez@email.com", role: "Técnico", company: "Acme Inc.", avatar: "https://picsum.photos/seed/avatar6/40/40" },
    { name: "Maria Rodriguez", email: "maria.rodriguez@email.com", role: "Técnico", company: "Globex Corp.", avatar: "https://picsum.photos/seed/avatar7/40/40" },
];


export async function getUsers(): Promise<User[]> {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    if (userSnapshot.empty) {
        // If the collection is empty, seed it and return the data
        await seedUsers();
        const seededSnapshot = await getDocs(usersCol);
        return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    }
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getTechnicians(): Promise<User[]> {
    const users = await getUsers();
    return users.filter(user => user.role === "Técnico");
}


export async function seedUsers() {
    const usersCol = collection(db, 'users');
    const batch = writeBatch(db);
    
    usersData.forEach((user, index) => {
        // Use a predictable ID for seeding
        const docRef = doc(usersCol, `user-${index + 1}`);
        batch.set(docRef, user);
    });

    await batch.commit();
}
