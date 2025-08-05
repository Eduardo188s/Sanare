'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NavbarMedico from './Navbar';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Consultorio {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    ubicacion: string;
    especialidad: string; 
    horarios: string; 
}

export default function MedicoDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && (!user || !user.is_medico)) {
            router.push('/login');
            return;
        }

        const fetchConsultorios = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setError('No se encontró el token de autenticación.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/clinicas/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setConsultorios(response.data);
            } catch (err) {
                console.error('Error al obtener los consultorios:', err);
                setError('Error al cargar la lista de consultorios. Por favor, intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.is_medico) {
            fetchConsultorios();
        }
    }, [user, loading, router]);

    const handleAddConsultorio = () => {
        router.push('/medico/newConsultorio');
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <p className="text-xl text-gray-700">Cargando...</p>
            </div>
        );
    }
    
    if (!user) {
      return null;
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <NavbarMedico />
            <section className="max-w-6xl mx-auto px-4 py-12 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Mis Consultorios</h1>
                    <button
                        onClick={handleAddConsultorio}
                        className="bg-green-600 text-white px-6 py-2 rounded-2xl shadow hover:bg-green-700 transition"
                    >
                        ➕ Agregar consultorio
                    </button>
                </div>
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                {consultorios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <p className="text-xl text-gray-500 mb-6">No tienes ningún consultorio registrado todavía.</p>
                        <button
                            onClick={handleAddConsultorio}
                            className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
                        >
                            Agregar consultorio
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {consultorios.map((consultorio) => (
                            <div key={consultorio.id} className="bg-blue-100 border border-blue-300 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-full md:w-1/2">
                                    <Image
                                        src={consultorio.imagen || '/clinica1.jpeg'}
                                        alt={consultorio.nombre}
                                        width={600}
                                        height={400}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 text-gray-800">
                                    <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">{consultorio.nombre}</h2>
                                    <p className="mb-4 text-center md:text-left text-blue-800">
                                        {consultorio.descripcion}
                                    </p>
                                    <ul className="space-y-2 text-sm">
                                        <li><span className="font-semibold text-blue-700">📋 Especializada en:</span> {consultorio.especialidad || 'No especificada'}</li>
                                        <li><span className="font-semibold text-blue-700">📍 Ubicada en:</span> {consultorio.ubicacion}</li>
                                        <li><span className="font-semibold text-blue-700">🕒 Horarios:</span> {consultorio.horarios || 'No especificados'}</li>
                                    </ul>
                                    <div className="flex justify-end gap-4 p-2 mt-12">
                                        <Link href={`/medico/consultorio?id=${consultorio.id}`} passHref>
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition">
                                                Editar consultorio
                                            </button>
                                        </Link>
                                        <button className="bg-red-600 text-white px-4 py-2 rounded-2xl hover:bg-red-700 transition">
                                            Eliminar consultorio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}