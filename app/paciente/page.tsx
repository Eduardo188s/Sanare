// app/paciente/page.tsx

import React from "react";
import Image from "next/image";
import HeaderPaciente from "@/components/HeaderPaciente";
import Link from "next/link";

export default function PacienteDashboard() {
  return (
    <main className="min-h-screen bg-white">
      <HeaderPaciente />

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-blue-100 border border-blue-300 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
          {/* Imagen de la clínica */}
          <div className="w-full md:w-1/2">
            <Image
              src="/logo_sanare.jpg" // Coloca aquí la imagen real
              alt="Clínica los Angeles"
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>

          {/* Información de la clínica */}
          <div className="w-full md:w-1/2 text-gray-800">
            <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">Clínica los Angeles</h2>
            <p className="mb-4 text-center md:text-left text-blue-800">
              Clínica los Angeles lo mejor para ti, ofreciendo diferentes médicos y servicios
            </p>

            <ul className="space-y-2 text-sm">
              <li><span className="font-semibold text-blue-700">📋 Especializada en:</span> Medicina General</li>
              <li><span className="font-semibold text-blue-700">📍 Ubicada en:</span> Tlaxcala</li>
              <li><span className="font-semibold text-blue-700">🕒 Horarios:</span> 8 a.m – 7 p.m</li>
            </ul>

            <div className="mt-4 text-right">
              <Link href="/paciente/clinica">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Ver más</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
