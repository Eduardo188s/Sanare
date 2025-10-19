'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import NavbarPaciente from '../../NavBar';
import { FaStar } from 'react-icons/fa';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '@/context/AuthContext';

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

export default function ClinicaDetalle() {
  const router = useRouter();
  const params = useParams();
  const clinicaId = Number(params?.id);

  const [clinica, setClinica] = useState<Clinica | null>(null);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [rating, setRating] = useState<number | null>(5);
  const [hover, setHover] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');

  const pacienteId =
    typeof window !== 'undefined'
      ? Number(localStorage.getItem('pacienteId'))
      : null;

  const { accessToken, refreshAccessToken } = useAuth();

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
    if (!selectedDate || !clinica?.medico_responsable) return;

    const fecha = selectedDate.format('YYYY-MM-DD');

    fetch(`http://127.0.0.1:8000/api/clinicas/${clinicaId}/horarios_disponibles/?fecha=${fecha}`)
      .then((res) => res.json())
      .then((data) => {
        const horariosFiltrados = filtrarHorariosPorRango(
          data,
          clinica.hora_apertura,
          clinica.hora_cierre
        );
        setHorarios(horariosFiltrados);
      })
      .catch((err) => console.error('Error cargando horarios disponibles:', err));
  }, [selectedDate, clinica, clinicaId]);

  const fetchConToken = async (url: string, options: RequestInit) => {
    let token = accessToken;

    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        alert('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
        router.push('/login');
        return null;
      }
    }

    const opciones = { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } };

    let response = await fetch(url, opciones);

    if (response.status === 401) {
      const nuevoToken = await refreshAccessToken();
      if (!nuevoToken) {
        alert('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
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
        alert('Debes iniciar sesión para agendar una cita');
        router.push('/login');
        return;
      }
    }

    if (!selectedDate || !selectedHour) {
      alert('Selecciona una fecha y un horario.');
      return;
    }

    const ahora = dayjs();
    const fechaSeleccionada = selectedDate
      .hour(Number(selectedHour.split(':')[0]))
      .minute(Number(selectedHour.split(':')[1]));

    if (fechaSeleccionada.isBefore(ahora)) {
      alert('Selecciona una fecha y hora válidas');
      return;
    }

    if (!clinica?.medico_responsable) {
      alert('No hay médico asignado a esta clínica.');
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
            motivo: motivo || 'Consulta general'
          }),
        }
      );

      if (!response) return;

      if (response.ok) {
        alert('Cita agendada correctamente');
        router.push('/paciente/citas');
      } else {
        const errorData = await response.json();
        const mensaje = errorData?.error || errorData?.detail || 'Ocurrió un error al agendar la cita';
        alert(mensaje);
        router.push('/paciente/citas');
      }
    } catch (error: any) {
      alert(error.message || 'Error de red al agendar cita');
    }
  };

  if (!clinica) return <p className="p-4">Cargando clínica...</p>;

  const diasHabiles = clinica?.dias_habiles || [];

  return (
    <main className="min-h-screen bg-white">
      <NavbarPaciente />

      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen y Calificación */}
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
            <div className="w-full h-[400px] bg-gray-200 mb-6 rounded-lg flex items-center justify-center">
              Sin imagen
            </div>
          )}

          <div className="text-left w-full max-w-[600px]">
            <p className="font-semibold text-lg mb-2 text-black">Calificación</p>
            <div className="mb-4">
              <p className="font-medium mb-1 text-black">Agregar tu comentario</p>
              <p className='text-black'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
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
                <span className="text-sm text-black ml-2">
                  {rating} / 5
                </span>
              </div>
              <input
                placeholder="Escribe tu comentario..."
                className="w-full border border-gray-800 rounded-md px-3 py-2 text-sm focus:outline-none text-black"
              />
            </div>
          </div>
        </div>

        {/* Calendario y disponibilidad */}
        <div className="flex flex-col gap-4 text-gray-800">
          <h2 className="text-2xl font-bold">{clinica.nombre}</h2>
          <p><strong>Descripción:</strong> {clinica.descripcion || 'Sin descripción'}</p>
          <p><strong>Ubicación:</strong> {clinica.ubicacion || 'No especificada'}</p>
          <p><strong>Especialidad:</strong> {clinica.medico_responsable?.especialidad_nombre || 'No especificada'}</p>
          <p><strong>Médico responsable:</strong> {clinica.medico_responsable?.full_name || 'No especificado'}</p>

          {/* Motivo de la cita */}
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

          <p className="text-bg-[#6381A8] font-medium mt-4">Selecciona una fecha:</p>
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
    </main>
  );
}
