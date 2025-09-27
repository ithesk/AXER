// This is a service to simulate fetching common problems data.
// In a real application, this would come from a database.

const commonProblems = [
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

export async function getCommonProblems(): Promise<string[]> {
    // Simulate API delay
    return new Promise(resolve => setTimeout(() => resolve(commonProblems), 300));
}
