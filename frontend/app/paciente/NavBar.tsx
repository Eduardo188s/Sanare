'use client';

import React, { useState, ChangeEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarPacienteProps {
  onSearch?: (term: string) => void;
}

export default function NavbarPaciente({ onSearch }: NavbarPacienteProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

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
  const isSearchDisabled = pathname !== "/paciente";

  return (
    <nav className="flex items-center justify-between bg-[#6381A8] p-4 border-b rounded-b-2xl border-gray-200 sticky top-0 z-50 w-full">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/logo_sanare.jpg" alt="Sanare Logo" className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white">Sanare</span>
          <span className="text-xs text-white">Directorio de clinicas</span>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center">
      <div className="relative w-60">
      <input
      type="text"
      placeholder="Buscar clínica"
      value={query}
      onChange={handleChange}
      disabled={isSearchDisabled}
            className={`w-full rounded-full pl-8 pr-4 py-2 text-sm 
              ${isSearchDisabled 
                ? "bg-white/10 text-gray-300 cursor-not-allowed placeholder-gray-400" 
                : "bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
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

<div className="flex items-center space-x-4">
  {/* Menú configuración */}
  <div className="relative">
    <div
      className="flex items-center space-x-1 cursor-pointer"
      onClick={() => setMenuAbierto(!menuAbierto)}
    >
      <span className="font-semibold text-white">Configuración</span>
      <svg className={`w-4 h-4 text-white transition-transform duration-200 ${menuAbierto ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
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
            //console.log('Cerrar sesión');
            setMenuAbierto(false);
          }}
        >
          Cerrar sesión
        </div>
      </div>
    )}
  </div>

  {/* Perfil de Usuario */}
  <button
    className="p-2 rounded-full transition-colors duration-200 hover:bg-white/20"
    onClick={() => router.push('/paciente/perfil')}
  >
    <svg className="w-6 h-6 text-white hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  </button>
</div>
    </nav>
  );
}