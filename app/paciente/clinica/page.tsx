// app/paciente/clinica/page.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeaderPaciente from "@/components/HeaderPaciente";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ClinicaDetalle() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedHour, setSelectedHour] = useState<string>("");
  const router = useRouter();

  const horarios = ["9:00 a.m", "10:30 a.m", "12:00 p.m", "2:00 p.m"];

  const agendarCita = () => {
    if (!selectedDate || !selectedHour) {
      alert("Selecciona una fecha y un horario para agendar tu cita.");
      return;
    }

    // Aquí podrías guardar en Firebase antes de redirigir
    alert(`Cita agendada para el ${selectedDate.toLocaleDateString()} a las ${selectedHour}`);

    // Redireccionar a la página de citas
    router.push("/paciente/citas");
  };

  return (
    <main className="min-h-screen bg-white">
      <HeaderPaciente />

      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen y Calificación */}
        <div className="flex flex-col items-center">
          <Image
            src="/clinica-ejemplo.jpg"
            alt="Clinica los Angeles"
            width={600}
            height={400}
            className="rounded-lg object-cover"
          />

          {/* Calificación */}
          <div className="mt-4 text-center">
            <p className="font-semibold text-lg">Calificación</p>
            <div className="flex justify-center gap-1 text-yellow-400 text-xl">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-half-alt"></i>
              <i className="far fa-star"></i>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              <p className="font-semibold">Heading 3 - 9 June 2025</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis pellentesque metus id lacinia.</p>
            </div>

            <div className="mt-4">
              <p className="font-medium mb-1">Agregar tu comentario</p>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="far fa-star text-gray-400 text-lg"></i>
                ))}
              </div>
              <input
                placeholder="Escribe tu comentario..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Calendario y disponibilidad */}
        <div className="flex flex-col gap-4 text-gray-800">
          <h2 className="text-2xl font-bold">Clínica los Angeles</h2>
          <p><strong>Descripción:</strong> Clínica especializada en medicina general y atención médica personalizada.</p>
          <p><strong>Ubicación:</strong> Tlaxcala</p>

          <p className="text-blue-700 font-medium">Selecciona una fecha:</p>

          <div className="border rounded-md p-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              className="text-sm"
            />

            <div className="mt-6">
              <p className="font-medium text-sm mb-2">Selecciona un horario:</p>
              <select
                className="border px-2 py-1 rounded text-sm w-full"
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
              >
                <option value="">Elige una hora</option>
                {horarios.map((hora, idx) => (
                  <option key={idx} value={hora}>{hora}</option>
                ))}
              </select>
            </div>

            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={agendarCita}
            >
              Agendar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
