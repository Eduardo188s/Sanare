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
    });
    const [pacienteForm, setPacienteForm] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        firstName: '',
        lastName: '',
    });
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleMedicoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMedicoForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePacienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPacienteForm(prev => ({ ...prev, [name]: value }));
    };

    const handleMedicoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
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
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Registro de médico exitoso.');
                setMedicoForm({ username: '', email: '', password: '', password2: '', firstName: '', lastName: '' });
            } else {
                const errorMessages = Object.values(data).flat().join(' ');
                setError(errorMessages || 'Error en el registro del médico.');
            }
        } catch (err) {
            console.error('Error during medico registration:', err);
            setError('Error de conexión o del servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handlePacienteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
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
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Registro de paciente exitoso.');
                setPacienteForm({ username: '', email: '', password: '', password2: '', firstName: '', lastName: '' });
            } else {
                const errorMessages = Object.values(data).flat().join(' ');
                setError(errorMessages || 'Error en el registro del paciente.');
            }
        } catch (err) {
            console.error('Error during paciente registration:', err);
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
                                    placeholder="Tu Nombre"
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
