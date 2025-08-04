"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
    const [userType, setUserType] = useState<'medico' | 'paciente'>('paciente');
    const [medicoForm, setMedicoForm] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        healthArea: '',
        clinic: '',
        age: '',
        number: '',
        city: '',
        postal: '',
        email: '',
        phone: '',
    });
    const [pacienteForm, setPacienteForm] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        age: '',
        number: '',
        city: '',
        postal: '',
        email: '',
        phone: '',
    });
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleMedicoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMedicoForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePacienteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                body: JSON.stringify(medicoForm),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Registro de médico exitoso.');
                setMedicoForm({
                    firstName: '',
                    lastName: '',
                    gender: '',
                    healthArea: '',
                    clinic: '',
                    age: '',
                    number: '',
                    city: '',
                    postal: '',
                    email: '',
                    phone: '',
                });
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
                body: JSON.stringify(pacienteForm),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Registro de paciente exitoso.');
                setPacienteForm({
                    firstName: '',
                    lastName: '',
                    gender: '',
                    age: '',
                    number: '',
                    city: '',
                    postal: '',
                    email: '',
                    phone: '',
                });
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
            <div className={`w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out ${userType === 'medico' ? 'bg-white text-black' : 'bg-[#6381A8] text-white'}`}>
                {userType === 'medico' ? (
                    <form onSubmit={handleMedicoSubmit} className="w-full max-w-2xl bg-white p-6 space-y-8">
                        <h2 className="text-5xl font-bold text-center">Médico</h2>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="gender" value="F" className="accent-blue-500" onChange={handleMedicoChange} checked={medicoForm.gender === 'F'} />
                                <span className="text-sm">F.</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="gender" value="M" className="accent-blue-500" onChange={handleMedicoChange} checked={medicoForm.gender === 'M'} />
                                <span className="text-sm">M.</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4 rounded px-4 py-2 ">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Nombre"
                                value={medicoForm.firstName}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Apellido"
                                value={medicoForm.lastName}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 px-4 py-2">
                            <select
                                name="healthArea"
                                value={medicoForm.healthArea}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option>Área de salud</option>
                                <option>Cirujano</option>
                            </select>
                            <select
                                name="clinic"
                                value={medicoForm.clinic}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option>Clínica</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 px-4 py-2">
                            <input
                                type="text"
                                name="age"
                                placeholder="Edad"
                                value={medicoForm.age}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input
                                type="text"
                                name="number"
                                placeholder="No."
                                value={medicoForm.number}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 rounded px-4 py-2">
                            <input
                                type="text"
                                name="city"
                                placeholder="Ciudad"
                                value={medicoForm.city}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input
                                type="text"
                                name="postal"
                                placeholder="Postal"
                                value={medicoForm.postal}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 px-4 py-2">
                            <input
                                type="email"
                                name="email"
                                placeholder="E-Mail*"
                                value={medicoForm.email}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Telefono"
                                value={medicoForm.phone}
                                onChange={handleMedicoChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>

                        <div className="flex justify-center gap-6 pt-4">
                            <button type="button" onClick={() => setUserType('paciente')} className="px-8 py-2 rounded-full bg-blue-200 text-white hover:bg-blue-300">
                                Regresar
                            </button>
                            <button type="submit" disabled={loading} className="px-8 py-2 rounded-full bg-[#6381A8] text-white hover:bg-blue-300">
                                {loading ? 'Enviando...' : 'Siguiente'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePacienteSubmit} className="w-full max-w-2xl bg-[#6381A8] p-8 space-y-8">
                        <h2 className="text-5xl font-bold text-center text-white">Paciente</h2>

                        <div className="flex items-center gap-6 text-white font-bold">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="F"
                                    onChange={handlePacienteChange}
                                    checked={pacienteForm.gender === 'F'}
                                    className="accent-blue-500" />
                                <span className="text-sm">F.</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="M"
                                    onChange={handlePacienteChange}
                                    checked={pacienteForm.gender === 'M'}
                                    className="accent-blue-500" />
                                <span className="text-sm">M.</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-white px-4 py-2">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Nombre"
                                value={pacienteForm.firstName}
                                onChange={handlePacienteChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400 text-black" />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Apellido"
                                value={pacienteForm.lastName}
                                onChange={handlePacienteChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400 text-black" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-white px-4 py-2">
                            <input
                                type="text"
                                name="age"
                                placeholder="Edad"
                                value={pacienteForm.age}
                                onChange={handlePacienteChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400 text-black" />
                            <input
                                type="text"
                                name="number"
                                placeholder="No."
                                value={pacienteForm.number}
                                onChange={handlePacienteChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400 text-black" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-white px-4 py-2">
                            <input
                                type="text"
                                name="city"
                                placeholder="Ciudad"
                                value={pacienteForm.city}
                                onChange={handlePacienteChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400 text-black" />
                            <input
                                type="text"
                                name="postal"
                                placeholder="Postal"
                                value={pacienteForm.postal}
                                onChange={handlePacienteChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400 text-black" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-white px-4 py-2">
                            <input
                                type="email"
                                name="email"
                                placeholder="E-Mail*"
                                value={pacienteForm.email}
                                onChange={handlePacienteChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400 text-black" />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Telefono"
                                value={pacienteForm.phone}
                                onChange={handlePacienteChange}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white-400 text-black" />
                        </div>

                        <div className="flex justify-center gap-6 pt-4">
                            <button type="button" onClick={() => setUserType('medico')} className="px-8 py-2 rounded-full bg-blue-200 text-white hover:bg-blue-300">
                                Regresar
                            </button>
                            <button type="submit" disabled={loading} className="px-8 py-2 rounded-full bg-white text-black hover:bg-blue-300">
                                {loading ? 'Enviando...' : 'Siguiente'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className={`w-1/2 flex flex-col items-center justify-center p-12 transition-all duration-500 ease-in-out ${userType === 'medico' ? 'bg-[#6381A8] text-white' : 'bg-white text-black'}`}>
                <div className="text-center">
                    <Image
                        src="/logo_sanare.jpg"
                        alt="Logo Sanare"
                        width={112}
                        height={112}
                        className="object-cover w-full h-full mx-auto"
                    />
                </div>
                <h2 className="text-4xl font-light mb-8 text-center mt-8">Regístrate en Sanare</h2>

                {message && <p className="text-green-600 text-center mb-4">{message}</p>}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

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
                </div>
                <p className={`text-center text-sm mt-4 ${userType === 'medico' ? 'text-white' : 'text-gray-600'}`}>
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold">
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
