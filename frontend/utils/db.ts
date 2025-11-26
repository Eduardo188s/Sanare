import { openDB } from "idb";

export async function getDB() {
  return await openDB("sanare-db", 4, {
    upgrade(db, oldVersion, newVersion) {
      console.log("UPGRADING DB from", oldVersion, "to", newVersion);

      if (!db.objectStoreNames.contains("citas")) {
        db.createObjectStore("citas", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("pending")) {
        db.createObjectStore("pending", { keyPath: "id" });
      }
    },
  });
}
