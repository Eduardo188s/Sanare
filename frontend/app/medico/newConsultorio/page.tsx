'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NavbarMedico from '../Navbar';
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

type FormData = {
    nombre: string;
    descripcion: string;
    ubicacion: string;
    hora_apertura: string;
    hora_cierre: string;
    imagen?: File | null;
};

export default function NewConsultorioPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        hora_apertura: '08:00',
        hora_cierre: '17:00',
        imagen: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imagenPreview, setImagenPreview] = useState<string>('/clinica1.jpeg');

    useEffect(() => {
        if (!loading && (!user || !user.is_medico)) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, imagen: file }));
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setImagenPreview(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!user) {
            setError('Usuario no autenticado.');
            setIsSubmitting(false);
            return;
        }

        if (!formData.nombre || !formData.descripcion || !formData.ubicacion || !formData.hora_apertura || !formData.hora_cierre) {
            setError('Por favor, rellena todos los campos del formulario.');
            setIsSubmitting(false);
            return;
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setError('No se encontró el token de autenticación.');
            setIsSubmitting(false);
            router.push('/login');
            return;
        }

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('descripcion', formData.descripcion);
        data.append('ubicacion', formData.ubicacion);
        data.append('hora_apertura', formData.hora_apertura);
        data.append('hora_cierre', formData.hora_cierre);
        data.append('medico_responsable', user.id.toString());
        if (formData.imagen) {
            data.append('imagen', formData.imagen);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/clinicas/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status === 201) {
                router.push('/medico');
            } else {
                setError('Error al crear el consultorio.');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    setError('Acceso no autorizado.');
                    router.push('/login');
                } else {
                    setError(`Error del servidor: ${JSON.stringify(error.response.data)}`);
                }
            } else {
                setError('Error de conexión o datos inválidos.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !user || !user.is_medico) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
        <main className="min-h-screen bg-white">
            <NavbarMedico />
            <section>
                <div className="p-8 mt-10 bg-white text-gray-800 max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-center">Agregar Nuevo Consultorio</h1>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            <div className="relative flex flex-col items-center">
                                <Image
                                    src={imagenPreview}
                                    alt="Portada Consultorio"
                                    width={600}
                                    height={400}
                                    className="rounded-lg shadow object-cover"
                                />
                                <label className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-md cursor-pointer hover:bg-gray-100 transition">
                                    <FaCamera className="text-gray-700 text-lg" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1" htmlFor="nombre">
                                        Nombre de la clínica:
                                    </label>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1" htmlFor="descripcion">
                                        Descripción:
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        rows={3}
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1" htmlFor="ubicacion">
                                        Ubicación:
                                    </label>
                                    <input
                                        id="ubicacion"
                                        name="ubicacion"
                                        type="text"
                                        value={formData.ubicacion}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Médico responsable:</label>
                                    <p className="text-gray-700 font-semibold">
                                        {user?.username}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="hora_apertura" className="block text-sm font-medium text-gray-700">Hora de Apertura</label>
                                        <input
                                            type="time"
                                            id="hora_apertura"
                                            name="hora_apertura"
                                            value={formData.hora_apertura}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="hora_cierre" className="block text-sm font-medium text-gray-700">Hora de Cierre</label>
                                        <input
                                            type="time"
                                            id="hora_cierre"
                                            name="hora_cierre"
                                            value={formData.hora_cierre}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-2 px-6 rounded-lg shadow-lg text-sm font-medium text-white transition
                                        ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar consultorio'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}
