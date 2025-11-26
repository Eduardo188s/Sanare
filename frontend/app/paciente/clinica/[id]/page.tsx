'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import NavbarPaciente from '../../NavBar';
import { FaArrowLeft, FaStar } from 'react-icons/fa';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/Modal';
import { queueRequest } from '@/utils/offlineQueue';
import SideBarPaciente from '@/components/SideBarPaciente';

type Medico = {
  id: number;
  full_name: string;
  especialidad_nombre: string | null;
};

type Clinica = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  ubicacion: string;
  hora_apertura: string;
  hora_cierre: string;
  dias_habiles: number[];
  medico_responsable: Medico | null;
};

type Comentario = {
  id: number;
  nombre: string;
  rating: number;
  comentario: string;
};

async function fetchHorariosSafe(url: string) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { ok: false, offline: true, data: null };
  }

  try {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      console.error('Error HTTP al obtener horarios:', response.status, text);
      return { ok: false, error: response.status, data: null };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text().catch(() => null);
      console.error('Respuesta no JSON al pedir horarios:', text);
      return { ok: false, error: 'not_json', data: null };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    console.error('Error de red al obtener horarios:', err);
    return { ok: false, error: 'network_error', data: null };
  }
}

export default function ClinicaDetalle() {
  const router = useRouter();
  const params = useParams();
  const clinicaId = Number(params?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'warning'>('success');

  const [clinica, setClinica] = useState<Clinica | null>(null);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [rating, setRating] = useState<number | null>(5);
  const [hover, setHover] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [comentario, setComentario] = useState('');

  const [isOnline, setIsOnline] = useState<boolean>(true);

  const pacienteId =
    typeof window !== 'undefined' ? Number(localStorage.getItem('pacienteId')) : null;

  const { accessToken, refreshAccessToken } = useAuth();

  const [comentarios, setComentarios] = useState<Comentario[]>([
    { id: 1, nombre: 'Juan Pérez.', rating: 5, comentario: 'Excelente servicio' },
    { id: 2, nombre: 'María López.', rating: 4, comentario: 'Muy buena atención' },
    { id: 3, nombre: 'Carlos García.', rating: 5, comentario: 'Muy profesional' },
  ]);

  const [nombrePaciente, setNombrePaciente] = useState('Paciente Anónimo');

  useEffect(() => {
    const nombre = localStorage.getItem('nombrePaciente');
    if (nombre) setNombrePaciente(nombre);
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          console.log('Service worker listo', reg);
        })
        .catch((err) => console.warn('Service worker no listo:', err));
    }

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    if (!clinicaId) return;

    fetch(`http://127.0.0.1:8000/api/clinicas/${clinicaId}/`)
      .then((res) => res.json())
      .then((data) => setClinica(data))
      .catch((err) => console.error('Error al cargar la clínica:', err));
  }, [clinicaId]);

  const filtrarHorariosPorRango = (horas: string[], apertura: string, cierre: string): string[] => {
    const convertirAMinutos = (hora: string) => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };

    const aperturaMin = convertirAMinutos(apertura);
    const cierreMin = convertirAMinutos(cierre);

    return horas.filter((hora) => {
      const horaMin = convertirAMinutos(hora);
      return horaMin >= aperturaMin && horaMin < cierreMin;
    });
  };

  useEffect(() => {
    let mounted = true;
    async function loadHorarios() {
      if (!selectedDate || !clinica?.medico_responsable) return;

      const fecha = selectedDate.format('YYYY-MM-DD');
      const url = `http://127.0.0.1:8000/api/clinicas/${clinicaId}/horarios_disponibles/?fecha=${fecha}`;

      const result = await fetchHorariosSafe(url);

      if (!mounted) return;

      if (result.offline) {
        setHorarios([]);
        console.warn('Off-line: no se cargaron horarios en tiempo real');
        return;
      }

      if (!result.ok) {
        console.error('Error cargando horarios disponibles:', result.error);
        setHorarios([]);
        return;
      }

      const horariosFiltrados = filtrarHorariosPorRango(
        result.data || [],
        clinica.hora_apertura,
        clinica.hora_cierre
      );

      setHorarios(horariosFiltrados);
    }

    loadHorarios();

    return () => {
      mounted = false;
    };
  }, [selectedDate, clinica, clinicaId]);

  const fetchConToken = async (url: string, options: RequestInit) => {
    let token = accessToken;

    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        setModalType('warning');
        setModalMessage('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
        setModalOpen(true);
        router.push('/login');
        return null;
      }
    }

    const opciones = { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } };
    let response = await fetch(url, opciones);

    if (response.status === 401) {
      const nuevoToken = await refreshAccessToken();
      if (!nuevoToken) {
        setModalType('warning');
        setModalMessage('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
        setModalOpen(true);
        router.push('/login');
        return null;
      }

      opciones.headers = { ...opciones.headers, Authorization: `Bearer ${nuevoToken}` };
      response = await fetch(url, opciones);
    }

    return response;
  };

  const agendarCita = async () => {
    let token = accessToken;

    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        setModalType('warning');
        setModalMessage('Debes iniciar sesión para agendar una cita.');
        setModalOpen(true);
        router.push('/login');
        return;
      }
    }

    if (!selectedDate || !selectedHour) {
      setModalType('warning');
      setModalMessage('Selecciona una fecha y un horario.');
      setModalOpen(true);
      return;
    }

    const ahora = dayjs();
    const fechaSeleccionada = selectedDate
      .hour(Number(selectedHour.split(':')[0]))
      .minute(Number(selectedHour.split(':')[1]));

    if (fechaSeleccionada.isBefore(ahora)) {
      setModalType('warning');
      setModalMessage('Selecciona una fecha y hora válidas.');
      setModalOpen(true);
      return;
    }

    if (!clinica?.medico_responsable) {
      setModalType('error');
      setModalMessage('No hay médico asignado a esta clínica.');
      setModalOpen(true);
      return;
    }

    try {
      const response = await fetchConToken(
        `http://127.0.0.1:8000/api/medicos/${clinica.medico_responsable.id}/agendar-cita/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            paciente_id: pacienteId || 1,
            clinica_id: clinicaId,
            medico_id: clinica.medico_responsable.id,
            fecha: selectedDate.format('YYYY-MM-DD'),
            hora: selectedHour,
            motivo: motivo || 'Consulta general',
          }),
        }
      );

      if (!response) return;

      if (response.ok) {
        setModalType('success');
        setModalMessage('Cita agendada correctamente.');
        setModalOpen(true);

        setTimeout(() => {
          router.push('/paciente/citas');
        }, 1200);

      } else {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch (err) {
          console.error('Respuesta no JSON:', err);
        }

        setModalType('error');
        setModalMessage(
          errorData?.error || errorData?.detail || 'Ocurrió un error inesperado al agendar la cita.'
        );
        setModalOpen(true);
      }
    } catch (error) {
      await queueRequest({
        url: `http://127.0.0.1:8000/api/medicos/${clinica?.medico_responsable?.id}/agendar-cita/`,
        method: 'POST',
        body: {
          paciente_id: pacienteId || 1,
          clinica_id: clinicaId,
          medico_id: clinica?.medico_responsable?.id,
          fecha: selectedDate.format('YYYY-MM-DD'),
          hora: selectedHour,
          motivo: motivo || 'Consulta general',
        },
      });

      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg: any) => {
          if ('sync' in reg) {
            reg.sync.register('sync-citas').catch((e: any) => console.warn('Sync register failed:', e));
          }
        }).catch((e) => console.warn('Service worker ready error:', e));
      }

      setModalType('warning');
      setModalMessage('No tienes conexión. La cita se enviará automáticamente cuando vuelva la red.');
      setModalOpen(true);

      return;
    }
  };

  const publicarComentario = () => {
    if (!rating || comentario.trim() === '') {
      setModalType('warning');
      setModalMessage('Debes agregar una calificación y un comentario.');
      setModalOpen(true);
      return;
    }

    const nuevoComentario: Comentario = {
      id: Date.now(),
      nombre: nombrePaciente,
      rating,
      comentario,
    };

    setComentarios([nuevoComentario, ...comentarios]);
    setComentario('');
  };

  if (!clinica) {
    return (
      <div className="p-6 text-white">Cargando clínica...</div>
    );
  }

  const diasHabiles = clinica?.dias_habiles || [];

  return (
    <main className="min-h-screen bg-white">
      <NavbarPaciente />

      <div className="max-w-6xl mx-auto px-4 mt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-[#6381A8] border border-gray-200 rounded-full shadow-sm 
                      hover:bg-[#4f6a8f] hover:text-white hover:shadow-md transition-all duration-200 
                      text-white font-medium"
        >
          <FaArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="flex flex-col items-start">

          {clinica.imagen ? (
            <Image
              src={clinica.imagen}
              alt={clinica.nombre || 'Clinica'}
              width={600}
              height={400}
              className="rounded-lg object-cover mb-6"
            />
          ) : (
            <div className="w-full h-[400px] bg-gray-200 mb-6 rounded-lg flex items-center justify-center">Sin imagen</div>
          )}

          {/* ESTRELLAS + COMENTARIOS */}
          <div className="text-left w-full max-w-[600px]">
            <p className="font-semibold text-lg mb-2 text-black">Calificación</p>

            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, index) => {
                  const currentRating = index + 1;
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name="rating"
                        value={currentRating}
                        onClick={() => setRating(currentRating)}
                        className="hidden"
                      />
                      <FaStar
                        size={28}
                        className="cursor-pointer transition-colors"
                        color={
                          currentRating <= (hover || rating!)
                            ? '#ffc107'
                            : '#e4e5e9'
                        }
                        onMouseEnter={() => setHover(currentRating)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
                <span className="text-sm text-black ml-2">{rating} / 5</span>
              </div>

              <p className="font-medium mb-1 text-black">Agregar tu comentario</p>
              <input
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="w-full border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none text-black"
              />

              <button
                onClick={publicarComentario}
                className="mt-3 bg-[#6381A8] text-white px-4 py-2 rounded-lg hover:bg-[#4f6a8f]"
              >
                Publicar
              </button>
            </div>

            <div className="mt-6">
              <p className="font-semibold text-lg mb-3 text-black">Comentarios</p>

              {comentarios.map((c) => (
                <div key={c.id} className="border-b py-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={16}
                        color={i < c.rating ? '#ffc107' : '#e4e5e9'}
                      />
                    ))}
                  </div>

                  <p className="font-medium text-black mt-1">{c.nombre}</p>
                  <p className="text-sm text-gray-700">{c.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div className="flex flex-col gap-4 text-gray-800">
          <h2 className="text-2xl font-bold">{clinica.nombre}</h2>
          <p><strong>Descripción:</strong> {clinica.descripcion || 'Sin descripción'}</p>
          <p><strong>Ubicación:</strong> {clinica.ubicacion || 'No especificada'}</p>
          <p><strong>Especialidad:</strong> {clinica.medico_responsable?.especialidad_nombre || 'No especificada'}</p>
          <p><strong>Médico responsable:</strong> {clinica.medico_responsable?.full_name || 'No especificado'}</p>

          <div className="mt-4">
            <p className="font-medium text-sm mb-2">Motivo de la cita:</p>
            <textarea
              className="border px-2 py-1 rounded text-sm w-full"
              rows={2}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Escribe el motivo..."
            />
          </div>

          <p className="font-medium mt-4">Selecciona una fecha:</p>
          <div className="border rounded-md p-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={setSelectedDate}
                shouldDisableDate={(date: Dayjs) => {
                  const dia = date.day();
                  const diaBackend = dia === 0 ? 6 : dia - 1;
                  return !diasHabiles.includes(diaBackend);
                }}
              />
            </LocalizationProvider>

            <div className="mt-6">
              <p className="font-medium text-sm mb-2">Selecciona un horario:</p>
              <select
                className="border px-2 py-1 rounded text-sm w-full"
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
              >
                <option value="">Elige una hora</option>
                {horarios.map((hora, idx) => (
                  <option key={idx} value={hora}>{hora}</option>
                ))}
              </select>
            </div>

            <button
              className="mt-4 bg-[#6381A8] hover:bg-[#4f6a8f] text-white px-4 py-2 rounded-2xl w-full"
              onClick={agendarCita}
            >
              Agendar
            </button>
          </div>
        </div>

      </section>

      <Modal
        open={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}