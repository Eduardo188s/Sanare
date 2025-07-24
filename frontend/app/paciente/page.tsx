'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarPaciente from "./NavBar";

type Clinica = {
  id: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  horarios: string;
  ubicacion: string;
  especialidad: string;
  especialidades: string[];
};

export default function PacienteDashboard() {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/clinicas/")
      .then((res) => res.json())
      .then((data) => setClinicas(data))
      .catch((error) => console.error("Error al cargar clínicas:", error));
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <NavbarPaciente />

      <section className="max-w-6xl mx-auto px-4 py-12">
        {clinicas.map((clinica) => (
        <div key={clinica.id} className="bg-blue-100 border border-blue-300 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
          
          <div className="w-full md:w-1/2">
            <Image
              src="/clinica1.jpeg" 
              alt={clinica.nombre}
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 text-gray-800">
            <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">{clinica.nombre}</h2>
            <p className="mb-4 text-center md:text-left text-blue-800">
              {clinica.descripcion} 
            </p>

            <ul className="space-y-2 text-sm">
              <li><span className="font-semibold text-blue-700">📋 Especializada en:</span> {clinica.especialidades.join(', ')}</li>
              <li><span className="font-semibold text-blue-700">📍 Ubicada en:</span> {clinica.ubicacion}</li>
              <li><span className="font-semibold text-blue-700">🕒 Horarios:</span> {clinica.horarios}</li>
            </ul>

            <div className="mt-4 text-right">
              <Link href={`/paciente/clinica/${clinica.id}`}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition">Ver más</button>
              </Link>
            </div>
          </div>
        </div>
        ))}
      </section>
    </main>
  );
}