'use client';

import React from 'react';
import NavbarMedico from './components/Navbar';


export default function MedicoHomePage() {
  return (
    <div>
      <NavbarMedico />
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-gray-800">Bienvenido a medico</h1>
      </div>
    </div>
  );
}
