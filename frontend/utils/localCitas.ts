import { getDB } from "./db";

export async function saveCitasLocal(citas: any[]) {
  const db = await getDB();

  const tx = db.transaction("citas", "readwrite");
  for (const c of citas) tx.store.put(c);
  await tx.done;
}

export async function loadCitasLocal() {
  const db = await getDB();
  return await db.getAll("citas");
}
