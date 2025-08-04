"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Error desconocido al iniciar sesión.');
      console.error('Login failed in component:', err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo con el logo */}
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <Image
            src="/logo_sanare.jpg"
            alt="Logo Sanare"
            width={600}
            height={600}
            className="rounded-lg max-w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Lado derecho con formulario */}
      <div className="w-1/2 bg-[#6381A8] p-8 flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center text-center p-12 text-white shadow-2xl">
          <h1 className="text-5xl font-light mb-8">Bienvenido</h1>

          <div className="bg-white rounded-lg p-8 w-full max-w-md text-black">
            <h2 className="text-2xl font-semibold mb-6 text-center">Inicia Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Correo Electrónico o Usuario"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#6381A8] text-white py-2 px-4 rounded hover:bg-[#4f6a8f] transition duration-200"
                disabled={loading}
              >
                {loading ? 'Iniciando...' : 'Iniciar'}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-[#6381A8] font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
