"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import NavbarMedico from "../Navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SideBarMedico from "@/components/SideBarMedico";

export default function PerfilMedico() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.is_medico)) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarMedico />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <SideBarMedico />
        </div>

        {/* Contenido principal */}
        <section className="flex-1 mt-16 px-4 md:px-6 lg:px-10 py-6">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 md:gap-10">
            {/* Columna Izquierda */}
            <div className="flex flex-col gap-6 w-full md:w-2/3">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {user.is_medico ? "Médico" : "Paciente"}
              </h2>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="w-28 h-28 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/icons/logo_sanare.jpg"
                    alt="Foto Perfil"
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {user.full_name || user.username}
                  </h2>
                  <p className="text-sm text-gray-500">{user.especialidad}</p>
                </div>
              </div>

              {/* Información Personal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Correo</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Teléfono</h3>
                  <p className="text-sm text-gray-600">{user.telefono}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Fecha de Nacimiento</h3>
                  <p className="text-sm text-gray-600">{user.fecha_nacimiento}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Sexo</h3>
                  <p className="text-sm text-gray-600">{user.sexo}</p>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="w-full md:w-1/3 flex flex-col gap-4 mt-6 md:mt-0">
              <div className="px-4 py-3 border rounded-lg">
                <h3 className="text-sm font-bold text-gray-700 mb-2">
                  Información Profesional
                </h3>
                <p className="text-sm text-gray-600">
                  Especialidad: {user.especialidad || "No especificada"}
                </p>
                <p className="text-sm text-gray-600">
                  Usuario: {user.username}
                </p>
              </div>

              <button
                onClick={logout}
                className="flex items-center justify-center px-4 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
