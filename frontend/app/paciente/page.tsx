'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import NavbarPaciente from "./NavBar";
import SideBarPaciente from "@/components/SideBarPaciente";

type Medico = {
  id: number;
  full_name: string;
  especialidad_nombre: string | null;
};

type Clinica = {
  id: number;
  nombre: string;
  descripcion: string;
  hora_apertura: string;
  hora_cierre: string;
  ubicacion: string;
  especialidad: string[];
  imagen: string;
  medico_responsable: Medico | null;
  calificacion?: number;
  reseñas?: number;
  ultima_actualizacion?: string;
};

export default function PacienteDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [search, setSearch] = useState("");
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [cargandoDatos, setCargandoDatos] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("https://sanarebackend-production.up.railway.app/api/clinicas/")
      .then((res) => res.json())
      .then((data) => {
        const clinicasConDatosSimulados = data.map((c: Clinica) => ({
          ...c,
          calificacion: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)),
          reseñas: Math.floor(Math.random() * (150 - 10) + 10),
          ultima_actualizacion:
            "hace " + (Math.floor(Math.random() * 7) + 1) + " días",
        }));
        setClinicas(clinicasConDatosSimulados);
      })
      .catch((error) => console.error("Error al cargar clínicas:", error))
      .finally(() => setCargandoDatos(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-100">
        <NavbarPaciente onSearch={setSearch} />
        <SideBarPaciente />
        <div className="flex-1 flex items-center justify-center text-gray-700">
          Cargando...
        </div>
      </main>
    );
  }

  if (!user) return null;

  const especialidadesUnicas = Array.from(
    new Set(
      clinicas.flatMap((c) =>
        c.medico_responsable?.especialidad_nombre
          ? [c.medico_responsable.especialidad_nombre]
          : []
      )
    )
  );

  const filteredClinicas = clinicas.filter((clinica) => {
    const textMatch =
      clinica.nombre.toLowerCase().includes(search.toLowerCase()) ||
      clinica.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      clinica.ubicacion.toLowerCase().includes(search.toLowerCase()) ||
      (clinica.medico_responsable?.especialidad_nombre?.toLowerCase() || "").includes(
        search.toLowerCase()
      );

    const especialidadMatch =
      !especialidadSeleccionada ||
      clinica.medico_responsable?.especialidad_nombre ===
        especialidadSeleccionada;

    return textMatch && especialidadMatch;
  });

  const renderStars = (rating: number | undefined) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <NavbarPaciente onSearch={setSearch} />
      <SideBarPaciente />

      <section className="flex-1 ml-64 mt-16 px-6 py-10 overflow-y-auto">
        {cargandoDatos ? (
          <div className="flex justify-center items-center h-[60vh] text-gray-700 text-lg">
            Cargando clínicas...
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Filtro superior */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Clínicas</h1>
                <span className="text-gray-500">
                  Mostrando {filteredClinicas.length} resultados
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="especialidad" className="text-sm text-gray-800 font-medium">
                  Especialidad:
                </label>
                <select
                  id="especialidad"
                  value={especialidadSeleccionada}
                  onChange={(e) => setEspecialidadSeleccionada(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-gray-800"
                >
                  <option value="">Todas</option>
                  {especialidadesUnicas.map((esp) => (
                    <option key={esp} value={esp}>
                      {esp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista de clínicas */}
            {filteredClinicas.length > 0 ? (
              filteredClinicas.map((clinica) => (
                <div
                  key={clinica.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className="w-full md:w-[400px] shrink-0">
                    {clinica.imagen ? (
                      <Image
                        src={clinica.imagen}
                        alt={clinica.nombre}
                        width={400}
                        height={300}
                        className="rounded-xl object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
                        Sin imagen disponible
                      </div>
                    )}
                  </div>

                  <div className="grow flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {clinica.nombre || "Sin nombre"}
                      </h2>
                      <p className="text-gray-500 text-sm mb-4">
                        {clinica.descripcion || "Clínica especializada"}
                      </p>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-700 text-sm">
                        <div>
                          <span className="font-semibold">Especialidad:</span>
                          <p className="text-gray-500">
                            {clinica.medico_responsable?.especialidad_nombre ||
                              "No especificada"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold">Ubicación:</span>
                          <p className="text-gray-500">{clinica.ubicacion}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Horarios:</span>
                          <p className="text-gray-500">
                            {clinica.hora_apertura && clinica.hora_cierre
                              ? `${clinica.hora_apertura} - ${clinica.hora_cierre}`
                              : "No especificado"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(clinica.calificacion)}
                          {clinica.calificacion && (
                            <span className="font-medium text-gray-800">
                              {clinica.calificacion}
                            </span>
                          )}
                          {clinica.reseñas && (
                            <span className="text-gray-600 text-sm">
                              ({clinica.reseñas} reseñas)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {clinica.ultima_actualizacion
                          ? `Última actualización: ${clinica.ultima_actualizacion}`
                          : ""}
                      </span>
                      <div>
                        <Link href={`/paciente/clinica/${clinica.id}`} passHref>
                          <button className="bg-[#6381A8] hover:bg-[#4f6a8f] text-white px-5 py-2 rounded-3xl text-sm font-medium transition">
                            Agendar cita
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No hay clínicas disponibles.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
