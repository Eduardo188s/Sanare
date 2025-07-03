// components/HeaderPaciente.tsx

import React from "react";
import Image from "next/image";

export default function HeaderPaciente() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <Image
          src="/logo_sanare.jpg" // asegúrate de que exista en /public
          alt="Sanare Logo"
          width={100}
          height={100}
        />
        <h1 className="font-semibold text-lg">Configuración</h1>
        <span className="text-blue-600">▼</span>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none text-sm"
        />
        <i className="fas fa-bell text-gray-600 text-lg"></i>
        <i className="fas fa-user-circle text-gray-600 text-xl"></i>
      </div>
    </header>
  );
}
