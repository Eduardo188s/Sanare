'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  FaHome,
  FaBell,
  FaUserMd,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';

export default function NavbarMedico({ hayNuevas = false }: { hayNuevas?: boolean }) {
  const [menuMobile, setMenuMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleCerrarSesion = () => {
    setMenuMobile(false);
    console.log("Cerrar sesión médico");
  };

  return (
    <nav className="flex items-center justify-between bg-[#6381A8] p-4 border-b rounded-b-2xl border-gray-200 sticky top-0 z-50 w-full">

      {/* LOGO */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => router.push('/medico')}
      >
        <img
          src="/icons/logo_sanare.jpg"
          alt="Logo"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white">Sanare</span>
          <span className="text-xs text-white">Directorio de clínicas</span>
        </div>
      </div>

      {/* PERFIL SOLO DESKTOP */}
      <button
        className="p-2 rounded-full hover:bg-white/20 transition hidden md:block"
        onClick={() => router.push('/medico/perfil')}
      >
        <FaUser className="w-6 h-6 text-white hover:text-black" />
      </button>

      {/* BOTÓN HAMBURGUESA (ANIMADO) */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10"
        onClick={() => setMenuMobile(!menuMobile)}
      >
        <span
          className={`block w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${
            menuMobile ? 'rotate-45 translate-y-2' : ''
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${
            menuMobile ? 'opacity-0' : ''
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            menuMobile ? '-rotate-45 -translate-y-2' : ''
          }`}
        ></span>
      </button>

      {/* PANEL MOBILE */}
      {menuMobile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end md:hidden">
          <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col gap-6 text-gray-900 animate-slideLeft">

            {/* Botón X */}
            <button className="self-end p-2" onClick={() => setMenuMobile(false)}>
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* INICIO */}
            <button
              className="flex items-center gap-3 text-lg text-gray-900"
              onClick={() => {
                router.push('/medico');
                setMenuMobile(false);
              }}
            >
              <FaHome className="text-[#6381A8]" />
              Inicio
            </button>

            {/* NOTIFICACIONES */}
            <button
              className="flex items-center gap-3 text-lg text-gray-900 relative"
              onClick={() => {
                router.push('/medico/notificaciones');
                setMenuMobile(false);
              }}
            >
              <FaBell className="text-[#6381A8]" />
              Notificaciones
              {hayNuevas && !pathname.includes('/notificaciones') && (
                <span className="absolute -top-1 left-5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* PERFIL */}
            <button
              className="flex items-center gap-3 text-lg text-gray-900"
              onClick={() => {
                router.push('/medico/perfil');
                setMenuMobile(false);
              }}
            >
              <FaUserMd className="text-[#6381A8]" />
              Perfil
            </button>

            {/* CERRAR SESIÓN */}
            <button
              className="flex items-center gap-3 text-lg text-red-600 mt-4"
              onClick={handleCerrarSesion}
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}
