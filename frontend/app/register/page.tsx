'use client';

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
    const [userType, setUserType] = useState<'medico' | 'paciente'>('paciente');

    const [medicoForm, setMedicoForm] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        firstName: '',
        lastName: '',
        fecha_nacimiento: '',
        sexo: '',
        telefono: '',
        especialidad: ''
    });

    const [pacienteForm, setPacienteForm] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        firstName: '',
        lastName: '',
        fecha_nacimiento: '',
        sexo: '',
        telefono: ''
    });

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    const phoneRegex = /^[0-9]{8,15}$/;
    const minDate = "1900-01-01";
    const maxDate = new Date().toISOString().split("T")[0];

    const handleMedicoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "firstName" || name === "lastName") {
            newValue = newValue.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");
        }
        if (name === "telefono") {
            newValue = newValue.replace(/[^0-9]/g, "");
        }

        setMedicoForm(prev => ({ ...prev, [name]: newValue }));
    };

    const handlePacienteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "firstName" || name === "lastName") {
            newValue = newValue.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");
        }
        if (name === "telefono") {
            newValue = newValue.replace(/[^0-9]/g, "");
        }

        setPacienteForm(prev => ({ ...prev, [name]: newValue }));
    };

    const validatePacienteForm = (): boolean => {
        if (!nameRegex.test(pacienteForm.firstName)) {
            setError('El nombre solo debe contener letras y espacios.');
            return false;
        }
        if (!nameRegex.test(pacienteForm.lastName)) {
            setError('El apellido solo debe contener letras y espacios.');
            return false;
        }
        if (!phoneRegex.test(pacienteForm.telefono)) {
            setError('El teléfono debe contener entre 8 y 15 dígitos numéricos.');
            return false;
        }
        if (pacienteForm.fecha_nacimiento < minDate || pacienteForm.fecha_nacimiento > maxDate) {
            setError('La fecha de nacimiento no es válida.');
            return false;
        }
        return true;
    };

    const validateMedicoForm = (): boolean => {
        if (!nameRegex.test(medicoForm.firstName)) {
            setError('El nombre solo debe contener letras y espacios.');
            return false;
        }
        if (!nameRegex.test(medicoForm.lastName)) {
            setError('El apellido solo debe contener letras y espacios.');
            return false;
        }
        if (!phoneRegex.test(medicoForm.telefono)) {
            setError('El teléfono debe contener entre 8 y 15 dígitos numéricos.');
            return false;
        }
        if (medicoForm.fecha_nacimiento < minDate || medicoForm.fecha_nacimiento > maxDate) {
            setError('La fecha de nacimiento no es válida.');
            return false;
        }
        return true;
    };

    const handlePacienteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!validatePacienteForm()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/auth/register/paciente/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: pacienteForm.username,
                    email: pacienteForm.email,
                    password: pacienteForm.password,
                    password2: pacienteForm.password2,
                    first_name: pacienteForm.firstName,
                    last_name: pacienteForm.lastName,
                    fecha_nacimiento: pacienteForm.fecha_nacimiento,
                    sexo: pacienteForm.sexo,
                    telefono: pacienteForm.telefono
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Registro de paciente exitoso.');
                setPacienteForm({
                    username: '', email: '', password: '', password2: '',
                    firstName: '', lastName: '', fecha_nacimiento: '', sexo: '', telefono: ''
                });
            } else {
                const errorMessages = Object.values(data).flat().join(' ');
                setError(errorMessages || 'Error en el registro del paciente.');
            }
        } catch (err) {
            console.error('Error durante registro de paciente:', err);
            setError('Error de conexión o del servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleMedicoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!validateMedicoForm()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/auth/register/medico/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: medicoForm.username,
                    email: medicoForm.email,
                    password: medicoForm.password,
                    password2: medicoForm.password2,
                    first_name: medicoForm.firstName,
                    last_name: medicoForm.lastName,
                    fecha_nacimiento: medicoForm.fecha_nacimiento,
                    sexo: medicoForm.sexo,
                    telefono: medicoForm.telefono,
                    especialidad: medicoForm.especialidad
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Registro de médico exitoso.');
                setMedicoForm({
                    username: '', email: '', password: '', password2: '',
                    firstName: '', lastName: '', fecha_nacimiento: '', sexo: '', telefono: '', especialidad: ''
                });
            } else {
                const errorMessages = Object.values(data).flat().join(' ');
                setError(errorMessages || 'Error en el registro del médico.');
            }
        } catch (err) {
            console.error('Error durante registro del médico:', err);
            setError('Error de conexión o del servidor.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen">
            {/* Contenedor de la izquierda (Logo) */}
            <div className={`w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out ${userType === 'medico' ? 'bg-white text-black' : 'bg-[#6381A8] text-white'}`}>
                <div className="text-center">
                    <Image
                        src="/logo_sanare.jpg"
                        alt="Logo Sanare"
                        width={112}
                        height={112}
                        className="object-cover w-full h-full mx-auto"
                    />
                </div>
            </div>

            {/* Contenedor de la derecha (Formularios y Selector de Tipo) */}
            <div className={`w-1/2 flex flex-col items-center justify-center p-12 shadow-xl transition-all duration-500 ease-in-out ${userType === 'medico' ? 'bg-[#6381A8] text-white' : 'bg-white text-black'}`}>
                <h2 className="text-4xl font-light mb-8 text-center mt-8">Regístrate en Sanare</h2>

                <div className="bg-white rounded-lg p-8 w-full max-w-md text-black shadow-lg">
                    <h3 className="text-2xl font-semibold mb-6 text-center">Crear una Cuenta</h3>

                    <div className="flex justify-center mb-6">
                        <button
                            onClick={() => setUserType('paciente')}
                            className={`px-4 py-2 rounded-l-lg ${userType === 'paciente' ? 'bg-[#6381A8] text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            Soy Paciente
                        </button>
                        <button
                            onClick={() => setUserType('medico')}
                            className={`px-4 py-2 rounded-r-lg ${userType === 'medico' ? 'bg-[#6381A8] text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            Soy Médico
                        </button>
                    </div>

                    {message && <p className="text-green-600 text-center mb-4">{message}</p>}
                    {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                    {userType === 'paciente' ? (
                        <form onSubmit={handlePacienteSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="pacienteUsername" className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre de Usuario
                                </label>
                                <input
                                    type="text"
                                    id="pacienteUsername"
                                    name="username"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nombre de Usuario"
                                    value={pacienteForm.username}
                                    onChange={handlePacienteChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="pacienteEmail" className="block text-gray-700 text-sm font-bold mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="pacienteEmail"
                                    name="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="tu@ejemplo.com"
                                    value={pacienteForm.email}
                                    onChange={handlePacienteChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="pacienteFirstName" className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="pacienteFirstName"
                                    name="firstName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nombre"
                                    value={pacienteForm.firstName}
                                    onChange={handlePacienteChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="pacienteLastName" className="block text-gray-700 text-sm font-bold mb-2">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    id="pacienteLastName"
                                    name="lastName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Tu Apellido"
                                    value={pacienteForm.lastName}
                                    onChange={handlePacienteChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="pacienteFechaNacimiento" className="block text-gray-700 text-sm font-bold mb-2">
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    type="date"
                                    id="pacienteFechaNacimiento"
                                    name="fecha_nacimiento"
                                    min="1900-01-01" 
                                    max={new Date().toISOString().split('T')[0]}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={pacienteForm.fecha_nacimiento}
                                    onChange={handlePacienteChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="pacienteSexo" className="block text-gray-700 text-sm font-bold mb-2">
                                    Sexo
                                </label>
                                <select
                                    id="pacienteSexo"
                                    name="sexo"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={pacienteForm.sexo}
                                    onChange={handlePacienteChange}
                                    required
                                >
                                    <option value="">Selecciona</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="O">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="pacienteTelefono" className="block text-gray-700 text-sm font-bold mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    id="pacienteTelefono"
                                    name="telefono"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="+52 555 123 4567"
                                    value={pacienteForm.telefono}
                                    onChange={handlePacienteChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="pacientePassword" className="block text-gray-700 text-sm font-bold mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="pacientePassword"
                                    name="password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="********"
                                    value={pacienteForm.password}
                                    onChange={handlePacienteChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="pacientePassword2" className="block text-gray-700 text-sm font-bold mb-2">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="pacientePassword2"
                                    name="password2"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="********"
                                    value={pacienteForm.password2}
                                    onChange={handlePacienteChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline transition duration-200"
                                disabled={loading}
                            >
                                {loading ? 'Registrando...' : 'Registrar Paciente'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleMedicoSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="medicoUsername" className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre de Usuario
                                </label>
                                <input
                                    type="text"
                                    id="medicoUsername"
                                    name="username"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nombre de Usuario"
                                    value={medicoForm.username}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="medicoEmail" className="block text-gray-700 text-sm font-bold mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="medicoEmail"
                                    name="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="tu@ejemplo.com"
                                    value={medicoForm.email}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="medicoFirstName" className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="medicoFirstName"
                                    name="firstName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Tu Nombre"
                                    value={medicoForm.firstName}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="medicoLastName" className="block text-gray-700 text-sm font-bold mb-2">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    id="medicoLastName"
                                    name="lastName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Tu Apellido"
                                    value={medicoForm.lastName}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="medicoFechaNacimiento" className="block text-gray-700 text-sm font-bold mb-2">
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    type="date"
                                    id="medicoFechaNacimiento"
                                    name="fecha_nacimiento"
                                    min="1900-01-01"
                                    max={new Date().toISOString().split('T')[0]}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={medicoForm.fecha_nacimiento}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="medicoSexo" className="block text-gray-700 text-sm font-bold mb-2">
                                    Sexo
                                </label>
                                <select
                                    id="medicoSexo"
                                    name="sexo"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={medicoForm.sexo}
                                    onChange={handleMedicoChange}
                                    required
                                >       
                                    <option value="">Selecciona</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="O">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="medicoTelefono" className="block text-gray-700 text-sm font-bold mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    id="medicoTelefono"
                                    name="telefono"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="+52 555 123 4567"
                                    value={medicoForm.telefono}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="medicoEspecialidad" className="block text-gray-700 text-sm font-bold mb-2">
                                    Especialidad
                                </label>
                                <input
                                    type="text"
                                    id="medicoEspecialidad"
                                    name="especialidad"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Ej: Cardiología"
                                    value={medicoForm.especialidad}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="medicoPassword" className="block text-gray-700 text-sm font-bold mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="medicoPassword"
                                    name="password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="********"
                                    value={medicoForm.password}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="medicoPassword2" className="block text-gray-700 text-sm font-bold mb-2">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="medicoPassword2"
                                    name="password2"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="********"
                                    value={medicoForm.password2}
                                    onChange={handleMedicoChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline transition duration-200"
                                disabled={loading}
                            >
                                {loading ? 'Registrando...' : 'Registrar Médico'}
                            </button>
                        </form>
                    )}
                    <p className={`text-center text-sm mt-4 ${userType === 'medico' ? 'text-white' : 'text-gray-600'}`}>
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
