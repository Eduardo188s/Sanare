"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaBuilding, FaCalendarAlt, FaClock } from "react-icons/fa";
import NavbarMedico from "../Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SideBarMedico from "@/components/SideBarMedico";

type Notificacion = {
  id: number;
  mensaje: string;
  fecha_creacion: string;
  paciente_nombre?: string;
  clinica_nombre?: string;
  clinica?: {
    id: number;
    nombre: string;
    imagen?: string | null;
    ubicacion?: string | null;
  } | null;
  fecha_cita?: string;
  hora_cita?: string;
  leida?: boolean;
};

export default function NotificacionesPage() {
  const { accessToken, refreshAccessToken, user, loading } = useAuth();
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (loading || !user) return;

    const obtenerNotificaciones = async () => {
      try {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/notificaciones/my/");
        if (!res.ok) throw new Error("Error al obtener las notificaciones");
        const data = await res.json();
        setNotificaciones(data);
      } catch {
        alert("No se pudieron cargar las notificaciones");
      } finally {
        setIsLoading(false);
      }
    };

    obtenerNotificaciones();
  }, [loading, accessToken, refreshAccessToken, user]);

  const marcarComoLeida = async (id: number) => {
    try {
      await fetchWithAuth(`http://127.0.0.1:8000/api/notificaciones/${id}/leer/`, {
        method: "PATCH",
      });
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch {
      //console.error("Error al marcar como leída:", error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <NavbarMedico />
      <SideBarMedico />

      {/* 🔹 Contenido principal */}
      <section className="flex-1 ml-64 mt-16 px-6 py-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-gray-800 text-2xl font-bold mb-6">
            Mis notificaciones
          </h2>

          {/* 🔸 Pantalla de carga centrada (sin ocultar Navbar ni Sidebar) */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-[#6381A8] rounded-full animate-spin"></div>
                <p className="text-xl text-gray-700 mt-4">Cargando notificaciones...</p>
              </div>
            </div>
          ) : notificaciones.length === 0 ? (
            <p className="text-gray-800">No tienes notificaciones.</p>
          ) : (
            <ul className="space-y-6">
              {notificaciones.map((notif) => {
                const clinicaNombre = notif.clinica_nombre || "Desconocida";
                const fecha = notif.fecha_cita || "Sin fecha";
                const hora = notif.hora_cita || "Sin hora";
                const leida = notif.leida;

                return (
                  <li
                    key={notif.id}
                    onClick={() => marcarComoLeida(notif.id)}
                    className={`bg-white rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-in-out flex flex-col md:flex-row w-full max-w-5xl mx-auto overflow-hidden ${
                      leida ? "border-gray-200" : "border-[#6381A8]"
                    } cursor-pointer`}
                  >
                    {/* Imagen de la clínica */}
                    <div className="md:w-100 h-56 md:h-auto shrink-0 p-4">
                      <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                          src={
                            notif.clinica?.imagen
                              ? notif.clinica.imagen.startsWith("http")
                                ? notif.clinica.imagen
                                : `${process.env.NEXT_PUBLIC_API_URL ?? ""}${notif.clinica.imagen}`
                              : `/img/${notif.clinica_nombre
                                  ?.toLowerCase()
                                  .replace(/\s+/g, "-")
                                  .normalize("NFD")
                                  .replace(/[\u0300-\u036f]/g, "") || "default-clinic"}.jpg`
                          }
                          alt={notif.clinica_nombre || "Clínica"}
                          width={400}
                          height={260}
                          className="w-full h-full object-cover object-center"
                          unoptimized
                        />
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-semibold text-gray-800 leading-snug">
                            {notif.mensaje}
                          </h3>
                          {!leida && (
                            <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                              Nuevo
                            </span>
                          )}
                        </div>

                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <FaBuilding className="text-[#6381A8]" /> {clinicaNombre}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <FaCalendarAlt className="text-[#6381A8]" /> {fecha}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <FaClock className="text-[#6381A8]" /> {hora}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
