"use client";

import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCommentDots,
  FaLocationArrow,
  FaPlaceOfWorship,
  FaUser,
} from "react-icons/fa";
import NavbarPaciente from "../NavBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Cita = {
  id: number;
  estado?: string | null;
  clinica_nombre?: string | null;
  medico_nombre?: string | null;
  fecha?: string | null;
  hora?: string | null;
  ubicacion?: string | null;
  motivo?: string | null;
};

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const { accessToken, refreshAccessToken, loading } = useAuth();
  const router = useRouter();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let token = accessToken;

    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
        router.push("/login");
        throw new Error("Sesión expirada");
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) {
        alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
        router.push("/login");
        throw new Error("Sesión expirada");
      }

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    return response;
  };

  useEffect(() => {
    if (loading) return;

    const obtenerCitas = async () => {
      try {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/citas/my/");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Error al obtener las citas: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`
          );
        }
        const data = await res.json();
        setCitas(data);
      } catch (error) {
        //console.error(error);
      }
    };

    obtenerCitas();
  }, [loading, accessToken, refreshAccessToken, router]);

  const cancelarCita = async (id: number) => {
    const confirmacion = confirm("¿Estás seguro de que quieres cancelar esta cita?");
    if (!confirmacion) return;

    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/api/citas/${id}/cancelar/`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Error al cancelar la cita");

      const data = await response.json();
      alert(data.mensaje);

      setCitas((prev) =>
        prev.map((cita) =>
          cita.id === id ? { ...cita, estado: "Cancelada" } : cita
        )
      );
    } catch (error) {
      //console.error(error);
      alert("Ocurrió un error al cancelar la cita");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <NavbarPaciente />
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Mis citas agendadas</h1>

        {citas.length === 0 ? (
          <p className="text-gray-600">No tienes citas agendadas aún.</p>
        ) : (
          <ul className="space-y-4">
            {citas.map((cita) => {
              const estado = cita.estado?.trim() || "Pendiente";
              const clinicaNombre = cita.clinica_nombre || "Sin clínica";
              const medicoNombre = cita.medico_nombre || "Sin médico";
              const fecha = cita.fecha || "Sin fecha";
              const hora = cita.hora || "Sin hora";
              const ubicacion = cita.ubicacion || "Sin ubicación";
              const motivo = cita.motivo?.trim() || "Sin motivo especificado";

              return (
                <li
                  key={cita.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{estado}</h2>

                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaPlaceOfWorship className="text-blue-500" /> {clinicaNombre}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaUser className="text-blue-500" /> {medicoNombre}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaCalendarAlt className="text-blue-500" /> {fecha}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaClock className="text-blue-500" /> {hora}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaLocationArrow className="text-blue-500" /> {ubicacion}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaCommentDots className="text-blue-500" /> {motivo}
                    </p>
                  </div>

                  {estado.toLowerCase() !== "cancelada" && (
                    <button
                      onClick={() => cancelarCita(cita.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl text-sm"
                    >
                      Cancelar cita
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
