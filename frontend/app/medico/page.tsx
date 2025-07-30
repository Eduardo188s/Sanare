'use client';

import React, { useEffect, useState } from 'react';
import NavbarMedico from './Navbar';
import Image from 'next/image';
import Link from 'next/link';

type Clinica = {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  hora_apertura: string;
  hora_cierre: string;
  imagen?: string;
};

export default function MedicoHomePage() {
  const [clinica, setClinica] = useState<Clinica | null>(null);
  const medicoId = typeof window !== 'undefined' ? localStorage.getItem('medicoId') : null;

  useEffect(() => {
  if (!medicoId) return;

  fetch(`http://127.0.0.1:8000/api/clinicas/?medico=${medicoId}`)
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      return res.json();
    })
    .then(data => {
      if (data.length > 0) setClinica(data[0]);
    })
    .catch(err => console.error('Error al cargar la clínica:', err));
}, [medicoId]);
  
  return (
    <main className='min-h-screen bg-white'>
      <NavbarMedico />
      <section className="max-w-6xl mx-auto px-4 py-12 bg-white">
        {clinica ? (
          <>
            {/* Card de clínica */}
            <div className="bg-blue-100 border border-blue-300 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                {clinica.imagen ? (
                  <Image
                    src={clinica.imagen ? `http://127.0.0.1:8000${clinica.imagen}` : '/default-image.png'}
                    alt={clinica.nombre}
                    width={600}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 text-gray-800">
                <h2 className="text-2xl font-semibold mb-2">{clinica.nombre}</h2>
                <p className="mb-4 text-blue-800">{clinica.descripcion}</p>

                <ul className="space-y-2 text-sm">
                  <li><span className="font-semibold text-blue-700">📍 Ubicación:</span> {clinica.ubicacion}</li>
                  <li><span className="font-semibold text-blue-700">🕒 Horarios:</span> {clinica.hora_apertura} – {clinica.hora_cierre}</li>
                </ul>

                <div className="flex-col gap-2 p-2 mt-12 text-right">
                  <Link href={`/medico/consultorio/${clinica.id}`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition mr-4">
                      Editar consultorio
                    </button>
                  </Link>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-2xl hover:bg-red-700 transition"
                    onClick={() => alert('Funcionalidad para eliminar pendiente')}
                  >
                    Eliminar consultorio
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6">No tienes ningún consultorio registrado todavía.</p>
            <Link href="/medico/newConsultorio">
              <button className="bg-green-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-green-700 transition">
                ➕ Agregar consultorio
              </button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}