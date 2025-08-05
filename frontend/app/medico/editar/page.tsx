'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import axios from 'axios';
import Image from 'next/image';
import { CloudUpload, X } from 'lucide-react';
import NavbarMedico from '../Navbar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '@/context/AuthContext';


const CloudUploadIcon = (props: React.SVGProps<SVGSVGElement>) => <CloudUpload {...props} />;
const XIcon = (props: React.SVGProps<SVGSVGElement>) => <X {...props} />;

interface ConsultorioData {
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    imagen: string;
    codigo_postal: string;
    estado: string;
    medico_responsable?: Medico | number;
}

interface Medico {
    id: number;
    nombre_completo: string;
}

function FileUploadClínica({ onFileChange, currentImage }: { onFileChange: (file: File | null) => void; currentImage: string | null }) {
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileChange(file);
        } else {
            setFileName('');
            onFileChange(null);
        }
    };

    return (
        <div className="w-80 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white text-center text-black hover:border-blue-400 transition relative">
            <label className="flex flex-col items-center cursor-pointer w-full">
                {currentImage && !fileName && (
                    <Image src={currentImage} alt="Imagen actual" width={100} height={100} className="rounded-lg mb-2" />
                )}
                {!fileName && !currentImage && <CloudUploadIcon className="h-8 w-8 text-blue-600 mb-2" />}
                <span className="text-sm font-medium text-gray-700">Sube una nueva imagen o mantén la actual</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {fileName && (
                <div className="mt-2 text-sm text-gray-600 flex items-center justify-center">
                    <span>Archivo seleccionado: {fileName}</span>
                    <button onClick={() => { setFileName(''); onFileChange(null); }} className="ml-2 text-red-500 hover:text-red-700">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

function FileUploadMedico({ onFileChange }: { onFileChange: (file: File | null) => void }) {
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileChange(file);
        } else {
            setFileName('');
            onFileChange(null);
        }
    };

    return (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white text-center text-black hover:border-blue-400 transition">
            <label className="flex flex-col items-center cursor-pointer w-full">
                <CloudUploadIcon className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Foto de perfil del médico</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {fileName && (
                <div className="mt-2 text-sm text-gray-600 flex items-center justify-center">
                    <span>Archivo seleccionado: {fileName}</span>
                    <button onClick={() => { setFileName(''); onFileChange(null); }} className="ml-2 text-red-500 hover:text-red-700">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function EditarConsultorio() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading } = useAuth();

    const [consultorio, setConsultorio] = useState<ConsultorioData | null>(null);
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
    const [inicio, setInicio] = useState<Dayjs | null>(dayjs());
    const [fin, setFin] = useState<Dayjs | null>(dayjs().add(1, 'hour'));
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagen, setImagen] = useState<File | null>(null);
    const [mostrarFormularioMedico, setMostrarFormularioMedico] = useState(false);
    const [nuevoMedicoData, setNuevoMedicoData] = useState({
        nombre: '',
        apellido: '',
        genero: '',
        area_salud: '',
        edad: '',
        email: '',
        telefono: '',
        cedula: '',
        foto: null as File | null,
    });

    const consultorioId = searchParams.get('id');
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    useEffect(() => {
        if (!loading && (!user || !user.is_medico)) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            if (!consultorioId || !accessToken) {
                setMessage('Faltan datos de autenticación o ID del consultorio.');
                setIsLoading(false);
                return;
            }

            try {
                const consultorioResponse = await axios.get(`http://127.0.0.1:8000/api/clinicas/${consultorioId}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setConsultorio(consultorioResponse.data);

                if (consultorioResponse.data.medico_responsable) {
                    if (typeof consultorioResponse.data.medico_responsable === 'object' && consultorioResponse.data.medico_responsable !== null && 'id' in consultorioResponse.data.medico_responsable) {
                        setSelectedDoctor(consultorioResponse.data.medico_responsable.id);
                    } else {
                        setSelectedDoctor(Number(consultorioResponse.data.medico_responsable));
                    }
                }

                const medicosResponse = await axios.get('http://127.0.0.1:8000/api/medicos/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setMedicos(medicosResponse.data);

            } catch (error) {
                console.error('Error al cargar datos:', error);
                setMessage('Error al cargar los datos del consultorio. Intenta de nuevo.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [consultorioId, user, loading, router, accessToken]);


    const handleUpdateConsultorio = async () => {
        if (!consultorio) return;
        setIsSubmitting(true);
        setMessage('');

        const formData = new FormData();
        formData.append('nombre', consultorio.nombre);
        formData.append('descripcion', consultorio.descripcion);
        formData.append('ubicacion', consultorio.ubicacion);
        formData.append('codigo_postal', consultorio.codigo_postal);
        formData.append('estado', consultorio.estado);
        if (imagen) {
            formData.append('imagen', imagen);
        }
        
        if (selectedDoctor !== null) {
            formData.append('medico_responsable', selectedDoctor.toString());
        }

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/clinicas/${consultorioId}/`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setMessage('✅ Consultorio actualizado con éxito.');
                router.push(`/medico/consultorio?id=${consultorioId}`); // Redirigir a la página de visualización
            } else {
                setMessage('❌ Error al actualizar el consultorio.');
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            setMessage('❌ Error de conexión o datos inválidos al actualizar.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRegisterMedico = async () => {
        setIsSubmitting(true);
        setMessage('');

        const formData = new FormData();
        formData.append('nombre', nuevoMedicoData.nombre);
        formData.append('apellido', nuevoMedicoData.apellido);
        formData.append('genero', nuevoMedicoData.genero);
        formData.append('area_salud', nuevoMedicoData.area_salud);
        formData.append('edad', nuevoMedicoData.edad);
        formData.append('email', nuevoMedicoData.email);
        formData.append('telefono', nuevoMedicoData.telefono);
        formData.append('cedula_profesional', nuevoMedicoData.cedula);
        if (nuevoMedicoData.foto) {
            formData.append('foto_perfil', nuevoMedicoData.foto);
        }
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/medicos/', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                setMessage('✅ Nuevo médico registrado con éxito.');
                setMostrarFormularioMedico(false);
                const medicosResponse = await axios.get('http://127.0.0.1:8000/api/medicos/', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setMedicos(medicosResponse.data);
            } else {
                setMessage('❌ Error al registrar el nuevo médico.');
            }
        } catch (error) {
            console.error('Error al registrar médico:', error);
            setMessage('❌ Error de conexión o datos inválidos al registrar el médico.');
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!consultorio) return;
        const { name, value } = e.target;
        setConsultorio({ ...consultorio, [name]: value });
    };


    const handleMedicoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNuevoMedicoData({ ...nuevoMedicoData, [name]: value });
    };

    if (isLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }
    
    if (!consultorio) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Consultorio no encontrado.</div>;
    }
    
    return (
        <>
            <NavbarMedico />

            <div className="p-8 max-w-6xl mx-auto mt-20">
                <div className="flex flex-col md:flex-row gap-8">

                    <div>
                        <FileUploadClínica onFileChange={setImagen} currentImage={consultorio.imagen} />
                        <p className="mt-4 text-center text-sm text-gray-700 font-medium">Calificación</p>
                    </div>

                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-semibold">Editar Consultorio</h2>

                        <input
                            type="text"
                            placeholder="Nombre"
                            name="nombre"
                            value={consultorio.nombre}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <textarea
                            placeholder="Descripción"
                            name="descripcion"
                            value={consultorio.descripcion}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded h-20"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Ubicación"
                                name="ubicacion"
                                value={consultorio.ubicacion}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Código postal"
                                name="codigo_postal"
                                value={consultorio.codigo_postal}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Estado"
                                name="estado"
                                value={consultorio.estado}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                            <select
                                className="p-2 border rounded"
                                value={selectedDoctor || ''}
                                onChange={(e) => setSelectedDoctor(Number(e.target.value))}
                            >
                                <option value="" disabled>Selecciona un doctor</option>
                                {medicos.map(medico => (
                                    <option key={medico.id} value={medico.id}>
                                        {medico.nombre_completo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <DateTimePicker
                                        label="Inicio de atención"
                                        value={inicio}
                                        onChange={setInicio}
                                    />
                                    <DateTimePicker
                                        label="Fin de atención"
                                        value={fin}
                                        onChange={setFin}
                                    />
                                </Box>
                            </LocalizationProvider>
                        </div>
                        
                        
                        {message && (
                            <div className={`p-3 rounded-lg text-center ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleUpdateConsultorio}
                                className={`bg-[#6381A8] hover:bg-[#4e6a8f] text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button
                                className="bg-[#6381A8] hover:bg-[#4e6a8f] text-white px-4 py-2 rounded"
                                onClick={() => setMostrarFormularioMedico(true)}
                            >
                                Agregar Médico
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
            {mostrarFormularioMedico && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="w-full max-w-2xl bg-white text-black p-8 rounded-lg relative shadow-lg">
                        <button
                            onClick={() => setMostrarFormularioMedico(false)}
                            className="absolute top-4 right-4 text-black hover:text-gray-600"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-[#6381A8]">
                            Agrega un Nuevo Médico a tu Consultorio
                        </h2>

                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="genero"
                                    value="F"
                                    checked={nuevoMedicoData.genero === 'F'}
                                    onChange={handleMedicoInputChange}
                                    className="mr-1"
                                /> F
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="genero"
                                    value="M"
                                    checked={nuevoMedicoData.genero === 'M'}
                                    onChange={handleMedicoInputChange}
                                    className="mr-1"
                                /> M
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="nombre"
                                value={nuevoMedicoData.nombre}
                                onChange={handleMedicoInputChange}
                                className="p-2 rounded border"
                            />
                            <input
                                type="text"
                                placeholder="Apellido"
                                name="apellido"
                                value={nuevoMedicoData.apellido}
                                onChange={handleMedicoInputChange}
                                className="p-2 rounded border"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                             <select
                                name="area_salud"
                                value={nuevoMedicoData.area_salud}
                                onChange={handleMedicoInputChange}
                                className="p-2 rounded border"
                            >
                                <option value="" disabled>Área de Salud</option>
                                <option value="Oftalmología">Oftalmología</option>
                                <option value="Cardiología">Cardiología</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Edad"
                                name="edad"
                                value={nuevoMedicoData.edad}
                                onChange={handleMedicoInputChange}
                                className="p-2 rounded border"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                type="email"
                                placeholder="E-Mail*"
                                name="email"
                                value={nuevoMedicoData.email}
                                onChange={handleMedicoInputChange}
                                className="p-2 rounded border"
                            />
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                name="telefono"
                                value={nuevoMedicoData.telefono}
                                onChange={handleMedicoInputChange}
                                className="p-2 rounded border"
                            />
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Validar Cédula Profesional"
                                name="cedula"
                                value={nuevoMedicoData.cedula}
                                onChange={handleMedicoInputChange}
                                className="p-2 rounded-l w-full border"
                            />
                            <button className="bg-[#6381A8] text-white px-4 py-2 rounded-r font-semibold">
                                Validar
                            </button>
                        </div>

                        <FileUploadMedico onFileChange={(file) => setNuevoMedicoData({ ...nuevoMedicoData, foto: file })} />

                        <div className="flex justify-between mt-6">
                            <button
                                className={`bg-[#6381A8] text-white px-4 py-2 rounded font-semibold ${isSubmitting ? 'opacity-50' : ''}`}
                                onClick={handleRegisterMedico}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registrando...' : 'Registrar'}
                            </button>
                            <button
                                onClick={() => setMostrarFormularioMedico(false)}
                                className="text-[#6381A8] underline hover:text-[#4e6a8f]"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
