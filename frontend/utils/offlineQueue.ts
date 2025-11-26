import { getDB } from "./db";

export async function queueRequest(data: any) {
  const db = await getDB();

  await db.add("pending", {
    id: Date.now(),
    ...data,
  });
}
