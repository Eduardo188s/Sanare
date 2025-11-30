"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCommentDots,
  FaHome,
  FaLocationArrow,
  FaUser,
} from "react-icons/fa";
import NavbarPaciente from "../NavBar";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import { getDB } from "@/utils/db";
import SidebarPaciente from "@/components/SideBarPaciente";

type Cita = {
  id: number;
  estado?: string | null;
  clinica_nombre?: string | null;
  medico_nombre?: string | null;
  fecha?: string | null;
  hora?: string | null;
  ubicacion?: string | null;
  motivo?: string | null;
  clinica?: {
    id: number;
    nombre: string;
    imagen?: string | null;
    ubicacion?: string | null;
  } | null;
};

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "warning">(
    "success"
  );

  const { accessToken, refreshAccessToken, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /** ---------------------- AUTORIZACIÓN ---------------------- **/
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let token = accessToken;

    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        setModalType("warning");
        setModalMessage("Tu sesión ha expirado. Inicia sesión nuevamente.");
        setModalOpen(true);
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
        setModalType("warning");
        setModalMessage("Tu sesión ha expirado. Inicia sesión nuevamente.");
        setModalOpen(true);
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

  /** ---------------------- OBTENER CITAS ---------------------- **/
  useEffect(() => {
    if (loading) return;

    const obtenerCitas = async () => {
      try {
        setCargando(true);
        const res = await fetchWithAuth(
          "https://sanarebackend-production.up.railway.app/api/citas/my/"
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Error: ${res.status} ${res.statusText} - ${JSON.stringify(
              errorData
            )}`
          );
        }

        const data = await res.json();
        localStorage.setItem("citas-cache", JSON.stringify(data));
        setCitas(data);
      } catch (error) {
        console.warn("No hay conexión. Cargando desde cache.");

        const cache = localStorage.getItem("citas-cache");
        if (cache) {
          setCitas(JSON.parse(cache));
        }
      } finally {
        setCargando(false);
      }
    };

    obtenerCitas();
  }, [loading, accessToken, refreshAccessToken, router]);

  /** ---------------------- CANCELAR CITA ---------------------- **/
  const cancelarCita = async (id: number) => {
    setConfirmAction(() => () => confirmarCancelacion(id));
    setConfirmOpen(true);
  };

  const confirmarCancelacion = async (id: number) => {
    if (!navigator.onLine) {
      const db = await getDB();
      await db.add("pending", {
        id: Date.now(),
        url: `https://sanarebackend-production.up.railway.app/api/citas/${id}/cancelar/`,
        method: "PATCH",
        body: {},
      });

      navigator.serviceWorker.ready.then((reg) => {
        reg.sync.register("sync-citas");
      });

      setModalType("warning");
      setModalMessage(
        "La cita se cancelará automáticamente cuando recuperes la conexión."
      );
      setModalOpen(true);

      setCitas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: "Cancelada" } : c))
      );

      return;
    }

    try {
      const response = await fetchWithAuth(
        `https://sanarebackend-production.up.railway.app/api/citas/${id}/cancelar/`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        setModalType("error");
        setModalMessage("No se pudo cancelar la cita.");
        setModalOpen(true);
        return;
      }

      const data = await response.json();

      setModalType("success");
      setModalMessage(data.mensaje || "La cita ha sido cancelada.");
      setModalOpen(true);

      setCitas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: "Cancelada" } : c))
      );
    } catch {
      setModalType("error");
      setModalMessage("Error al cancelar la cita.");
      setModalOpen(true);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <NavbarPaciente />

      {/* ✅ SIDEBAR — SOLO EN ESCRITORIO */}
      <div className="hidden md:block">
        <SidebarPaciente />
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* SIDEBAR OPCIONAL DEL LADO IZQUIERDO (solo escritorio) */}
        <aside className="hidden md:flex w-64 bg-white shadow-md border-r flex-col h-[calc(100vh-64px)] sticky top-16">
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              href="/paciente"
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                pathname === "/paciente"
                  ? "bg-blue-100 text-[#6381A8] font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaHome /> Inicio
            </Link>

            <Link
              href="/paciente/citas"
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                pathname.includes("/citas")
                  ? "bg-blue-100 text-[#6381A8] font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaCalendarAlt /> Mis citas
            </Link>

            <Link
              href="/paciente/perfil"
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                pathname.includes("/perfil")
                  ? "bg-blue-100 text-[#6381A8] font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaUser /> Perfil
            </Link>
          </nav>
        </aside>

        {/* -------------------- CONTENIDO -------------------- */}
        <section className="flex-1 w-full max-w-5xl mx-auto px-4 py-10 space-y-6">
          {cargando ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-700 font-medium text-lg">
                Cargando citas...
              </p>
            </div>
          ) : citas.length === 0 ? (
            <p className="text-gray-600">No tienes citas agendadas aún.</p>
          ) : (
            <>
              <h1 className="text-gray-800 text-2xl font-bold mb-6">
                Mis citas agendadas
              </h1>

              <ul className="space-y-6">
                {citas.map((cita) => {
                  const estado = cita.estado?.trim() || "Pendiente";
                  const clinicaNombre = cita.clinica_nombre || "Sin clínica";
                  const medicoNombre = cita.medico_nombre || "Sin médico";
                  const fecha = cita.fecha || "Sin fecha";
                  const hora = cita.hora || "Sin hora";
                  const ubicacion = cita.ubicacion || "Sin ubicación";
                  const motivo =
                    cita.motivo?.trim() || "Sin motivo especificado";

                  const estadoColor =
                    estado.toLowerCase() === "cancelada"
                      ? "bg-red-100 text-red-600"
                      : estado.toLowerCase() === "completada"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-700";

                  return (
                    <li
                      key={cita.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-200 transition-transform hover:scale-[1.01]"
                    >
                      {/* IMAGEN */}
                      <div className="w-full md:w-80 h-44 md:h-auto shrink-0 p-3">
                        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                          <Image
                            src={
                              cita.clinica?.imagen
                                ? cita.clinica.imagen.startsWith("http")
                                  ? cita.clinica.imagen
                                  : `${process.env.NEXT_PUBLIC_API_URL}${cita.clinica.imagen}`
                                : "/img/default-clinic.jpg"
                            }
                            alt={clinicaNombre}
                            width={400}
                            height={260}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>

                      {/* INFO */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                              {clinicaNombre}
                            </h2>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${estadoColor}`}
                            >
                              {estado}
                            </span>
                          </div>

                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <FaUser className="text-[#6381A8]" /> {medicoNombre}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <FaCalendarAlt className="text-[#6381A8]" /> {fecha}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <FaClock className="text-[#6381A8]" /> {hora}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <FaLocationArrow className="text-[#6381A8]" />{" "}
                            {ubicacion}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <FaCommentDots className="text-[#6381A8]" /> {motivo}
                          </p>
                        </div>

                        {estado.toLowerCase() !== "cancelada" && (
                          <div className="mt-4 text-right">
                            <button
                              onClick={() => cancelarCita(cita.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition-all"
                            >
                              Cancelar cita
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      </div>

      {/* MODALES */}
      <ConfirmModal
        open={confirmOpen}
        message="¿Estás seguro de que quieres cancelar esta cita?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          confirmAction();
        }}
      />

      <Modal
        open={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
