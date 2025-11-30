'use client';

import React, { useState, ChangeEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaQuestionCircle,
  FaSignOutAlt,
} from 'react-icons/fa';

interface NavbarPacienteProps {
  onSearch?: (term: string) => void;
}

export default function NavbarPaciente({ onSearch }: NavbarPacienteProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const isSearchDisabled = pathname !== '/paciente';

  return (
    <nav className="flex items-center justify-between bg-[#6381A8] p-4 border-b rounded-b-2xl border-gray-200 sticky top-0 z-50 w-full">
      {/* LOGO */}
      <div className="flex items-center space-x-2">
        <img
          src="/icons/logo_sanare.jpg"
          alt="Sanare Logo"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white">Sanare</span>
          <span className="text-xs text-white">Directorio de clínicas</span>
        </div>
      </div>

      {/* BUSCADOR DESKTOP */}
      <div className="hidden md:flex flex-1 justify-center items-center">
        <div className="relative w-60">
          <input
            type="text"
            placeholder="Buscar clínica"
            value={query}
            onChange={handleChange}
            disabled={isSearchDisabled}
            className={`w-full rounded-full pl-8 pr-4 py-2 text-sm 
              ${
                isSearchDisabled
                  ? 'bg-white/10 text-gray-300 cursor-not-allowed placeholder-gray-400'
                  : 'bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white'
              }`}
          />
          <svg
            className="w-4 h-4 text-white absolute top-2.5 left-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.65 11.32a5.33 5.33 0 11-10.66 0 5.33 5.33 0 0110.66 0z"
            />
          </svg>
        </div>
      </div>

      {/* OPCIONES DESKTOP */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="relative">
          {/* <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="font-semibold text-white">Configuración</span>
            <svg
              className={`w-4 h-4 text-white transition-transform duration-200 ${
                menuAbierto ? 'rotate-180' : ''
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.044l3.71-3.813a.75.75 0 111.08 1.04l-4.24 4.36a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div> */}

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 border border-gray-200 rounded-md shadow-lg z-10">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                Cerrar sesión
              </div>
            </div>
          )}
        </div>

        <button
          className="p-2 rounded-full hover:bg-white/20 transition"
          onClick={() => router.push('/paciente/perfil')}
        >
          <FaUser className="w-6 h-6 text-white hover:text-black" />
        </button>
      </div>

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
            {/* Cerrar panel con X */}
            <button
              className="self-end p-2"
              onClick={() => setMenuMobile(false)}
            >
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

            {/* OPCIONES (MATCH del SidebarPaciente) */}
            <button
              className="flex items-center gap-3 text-lg text-gray-900"
              onClick={() => {
                router.push('/paciente');
                setMenuMobile(false);
              }}
            >
              <FaHome className="text-[#6381A8]" />
              Inicio
            </button>

            <button
              className="flex items-center gap-3 text-lg text-gray-900"
              onClick={() => {
                router.push('/paciente/citas');
                setMenuMobile(false);
              }}
            >
              <FaCalendarAlt className="text-[#6381A8]" />
              Mis citas
            </button>

            <button
              className="flex items-center gap-3 text-lg text-gray-900"
              onClick={() => {
                router.push('/paciente/perfil');
                setMenuMobile(false);
              }}
            >
              <FaUser className="text-[#6381A8]" />
              Perfil
            </button>

            {/* <button
              className="flex items-center gap-3 text-lg text-gray-900"
              onClick={() => {
                router.push('/paciente/soporte');
                setMenuMobile(false);
              }}
            >
              <FaQuestionCircle className="text-[#6381A8]" />
              Ayuda y soporte
            </button> */}

            {/* Cerrar sesión */}
            <button className="flex items-center gap-3 text-lg text-red-600 mt-4">
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
