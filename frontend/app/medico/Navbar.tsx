'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import {
  FaHome,
  FaUserMd,
  FaBell,
  FaQuestionCircle,
  FaUser
} from 'react-icons/fa';

export default function NavbarMedico({ hayNuevas = false }: { hayNuevas?: boolean }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    setDrawerAbierto(false);
    // lógica de logout
  };

  const MenuItems = () => (
    <>
      {/* INICIO */}
      <button
        className={`flex items-center p-3 rounded-md transition-all w-full
          ${pathname === '/medico'
            ? 'bg-blue-50 text-[#6381A8] font-semibold'
            : 'text-gray-800 hover:bg-gray-100'}
        `}
        onClick={() => {
          router.push('/medico');
          setDrawerAbierto(false);
        }}
      >
        <FaHome className="w-5 h-5 mr-3" />
        Inicio
      </button>

      {/* NOTIFICACIONES */}
      <button
        className={`relative flex items-center p-3 rounded-md transition-all w-full
          ${pathname.includes('/notificaciones')
            ? 'bg-blue-50 text-[#6381A8] font-semibold'
            : 'text-gray-800 hover:bg-gray-100'}
        `}
        onClick={() => {
          router.push('/medico/notificaciones');
          setDrawerAbierto(false);
        }}
      >
        <div className="relative">
          <FaBell className="w-5 h-5 mr-3" />
          {hayNuevas && !pathname.includes('/notificaciones') && (
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          )}
        </div>
        Notificaciones
      </button>

      {/* PERFIL */}
      <button
        className={`flex items-center p-3 rounded-md transition-all w-full
          ${pathname.includes('/perfil')
            ? 'bg-blue-50 text-[#6381A8] font-semibold'
            : 'text-gray-800 hover:bg-gray-100'}
        `}
        onClick={() => {
          router.push('/medico/perfil');
          setDrawerAbierto(false);
        }}
      >
        <FaUserMd className="w-5 h-5 mr-3" />
        Perfil
      </button>

      {/* AYUDA */}
      {/* <button
        className={`flex items-center p-3 rounded-md transition-all w-full
          ${pathname.includes('/soporte')
            ? 'bg-blue-50 text-[#6381A8] font-semibold'
            : 'text-gray-800 hover:bg-gray-100'}
        `}
        onClick={() => {
          router.push('/paciente/soporte');
          setDrawerAbierto(false);
        }}
      >
        <FaQuestionCircle className="w-5 h-5 mr-3" />
        Ayuda y soporte
      </button> */}
    </>
  );

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
      <button
        className="p-2 rounded-full hover:bg-white/20 transition"
                onClick={() => router.push('/medico/perfil')}
              >
                <FaUser className="w-6 h-6 text-white hover:text-black" />
      </button>

      {/* MENÚ ESCRITORIO */}
      {/* <div className="hidden md:flex items-center space-x-4 text-white">
        <MenuItems />
        <button
          className="p-3 hover:bg-white/20 rounded-md transition-all"
          onClick={handleCerrarSesion}
        >
          Cerrar sesión
        </button>
      </div> */}

      {/* BOTÓN MENÚ MÓVIL */}
      <div className="flex md:hidden">
        <button
          className="p-2 rounded-md text-white bg-white/10 hover:bg-white/20 transition-colors duration-200"
          onClick={() => setDrawerAbierto(!drawerAbierto)}
        >
          {drawerAbierto ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* DRAWER MÓVIL */}
      {drawerAbierto && (
        <div className="fixed top-16 right-0 w-64 h-full bg-white shadow-xl z-50 flex flex-col p-6 space-y-4 border-l border-gray-200">
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
