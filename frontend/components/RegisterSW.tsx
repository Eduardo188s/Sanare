"use client";
import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("SW Registered"))
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  return null;
}
