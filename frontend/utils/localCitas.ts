import { getDB } from "./db";

// Variable de entorno para la URL del backend
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// -------------------------
// Guardar citas en IndexedDB
// -------------------------
export async function saveCitasLocal(citas: any[]) {
  const db = await getDB();
  const tx = db.transaction("citas", "readwrite");
  for (const c of citas) tx.store.put(c);
  await tx.done;
}

// -------------------------
// Cargar citas desde IndexedDB
// -------------------------
export async function loadCitasLocal() {
  const db = await getDB();
  return await db.getAll("citas");
}

// -------------------------
// Cargar citas desde Backend
// -------------------------
export async function loadCitasBackend() {
  if (!API_URL) throw new Error("API URL no definida");

  const res = await fetch(`${API_URL}/citas/`);
  if (!res.ok) throw new Error("Error al obtener citas desde backend");
  const citas = await res.json();

  // Guardar en IndexedDB para offline
  await saveCitasLocal(citas);

  return citas;
}

// -------------------------
// Guardar cita en Backend
// -------------------------
export async function saveCitaBackend(cita: any) {
  if (!API_URL) throw new Error("API URL no definida");

  const res = await fetch(`${API_URL}/citas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cita),
  });

  if (!res.ok) throw new Error("Error al guardar cita en backend");
  const nuevaCita = await res.json();

  // Guardar también localmente
  await saveCitasLocal([nuevaCita]);

  return nuevaCita;
}
