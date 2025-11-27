'use client';
import type { Metadata } from "next";
import "./globals.css";
import { useEffect, type ReactNode } from "react";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import RegisterSW from "@/components/RegisterSW"; // ⬅ IMPORTANTE



export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker registrado"))
      .catch(err => console.error("Error registrando SW:", err));
  }
}, []);
return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <body>
        <AuthProvider>
          <RegisterSW />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
