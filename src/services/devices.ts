import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type DeviceData = {
    [key in 'Celular' | 'Tablet' | 'Reloj' | 'Laptop']: {
        brands: {
            name: string;
            models: string[];
        }[];
    };
};

const deviceData: DeviceData = {
    "Celular": {
        brands: [
            { name: "Apple", models: ["iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14", "iPhone SE"] },
            { name: "Samsung", models: ["Galaxy S24 Ultra", "Galaxy S24", "Galaxy Z Fold 5", "Galaxy Z Flip 5", "Galaxy A54"] },
            { name: "Google", models: ["Pixel 8 Pro", "Pixel 8", "Pixel 7a"] },
            { name: "OnePlus", models: ["OnePlus 12", "OnePlus Open", "OnePlus Nord N30"] },
        ]
    },
    "Tablet": {
        brands: [
            { name: "Apple", models: ["iPad Pro 12.9\"", "iPad Pro 11\"", "iPad Air", "iPad Mini"] },
            { name: "Samsung", models: ["Galaxy Tab S9 Ultra", "Galaxy Tab S9+", "Galaxy Tab S9 FE"] },
            { name: "Microsoft", models: ["Surface Pro 9", "Surface Go 4"] },
        ]
    },
    "Reloj": {
        brands: [
            { name: "Apple", models: ["Watch Ultra 2", "Watch Series 9", "Watch SE"] },
            { name: "Samsung", models: ["Galaxy Watch 6 Classic", "Galaxy Watch 6", "Galaxy Watch 5 Pro"] },
            { name: "Google", models: ["Pixel Watch 2"] },
        ]
    },
    "Laptop": {
        brands: [
            { name: "Apple", models: ["MacBook Pro 16\"", "MacBook Pro 14\"", "MacBook Air 15\"", "MacBook Air 13\""] },
            { name: "Dell", models: ["XPS 15", "XPS 13", "Inspiron 15"] },
            { name: "HP", models: ["Spectre x360", "Envy 16", "Pavilion 15"] },
             { name: "Microsoft", models: ["Surface Laptop 5", "Surface Laptop Studio 2"] },
        ]
    }
};

const devicesDocRef = doc(db, 'settings', 'deviceData');

export async function getDeviceData(): Promise<DeviceData> {
    const docSnap = await getDoc(devicesDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as DeviceData;
    }
    // If not found, seed the data and return it
    await seedDeviceData();
    return deviceData;
}

export async function seedDeviceData() {
    await setDoc(devicesDocRef, deviceData);
}
