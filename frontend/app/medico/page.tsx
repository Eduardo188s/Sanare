'use client';

import React from 'react';
import NavbarMedico from './Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function MedicoHomePage() {
  return (
    <div>
      <NavbarMedico />
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Card de clínica */}
        <div className="bg-blue-100 border border-blue-300 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/2">
            <Image
              src="/clinica1.jpeg"
              alt="Clínica los Angeles"
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>

          {/* Información de la clínica */}
          <div className="w-full md:w-1/2 text-gray-800">
            <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">Clínica los Angeles</h2>
            <p className="mb-4 text-center md:text-left text-blue-800">
              Clínica los Angeles lo mejor para ti, ofreciendo diferentes médicos y servicios
            </p>

            <ul className="space-y-2 text-sm">
              <li><span className="font-semibold text-blue-700">📋 Especializada en:</span> Medicina General</li>
              <li><span className="font-semibold text-blue-700">📍 Ubicada en:</span> Tlaxcala</li>
              <li><span className="font-semibold text-blue-700">🕒 Horarios:</span> 8 a.m – 7 p.m</li>
            </ul>

            <div className="flex-col gap-2 p-2 mt-12 text-right">
              <Link href="/medico/consultorio">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition mr-4">
                  Editar consultorio
                </button>
                 <button className="bg-red-600 text-white px-4 py-2 rounded-2xl hover:bg-red-700 transition">
                  Eliminar consultorio
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Botón Agregar fuera de la card */}
        <div className="flex justify-end mt-6">
          <Link href="/medico/newConsultorio">
            <button className="bg-green-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-green-700 transition">
              ➕ Agregar consultorio
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
