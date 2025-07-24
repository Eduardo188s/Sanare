// app/paciente/citas/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaLocationArrow, FaPlaceOfWorship, FaUser } from "react-icons/fa";
import NavbarPaciente from "../NavBar";

type Cita = {
  id: number;
  estado: string;
  clinica: string;
  medico: string;
  fecha: string;
  hora: string;
  ubicacion: string;
};

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/citas/",)
      .then(res => {
        console.log("RES STATUS:", res.status);
        if (!res.ok) {
          throw new Error("Error al obtener las citas");
        }
        return res.json();
    })
      .then((data: Cita[]) => setCitas(data))
      .catch(error => console.error("Error:", error));
  }, []);

  const handleCancelarCita = (id: number) => {
  setCitas((prev) => prev.filter((cita) => cita.id !== id));
};

const cancelarCita = async (id: number) => {
  const confirmacion = confirm("¿Estás seguro de que quieres cancelar esta cita?");
  if(!confirmacion) return;

  try {
    console.log("Eliminando cita con ID:", id);
    const response = await fetch(`http://127.0.0.1:8000/api/citas/${id}/cancelar/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al cancelar la cita');
    }
    const data = await response.json();
    alert(data.mensaje);
    setCitas((prev) =>
      prev.map((cita) =>
        cita.id === id ? { ...cita, estado: "Cancelada" } : cita
      )
    );
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al cancelar la cita");
  }
}

  return (
    <main className="min-h-screen bg-gray-100">
      <NavbarPaciente />
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
                  <h2 className="text-lg font-semibold">{cita.estado}</h2>

                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaPlaceOfWorship className="text-blue-500" /> {cita.clinica}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaUser className="text-blue-500" /> {cita.medico}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaCalendarAlt className="text-blue-500" /> {cita.fecha}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaClock className="text-blue-500" /> {cita.hora}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <FaLocationArrow className="text-blue-500" /> {cita.ubicacion}
                  </p>
                </div>
                <button
                  onClick={() => cancelarCita(cita.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl text-sm"
                >
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
