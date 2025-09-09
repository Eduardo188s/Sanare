'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import NavbarMedico from '../Navbar';
import { FaUser, FaBuilding, FaCalendarAlt, FaClock, FaBell } from 'react-icons/fa';

type Notificacion = {
  id: number;
  mensaje: string;
  fecha_creacion: string;
  paciente_nombre?: string;
  clinica_nombre?: string;
  fecha_cita?: string;
  hora_cita?: string;
  leida?: boolean;
};

export default function NotificacionesPage() {
  const { accessToken, refreshAccessToken, user, loading } = useAuth();
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let token = accessToken;

    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
        router.push('/login');
        throw new Error('Sesión expirada');
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) {
        alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
        router.push('/login');
        throw new Error('Sesión expirada');
      }

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return response;
  };

  useEffect(() => {
    if (loading || !user) return;

    const obtenerNotificaciones = async () => {
      try {
        const res = await fetchWithAuth('http://127.0.0.1:8000/api/notificaciones/my/');
        if (!res.ok) throw new Error('Error al obtener las notificaciones');

        const data = await res.json();
        setNotificaciones(data);

      } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las notificaciones');
      }
    };

    obtenerNotificaciones();
  }, [loading, accessToken, refreshAccessToken, user]);

  const marcarComoLeida = async (id: number) => {
    try {
    await fetchWithAuth(`http://127.0.0.1:8000/api/notificaciones/${id}/leer/`, {
      method: 'PATCH',
    });

    setNotificaciones(prev =>
      prev.map(n => (n.id === id ? { ...n, leida: true } : n))
    );
  } catch (error) {
    console.error("Error al marcar como leída:", error);
  }
};

  return (
    <main className="min-h-screen bg-gray-100">
      <NavbarMedico/>
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Mis notificaciones</h2>
        {notificaciones.length === 0 ? (
          <p className="text-gray-600">No tienes notificaciones.</p>
        ) : (
          <ul className="space-y-4">
            {notificaciones.map(notif => {
              const pacienteNombre = notif.paciente_nombre || 'Desconocido';
              const clinicaNombre = notif.clinica_nombre || 'Desconocida';
              const fecha = notif.fecha_cita || 'Sin fecha';
              const hora = notif.hora_cita || 'Sin hora';

              return (
                <li
                  key={notif.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  onClick={() => marcarComoLeida(notif.id)}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-700 font-medium flex items-center gap-2">
                      <FaBell className="text-blue-500" /> {notif.mensaje}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaUser className="text-blue-500" /> {pacienteNombre}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaBuilding className="text-blue-500" /> {clinicaNombre}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaCalendarAlt className="text-blue-500" /> {fecha}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <FaClock className="text-blue-500" /> {hora}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notif.fecha_creacion).toLocaleString()}
                    </p>
                  </div>
                  {!notif.leida && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                      Nuevo
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}