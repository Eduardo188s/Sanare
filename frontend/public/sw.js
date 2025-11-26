importScripts("https://cdn.jsdelivr.net/npm/idb@7/build/umd.js");
const { openDB } = idb;

self.addEventListener("install", (event) => {
  event.waitUntil(
    openDB("sanare-db", 4, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("pending")) {
          db.createObjectStore("pending", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("citas")) {
          db.createObjectStore("citas", { keyPath: "id" });
        }
      },
    })
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-citas") {
    event.waitUntil(sendPending());
  }
});

async function sendPending() {
  const db = await openDB("sanare-db", 4);
  const all = await db.getAll("pending");

  for (const item of all) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.body),
      });

      await db.delete("pending", item.id);
      console.log("Enviado offline:", item);
    } catch (err) {
      console.error("Error enviando pendiente:", err);
    }
  }
}
