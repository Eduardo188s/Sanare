'use client';
import React from 'react';
import Image from 'next/image';
import { FiChevronRight } from 'react-icons/fi';
import NavbarMedico from '../Navbar';

export default function PerfilMedico() {
  return (
    <main className="min-h-screen bg-white">
        <NavbarMedico />
        <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row justify-between gap-10">
            {/* LADO IZQUIERDO */}
            <div className="flex flex-col gap-6 w-full md:w-2/3">
            <div className="flex items-center gap-6">
                <div className="w-28 h-28 bg-gray-200 rounded-full overflow-hidden">
                <Image
                    src="/logo_sanare.jpg"
                    alt="Foto Perfil"
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                />
                </div>
                <div>
                <h2 className="text-xl font-semibold text-gray-800">Michael Angelo</h2>
                <p className="text-sm text-gray-500">Cirujano dentista</p>
                </div>
            </div>

            {/* ABOUT ME */}
            <div>
                <h3 className="text-sm font-bold text-gray-700 mb-1">ABOUT ME</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis
                pellentesque metus id lacinia. Nunc dapibus pulvinar auctor. Duis nec sem at orci.
                </p>
            </div>

            {/* BOTONES */}
            <div className="flex items-center gap-4 mt-2">
                <input
                type="text"
                placeholder="Agregar Matrícula"
                className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition shadow">
                Validar
                </button>
            </div>
            </div>

            {/* LADO DERECHO: SECCIONES */}
            <div className="w-full md:w-1/3 flex flex-col gap-4 mt-6 md:mt-0">
            {[
                { label: 'Educación', href: '/medico/educacion' },
                { label: 'Experiencia', href: '/medico/experiencia' },
                { label: 'Consultorio', href: '/medico/consultorio' },
                { label: 'Servicios', href: '/medico/servicios' },
            ].map((item) => (
                <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-100 transition"
                >
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <FiChevronRight className="text-gray-400" size={20} />
                </a>
            ))}
            </div>
        </div>
        </div>
    </main>
  );
}
