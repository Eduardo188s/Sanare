import { getDB } from "./db";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function queueRequest(data: any) {
  const db = await getDB();

  await db.add("pending", {
    id: Date.now(),
    ...data,
  });
}
