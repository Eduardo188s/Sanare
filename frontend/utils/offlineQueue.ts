// utils/offlineQueue.ts
import { getDB } from "./db";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Guarda la petición en la cola offline
export async function queueRequest(data: any) {
  const db = await getDB();

  await db.add("pending", {
    id: Date.now(),
    url: data.url || `${API_URL}${data.endpoint}`,
    method: data.method || "POST",
    body: data.body || null,
    headers: data.headers || { "Content-Type": "application/json" },
  });

  console.log("[Queue] Petición guardada offline:", data);
}

// Intenta enviar todas las peticiones pendientes
export async function processQueue() {
  if (!navigator.onLine) return;

  const db = await getDB();
  const allRequests = await db.getAll("pending");

  for (const req of allRequests) {
    try {
      const response = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body ? JSON.stringify(req.body) : undefined,
      });

      if (response.ok) {
        await db.delete("pending", req.id);
        console.log("[Queue] Petición enviada y eliminada:", req.url);
      } else {
        console.warn("[Queue] Error al enviar, se mantiene:", req.url);
      }
    } catch (err) {
      console.error("[Queue] Error procesando solicitud:", err);
      return;
    }
  }
}
