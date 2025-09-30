import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type BusinessTheme = {
    primary: string; // HSL value like "263 44% 56%"
    secondary: string;
    accent: string;
};

export type BusinessProfile = {
    id: string; // Company Name acts as ID
    name: string;
    phone: string;
    taxId: string; // RNC
    address: string;
    email: string;
    logoUrl?: string;
    theme: BusinessTheme;
};

const defaultBusinessProfile: BusinessProfile = {
    id: "Acme Inc.",
    name: "Acme Inc.",
    phone: "809-555-1234",
    taxId: "1-2345678-9",
    address: "Av. Principal 123, Santo Domingo",
    email: "contacto@acmeinc.com",
    logoUrl: "", // Initially no logo
    theme: {
        primary: "263 44% 56%",
        secondary: "196 100% 36%",
        accent: "203 100% 41%",
    }
};

const getProfileDocRef = (companyId: string) => doc(db, 'businesses', companyId);

export async function getBusinessProfile(companyId: string): Promise<BusinessProfile | null> {
    const docRef = getProfileDocRef(companyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as BusinessProfile;
    }
    return null;
}

export async function saveBusinessProfile(profile: BusinessProfile): Promise<void> {
    const docRef = getProfileDocRef(profile.id);
    await setDoc(docRef, profile, { merge: true });
}

export async function seedBusinessProfile() {
    await saveBusinessProfile(defaultBusinessProfile);
}
