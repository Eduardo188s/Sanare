'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function NavbarMedico() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [drawerAbierto, setDrawerAbierto] = useState(false); // para mobile
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between bg-[#6381A8] p-4 border-b rounded-b-2xl border-gray-200 sticky top-0 z-50 w-full">
      {/* Logo y texto */}
      <div className="flex items-center space-x-2">
        <img
          src="/icons/logo_sanare.jpg"
          alt="Sanare Logo"
          className="h-10 w-10 rounded-full object-cover cursor-pointer"
          onClick={() => router.push('/medico')}
        />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white">Sanare</span>
          <span className="text-xs text-white">Directorio de clinicas</span>
        </div>
      </div>

      {/* Botón menú móvil */}
      <div className="flex md:hidden">
        <button
          className="p-2 rounded-md text-white hover:bg-white/20"
          onClick={() => setDrawerAbierto(!drawerAbierto)}
        >
          {drawerAbierto ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Menú escritorio */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Notificaciones */}
        <button
          className="p-2 rounded-full transition-colors duration-200 hover:bg-white/20"
          onClick={() => router.push('/medico/notificaciones')}
        >
          <Bell className="w-6 h-6 text-white hover:text-black" />
        </button>

        {/* Menú configuración */}
        <div className="relative">
          <div
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
          </div>
          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 border border-gray-200 rounded-md shadow-lg z-10">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setMenuAbierto(false);
                  // Aquí iría la lógica de cerrar sesión
                }}
              >
                Cerrar sesión
              </div>
            </div>
          )}
        </div>

        {/* Perfil de usuario */}
        <button
          className="p-2 rounded-full transition-colors duration-200 hover:bg-white/20"
          onClick={() => router.push('/medico/perfil')}
        >
          <svg
            className="w-6 h-6 text-white hover:text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Drawer móvil */}
      {drawerAbierto && (
        <div className="fixed top-16 right-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col p-4 space-y-4 md:hidden">
          <button
            className="flex items-center p-2 rounded-md hover:bg-gray-100"
            onClick={() => router.push('/medico/notificaciones')}
          >
            <Bell className="w-5 h-5 mr-2" /> Notificaciones
          </button>
          <button
            className="flex items-center p-2 rounded-md hover:bg-gray-100"
            onClick={() => router.push('/medico/perfil')}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Perfil
          </button>
          <button
            className="flex items-center p-2 rounded-md hover:bg-gray-100 text-red-600"
            onClick={() => {
              setDrawerAbierto(false);
              // Lógica cerrar sesión
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
