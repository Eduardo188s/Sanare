'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import NavbarMedico from '../../Navbar';
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

const DIAS_SEMANA = [
    { id: 0, nombre: 'Lunes' },
    { id: 1, nombre: 'Martes' },
    { id: 2, nombre: 'Miércoles' },
    { id: 3, nombre: 'Jueves' },
    { id: 4, nombre: 'Viernes' },
    { id: 5, nombre: 'Sábado' },
    { id: 6, nombre: 'Domingo' },
];

export default function EditConsultorioPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        hora_apertura: '08:00',
        hora_cierre: '17:00',
        imagen: null,
    });
    const [diasHabiles, setDiasHabiles] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imagenPreview, setImagenPreview] = useState<string>('/clinica1.jpeg');
    const [consultorioId, setConsultorioId] = useState<number | null>(null);

    useEffect(() => {
        if (!loading && (!user || !user.is_medico)) {
            router.push('/login');
        }

        const fetchConsultorio = async () => {
            if (user?.is_medico) {
                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await axios.get('https://sanarebackend-production.up.railway.app/api/clinicas/', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    const misClinicas = response.data.filter((c: any) => c.medico_responsable?.id === user.id);
                    if (misClinicas.length > 0) {
                        const consultorio = misClinicas[0];
                        setConsultorioId(consultorio.id);
                        setFormData({
                            nombre: consultorio.nombre || '',
                            descripcion: consultorio.descripcion || '',
                            ubicacion: consultorio.ubicacion || '',
                            hora_apertura: consultorio.hora_apertura || '08:00',
                            hora_cierre: consultorio.hora_cierre || '17:00',
                            imagen: null,
                        });

                        setDiasHabiles(consultorio.dias_habiles || []);

                        const imagenURL = consultorio.imagen ? `https://sanarebackend-production.up.railway.app${consultorio.imagen}` : '/clinica1.jpeg';
                        try {
                            new URL(imagenURL);
                            setImagenPreview(imagenURL);
                        } catch {
                            setImagenPreview('/clinica1.jpeg');
                        }
                    }
                } catch (err) {
                    setImagenPreview('/clinica1.jpeg');
                }
            }
        };

        fetchConsultorio();
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
                if (reader.result) setImagenPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDiaChange = (diaId: number) => {
        setDiasHabiles(prev =>
            prev.includes(diaId) ? prev.filter(d => d !== diaId) : [...prev, diaId]
        );
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

        if (!consultorioId) {
            setError('No se encontró consultorio para editar.');
            setIsSubmitting(false);
            return;
        }

        if (diasHabiles.length === 0) {
            setError('Selecciona al menos un día hábil.');
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
        diasHabiles.forEach(dia => data.append('dias_habiles', dia.toString()));
        if (formData.imagen) data.append('imagen', formData.imagen);

        try {
            const response = await axios.put(`https://sanarebackend-production.up.railway.app/api/clinicas/${consultorioId}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) router.push('/medico');
            else setError('Error al actualizar el consultorio.');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    setError('Acceso no autorizado.');
                    router.push('/login');
                } else {
                    setError(`Error del servidor: ${JSON.stringify(error.response.data)}`);
                }
            } else setError('Error de conexión o datos inválidos.');
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
            <section className="w-full">
                <div className="p-4 sm:p-6 md:p-8 mt-4 sm:mt-6 md:mt-10 bg-white text-gray-800 max-w-6xl mx-auto">
                    {/* Botón de volver */}
                    <div className="mb-4 sm:mb-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#6381A8] border border-gray-200 rounded-full shadow-sm 
                                      hover:bg-[#4f6a8f] hover:text-white hover:shadow-md transition-all duration-200 
                                      text-white font-medium text-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver
                        </button>
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Editar Consultorio</h1>

                    {error && <p className="text-red-500 text-center mb-4 text-sm sm:text-base px-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8 md:mt-12">
                            {/* Imagen del consultorio */}
                            <div className="relative flex flex-col items-center w-full">
                                <div className="relative w-full max-w-md lg:max-w-full aspect-[3/2]">
                                    <Image
                                        src={imagenPreview || '/clinica1.jpeg'}
                                        alt="Portada Consultorio"
                                        fill
                                        className="rounded-lg shadow object-cover"
                                    />
                                    <label className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white rounded-full p-2 sm:p-3 shadow-md cursor-pointer hover:bg-gray-100 transition">
                                        <FaCamera className="text-gray-700 text-base sm:text-lg" />
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Formulario */}
                            <div className="space-y-4 w-full">
                                <div>
                                    <label className="block text-sm font-semibold mb-1" htmlFor="nombre">Nombre del consultorio:</label>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1" htmlFor="descripcion">Descripción:</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        rows={3}
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1" htmlFor="ubicacion">Ubicación:</label>
                                    <input
                                        id="ubicacion"
                                        name="ubicacion"
                                        type="text"
                                        value={formData.ubicacion}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>

                                <div className="block">
                                    <label className="block text-sm font-medium mb-2">Días hábiles:</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
                                        {DIAS_SEMANA.map(d => (
                                            <label key={d.id} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={diasHabiles.includes(d.id)}
                                                    onChange={() => handleDiaChange(d.id)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="truncate">{d.nombre}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Médico responsable:</label>
                                    <p className="text-gray-700 font-semibold text-sm sm:text-base">{user?.username}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/2">
                                        <label htmlFor="hora_apertura" className="block text-sm font-medium text-gray-700 mb-1">Hora de Apertura</label>
                                        <input
                                            type="time"
                                            id="hora_apertura"
                                            name="hora_apertura"
                                            value={formData.hora_apertura}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <label htmlFor="hora_cierre" className="block text-sm font-medium text-gray-700 mb-1">Hora de Cierre</label>
                                        <input
                                            type="time"
                                            id="hora_cierre"
                                            name="hora_cierre"
                                            value={formData.hora_cierre}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-2 sm:p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-2 sm:py-3 px-6 rounded-3xl shadow-lg text-sm sm:text-base font-medium text-white transition
                                        ${isSubmitting ? 'bg-[#6381A8] cursor-not-allowed' : 'bg-[#6381A8] hover:bg-[#4f6a8f]'}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}