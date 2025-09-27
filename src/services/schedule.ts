import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type Shift = {
    name: string;
    role: string;
    time: string;
    avatar: string;
};

export type Schedule = {
    "Lunes": Shift[];
    "Martes": Shift[];
    "Miércoles": Shift[];
    "Jueves": Shift[];
    "Viernes": Shift[];
    "Sábado": Shift[];
    "Domingo": Shift[];
};

const scheduleData: Schedule = {
  "Lunes": [
    { name: "John Doe", role: "Asociado de Ventas", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar1/40/40" },
    { name: "Peter Jones", role: "Gerente", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar3/40/40" },
  ],
  "Martes": [
    { name: "Jane Smith", role: "Asociado de Ventas", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar2/40/40" },
    { name: "David Williams", role: "Técnico", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar4/40/40" },
  ],
  "Miércoles": [
    { name: "John Doe", role: "Asociado de Ventas", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar1/40/40" },
     { name: "Mary Johnson", role: "Asociado de Ventas", time: "12pm - 8pm", avatar: "https://picsum.photos/seed/avatar5/40/40" },
  ],
  "Jueves": [
     { name: "Jane Smith", role: "Asociado de Ventas", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar2/40/40" },
    { name: "Peter Jones", role: "Gerente", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar3/40/40" },
  ],
  "Viernes": [
    { name: "John Doe", role: "Asociado de Ventas", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar1/40/40" },
    { name: "David Williams", role: "Técnico", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar4/40/40" },
    { name: "Mary Johnson", role: "Asociado de Ventas", time: "12pm - 8pm", avatar: "https://picsum.photos/seed/avatar5/40/40" },
  ],
  "Sábado": [
    { name: "Jane Smith", role: "Asociado de Ventas", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar2/40/40" },
    { name: "Mary Johnson", role: "Asociado de Ventas", time: "12pm - 8pm", avatar: "https://picsum.photos/seed/avatar5/40/40" },
  ],
  "Domingo": [],
};

const scheduleDocRef = doc(db, 'schedules', 'mainSchedule');

export async function getSchedule(): Promise<Schedule> {
    const docSnap = await getDoc(scheduleDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as Schedule;
    }
    // If not found, seed the data and return it
    await seedSchedule();
    return scheduleData;
}

export async function seedSchedule() {
    await setDoc(scheduleDocRef, scheduleData);
}
