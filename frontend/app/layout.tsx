"use client";

import "./globals.css";
import { type ReactNode } from "react";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import RegisterSW from "@/components/RegisterSW"; // Servicio Worker de next-pwa

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* Manifest obligatorio */}
      <link rel="manifest" href="/manifest.json" />

      <body>
        <AuthProvider>
          {/* next-pwa se registra automáticamente aquí */}
          <RegisterSW />

          {children}

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
