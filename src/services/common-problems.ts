import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const commonProblemsData = [
    "Pantalla rota",
    "No carga",
    "Batería se descarga rápido",
    "No enciende",
    "Se reinicia solo",
    "Daño por líquido",
    "Problema de altavoz",
    "Problema de micrófono",
    "Fallo de cámara",
    "No lee SIM",
    "Problemas de software",
];

const problemsDocRef = doc(db, 'settings', 'commonProblems');

export async function getCommonProblems(): Promise<string[]> {
    const docSnap = await getDoc(problemsDocRef);
    if (docSnap.exists() && docSnap.data().problems) {
        return docSnap.data().problems;
    }
    // If not found, seed the data and return it
    await seedCommonProblems();
    return commonProblemsData;
}

export async function seedCommonProblems() {
    await setDoc(problemsDocRef, { problems: commonProblemsData });
}
