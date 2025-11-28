'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function NavbarMedico() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const router = useRouter();

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    setDrawerAbierto(false);
    // Aquí iría la lógica de logout
  };

  const MenuItems = () => (
    <>
      {/* Notificaciones */}
      <button
        className="flex items-center p-3 rounded-md hover:bg-gray-100 md:hover:bg-white/20 text-gray-800 md:text-white transition-colors duration-200"
        onClick={() => {
          router.push('/medico/notificaciones');
          setDrawerAbierto(false);
        }}
      >
        <Bell className="w-5 h-5 mr-3 md:mr-0 md:w-6 md:h-6" />
        <span className="ml-1 hidden md:inline">Notificaciones</span>
      </button>

      {/* Configuración */}
      <div className="relative">
        <div
          className="flex items-center cursor-pointer md:space-x-1 p-3 md:p-0 rounded-md hover:bg-gray-100 md:hover:bg-transparent text-gray-800 md:text-white transition-colors duration-200"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="hidden md:inline font-semibold">Configuración</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${menuAbierto ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.044l3.71-3.813a.75.75 0 111.08 1.04l-4.24 4.36a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Menú desplegable en mobile */}
        {menuAbierto && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 border border-gray-200 rounded-md shadow-lg z-10 md:hidden">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={handleCerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Perfil */}
      <button
        className="flex items-center p-3 rounded-md hover:bg-gray-100 md:hover:bg-white/20 text-gray-800 md:text-white transition-colors duration-200"
        onClick={() => {
          router.push('/medico/perfil');
          setDrawerAbierto(false);
        }}
      >
        <svg
          className="w-6 h-6 mr-3 md:mr-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="ml-1 hidden md:inline">Perfil</span>
      </button>
    </>
  );

  return (
    <nav className="flex items-center justify-between bg-[#6381A8] p-4 border-b rounded-b-2xl border-gray-200 sticky top-0 z-50 w-full">
      {/* Logo */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/medico')}>
        <img src="/icons/logo_sanare.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white">Sanare</span>
          <span className="text-xs text-white">Directorio de clinicas</span>
        </div>
      </div>

      {/* Menú escritorio */}
      <div className="hidden md:flex items-center space-x-4">
        <MenuItems />
      </div>

      {/* Botón menú móvil */}
      <div className="flex md:hidden">
        <button
          className="p-2 rounded-md text-white bg-white/10 hover:bg-white/20 transition-colors duration-200"
          onClick={() => setDrawerAbierto(!drawerAbierto)}
        >
          {drawerAbierto ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Drawer móvil */}
      {drawerAbierto && (
        <div className="fixed top-16 right-0 w-64 h-full bg-white shadow-xl z-50 flex flex-col p-6 space-y-4 border-l border-gray-200 transition-transform duration-300">
          <MenuItems />
          <button
            className="flex items-center p-3 rounded-md hover:bg-gray-100 text-red-600 font-medium"
            onClick={handleCerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
