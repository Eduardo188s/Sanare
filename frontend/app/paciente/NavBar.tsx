'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface NavbarPacienteProps {
  onSearch?: (term: string) => void;
}

export default function NavbarPaciente({ onSearch }: NavbarPacienteProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleConsultorioClick = () => {
    router.push('/paciente');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <img src="/logo_sanare.jpg" alt="Sanare Logo" className="h-16" />
      </div>

      {/* Botón Paciente */}
      <button
        onClick={handleConsultorioClick}
        className="font-semibold text-lg px-4 py-1 rounded transition-colors duration-300 text-blue-700 hover:bg-gray-50 cursor-pointer"
      >
        Paciente
      </button>

      {/* Controles de la derecha */}
      <div className="flex items-center space-x-6">
        
        {/* Menú configuración */}
        <div className="relative">
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="font-semibold">Configuración</span>
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.044l3.71-3.813a.75.75 0 111.08 1.04l-4.24 4.36a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  console.log('Cerrar sesión');
                }}
              >
                Cerrar sesión
              </div>
            </div>
          )}
        </div>

        {/* 🔎 Buscador */}
        <div className="relative w-48">
          <input
            type="text"
            placeholder="Buscar clínica..."
            value={query}
            onChange={handleChange}
            className="w-full border rounded-full pl-8 pr-4 py-1 text-sm focus:outline-none"
          />
          <svg
            className="w-4 h-4 text-gray-500 absolute top-2 left-2.5"
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

        {/* Notificaciones */}
        <img src="/icono_notificaciones.png" alt="Notificaciones" className="h-8" />
        
        {/* Perfil paciente */}
        <img
          src="/icono_paciente.png" 
          alt="Perfil Paciente" 
          className="h-8 cursor-pointer"
          onClick={() => router.push('/paciente/perfil')}
        />
      </div>
    </nav>
  );
}
