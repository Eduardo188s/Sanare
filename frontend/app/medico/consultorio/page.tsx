'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NavbarMedico from '../Navbar';
import { FaStar, FaEdit } from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';

import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';
import { useAuth } from '@/context/AuthContext';

interface ConsultorioData {
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    imagen: string;
    medico_responsable: number;
    calificacion?: number;
}

interface Medico {
    id: number;
    nombre_completo: string;
}

export default function Consultorio() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading } = useAuth();

    const [consultorio, setConsultorio] = useState<ConsultorioData | null>(null);
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
    const [inicio, setInicio] = useState<Dayjs | null>(dayjs());
    const [fin, setFin] = useState<Dayjs | null>(dayjs().add(1, 'hour'));
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const consultorioId = searchParams.get('id');
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    useEffect(() => {
        if (!loading && (!user || !user.is_medico)) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            if (!consultorioId || !accessToken) {
                setMessage('Missing authentication data or clinic ID.');
                setIsLoading(false);
                return;
            }

            try {
                const consultorioResponse = await axios.get(`http://127.0.0.1:8000/api/clinicas/${consultorioId}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setConsultorio(consultorioResponse.data);
                setSelectedDoctor(consultorioResponse.data.medico_responsable);

                const medicosResponse = await axios.get('http://127.0.0.1:8000/api/medicos/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setMedicos(medicosResponse.data);
            } catch (error) {
                console.error('Error loading data:', error);
                setMessage('Error loading clinic data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [consultorioId, user, loading, router, accessToken]);

    const handleGuardarHorario = async () => {
        if (!inicio || !fin || !selectedDoctor) {
            setMessage('Please select a doctor and a valid time range.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        const horarioData = {
            medico: selectedDoctor,
            clinica: consultorioId,
            hora_inicio: inicio.format('YYYY-MM-DDTHH:mm:ssZ'),
            hora_fin: fin.format('YYYY-MM-DDTHH:mm:ssZ'),
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/horarios/', horarioData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.status === 201) {
                setMessage('✅ Schedule successfully registered.');
            } else {
                setMessage('❌ Error registering schedule. Please try again.');
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            setMessage('❌ Connection error or invalid data when saving the schedule.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!consultorio) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Clinic not found.</div>;
    }

    const stars = [...Array(5)].map((_, i) => (
        <FaStar key={i} color={i < (consultorio.calificacion || 0) ? '#FBBF24' : '#E5E7EB'} />
    ));

    return (
        <>
            <NavbarMedico />
            <div className="p-8 mt-20 bg-white text-gray-800 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <Image
                            src={consultorio.imagen || '/clinica1.jpeg'}
                            alt="Clinica"
                            width={600}
                            height={400}
                            className="rounded-lg shadow object-cover"
                        />
                        <div className="mt-4">
                            <p className="font-semibold text-lg">Calificación</p>
                            <div className="flex items-center gap-1">
                                {stars}
                                <span className="ml-2 text-sm text-gray-500">
                                    {consultorio.calificacion || 0}
                                </span>
                            </div>
                            <p className="text-sm mt-2 text-gray-500">
                                {consultorio.descripcion}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">6 Julio 2025</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="descripcion" className="text-sm font-semibold">
                                    Descripción:
                                </label>
                                <button
                                    type="button"
                                    className="flex items-center text-blue-600 text-sm hover:underline"
                                    onClick={() => router.push(`/medico/editar?id=${consultorioId}`)}
                                >
                                    <FaEdit className="mr-1" />
                                    Editar
                                </button>
                            </div>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows={3}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Escribe una breve descripción del consultorio..."
                                defaultValue={consultorio.descripcion}
                                disabled
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
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Ciudad, Estado"
                                defaultValue={consultorio.ubicacion}
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Doctor responsable:</label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedDoctor || ''}
                                onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                                disabled
                            >
                                {medicos.map(medico => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.nombre_completo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <DateTimePicker
                                    label="Inicio de atención"
                                    value={inicio}
                                    onChange={(newValue) => setInicio(newValue)}
                                    slotProps={{
                                        textField: { fullWidth: true, helperText: null },
                                    }}
                                />
                                <DateTimePicker
                                    label="Fin de atención"
                                    value={fin}
                                    onChange={(newValue) => setFin(newValue)}
                                    slotProps={{
                                        textField: { fullWidth: true, helperText: null },
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>

                        {message && (
                            <div className={`p-3 rounded-lg text-center ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                            onClick={handleGuardarHorario}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Horario'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
