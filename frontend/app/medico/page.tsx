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
            <div className="container mx-auto p-6 mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Mis Consultorios</h1>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {consultorios.map((consultorio) => (
                            <Link key={consultorio.id} href={`/medico/consultorio?id=${consultorio.id}`}>
                                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer">
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={consultorio.imagen || '/clinica1.jpeg'}
                                            alt={consultorio.nombre}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-t-xl"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{consultorio.nombre}</h2>
                                        <p className="text-gray-600 text-sm">{consultorio.descripcion}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}