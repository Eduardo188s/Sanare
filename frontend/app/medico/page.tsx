'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NavbarMedico from './Navbar';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

type Medico = {
  id: number;
  full_name: string;
  especialidad_nombre: string | null;
};

interface Clinica {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  ubicacion: string;
  especialidad: string;
  hora_apertura: string;
  hora_cierre: string;
  medico_responsable: Medico | null;
  calificacion?: number;
  reseñas?: number;
  ultima_actualizacion?: string;
}

export default function MedicoDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [consultorios, setConsultorios] = useState<Clinica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hayNuevas, setHayNuevas] = useState(false);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/notificaciones/my/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const nuevas = res.data.some((n: any) => !n.leida);
        setHayNuevas(nuevas);
      } catch (err) {
        //console.error('Error al cargar notificaciones:', err);
      }
    };

    if (user?.is_medico) {
      fetchNotificaciones();
      const interval = setInterval(fetchNotificaciones, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

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
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const datos = response.data.map((c: Clinica, index: number) => ({
          ...c,
          calificacion: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)),
          reseñas: Math.floor(Math.random() * (150 - 10) + 10),
          ultima_actualizacion: 'hace ' + (Math.floor(Math.random() * 7) + 1) + ' días',
        }));

        setConsultorios(datos);
      } catch (err) {
        //console.error('Error al obtener los consultorios:', err);
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

  if (!user) return null;

  const handleDeleteConsultorio = async (id: number) => {
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este consultorio?');
    if (!confirmDelete) return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('No se encontró el token de autenticación.');
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/clinicas/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setConsultorios((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      //console.error('Error al eliminar consultorio:', err);
      setError('No se pudo eliminar el consultorio. Intenta de nuevo.');
    }
  };

  const renderStars = (rating: number | undefined) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            <path fill="url(#half-star-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" transform="url(#half-star-clip)" />
            <defs>
              <linearGradient id="half-star-gradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
              <clipPath id="half-star-clip">
                <rect x="0" y="0" width="10" height="20" />
              </clipPath>
            </defs>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NavbarMedico hayNuevas={hayNuevas} />
      <section className="max-w-6xl mx-auto px-4 py-12 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mi Consultorio</h1>
          <button
            onClick={handleAddConsultorio}
            className="bg-[#6381A8] hover:bg-[#4f6a8f] text-white px-6 py-2 rounded-3xl shadow transition"
          >
            Agregar consultorio
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {consultorios.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-xl text-gray-500 mb-6">No tienes ningún consultorio registrado todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {consultorios.map((consultorio) => (
              <div
                key={consultorio.id}
                className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
              >
                {/* Imagen */}
                <div className="w-full md:w-[400px] flex-shrink-0">
                  {consultorio.imagen ? (
                    <Image
                      src={consultorio.imagen}
                      alt={consultorio.nombre}
                      width={400}
                      height={300}
                      className="rounded-md object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
                      Sin imagen disponible
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{consultorio.nombre}</h2>
                    <p className="text-gray-500 text-sm mb-4">{consultorio.descripcion}</p>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-700 text-sm">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div>
                          <span className="font-semibold">Especialidad</span>
                          <p className="text-gray-400">{consultorio.medico_responsable?.especialidad_nombre || 'No especificada'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <div>
                          <span className="font-semibold">Ubicación</span>
                          <p className="text-gray-500">{consultorio.ubicacion}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                          <span className="font-semibold">Horarios</span>
                          <p className="text-gray-500">{consultorio.hora_apertura && consultorio.hora_cierre ? `${consultorio.hora_apertura} - ${consultorio.hora_cierre}` : 'No especificado'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {consultorio.calificacion && (
                          <>
                            {renderStars(consultorio.calificacion)}
                            <span className="font-medium text-gray-800">{consultorio.calificacion}</span>
                            {consultorio.reseñas && <span className="text-gray-600">({consultorio.reseñas} reseñas)</span>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500">{consultorio.ultima_actualizacion ? `Última actualización: ${consultorio.ultima_actualizacion}` : ''}</span>
                    <div className="flex space-x-3">
                      <Link href={`/medico/editarConsultorio/${consultorio.id}`} passHref>
                        <button className="bg-[#6381A8] hover:bg-[#4f6a8f] text-white px-5 py-2 rounded-3xl transition-colors duration-200 text-sm font-medium">
                          Editar consultorio
                        </button>
                      </Link>
                      <button onClick={() => handleDeleteConsultorio(consultorio.id)} className="bg-red-600 text-white px-5 py-2 rounded-3xl hover:bg-red-700 transition-colors duration-200 text-sm font-medium">
                        Eliminar consultorio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
