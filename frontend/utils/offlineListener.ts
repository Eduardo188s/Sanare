// utils/offlineListener.ts
import { processQueue } from "./offlineQueue";

export function listenForOnline() {
  window.addEventListener("online", () => {
    console.log("[Queue] Conexión restaurada, procesando cola...");
    processQueue();
  });
}
