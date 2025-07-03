// app/paciente/citas/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import HeaderPaciente from "@/components/HeaderPaciente";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

// Simulación de citas guardadas
const citasSimuladas = [
  {
    id: 1,
    clinica: "Clínica Los Angeles",
    fecha: "2025-07-05",
    hora: "10:30 a.m",
    ubicacion: "Tlaxcala",
  },
  {
    id: 2,
    clinica: "Centro Médico San José",
    fecha: "2025-07-10",
    hora: "9:00 a.m",
    ubicacion: "Apizaco",
  },
];

export default function CitasPage() {
  const [citas, setCitas] = useState<typeof citasSimuladas>([]);

  useEffect(() => {
    // Aquí iría la consulta real a Firebase o tu API
    setCitas(citasSimuladas);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <HeaderPaciente />
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Mis citas agendadas</h1>

        {citas.length === 0 ? (
          <p className="text-gray-600">No tienes citas agendadas aún.</p>
        ) : (
          <ul className="space-y-4">
            {citas.map((cita) => (
              <li
                key={cita.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <h2 className="text-lg font-semibold">{cita.clinica}</h2>
                  <p className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                    <FaCalendarAlt className="text-blue-500" /> {new Date(cita.fecha).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaClock className="text-blue-500" /> {cita.hora}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaMapMarkerAlt className="text-blue-500" /> {cita.ubicacion}
                  </p>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">
                  Cancelar cita
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
