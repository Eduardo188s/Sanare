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

type Clinica = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  ubicacion: string;
  hora_apertura: string;
  hora_cierre: string;
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

  const pacienteId = typeof window !== 'undefined' ? Number(localStorage.getItem('pacienteId')) : null;
  const [medicoId, setMedicoId] = useState<number | null>(null);


  useEffect(() => {
  if (!clinicaId) return;

  fetch(`http://127.0.0.1:8000/api/medicos/?clinica=${clinicaId}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        setMedicoId(data[0].id);
      } else {
        setMedicoId(null);
      }
    })
    .catch(err => {
      console.error(err);
      setMedicoId(null);
    });
  }, [clinicaId]);

  useEffect(() => {
    if (!clinicaId) return;

    fetch(`http://127.0.0.1:8000/api/clinicas/${clinicaId}/`)
      .then(res => res.json())
      .then(data => {
        setClinica(data);
        if (data.hora_apertura && data.hora_cierre) {
          generarHorarios(data.hora_apertura, data.hora_cierre);
        }
      })
      .catch(err => console.error('Error al cargar la clínica:', err));
    }, [clinicaId]);

    const generarHorarios = (inicio: string, fin: string) => {
      const listaHorarios: string[] = [];
      let actual = dayjs(`2000-01-01T${inicio}`);
      const finHora = dayjs(`2000-01-01T${fin}`);

      while (actual.isBefore(finHora)) {
        listaHorarios.push(actual.format('HH:mm'));
        actual = actual.add(30, 'minute');
      }

      setHorarios(listaHorarios);
    };

  const agendarCita = async () => {
    if (!selectedDate || !selectedHour) {
      alert('Selecciona una fecha y un horario.');
      return;
    }

    if (!medicoId) {
    alert('Esta clínica no tiene médicos registrados. No puedes agendar una cita.');
    return;
  }

    const ahora = dayjs();
    const fechaSeleccionada = selectedDate.hour(
      Number(selectedHour.split(':')[0])
    ).minute(Number(selectedHour.split(':')[1]));

    if (fechaSeleccionada.isBefore(ahora)) {
      alert('Selecciona una fecha y hora válidas');
      return;
    }

    const tempPacienteId = pacienteId || 1;
    const tempClinicaId = clinicaId || 1;
    const tempMedicoId = medicoId || 1;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/citas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente: tempPacienteId,
          clinica: tempClinicaId,
          medico: tempMedicoId,
          fecha: selectedDate.format('YYYY-MM-DD'),
          hora: selectedHour,
          motivo: 'Consulta general',
        }),
      });

          console.log("Status:", response.status);


      if (response.ok) {
        alert('Cita agendada correctamente');
        router.push('/paciente/citas');
      } else {
        let errorText;
        try {
        errorText = await response.text();
      } catch {
        errorText = "Sin mensaje de error";
      }
        console.error('Error al agendar cita:', errorText);
        alert('Error al agendar cita');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error de red al agendar cita');
    }
  };

  if (!clinica) return <p className="p-4">Cargando clínica...</p>;

  return (
    <main className="min-h-screen bg-white">
      <NavbarPaciente />

      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen y Calificación */}
        <div className="flex flex-col items-start">
          {clinica?.imagen ? (
            <Image
              src={clinica.imagen}
              alt={clinica?.nombre || 'Clinica'}
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
            <p className="font-semibold text-lg mb-2">Calificación</p>
            <div className="mb-4">
              <p className="font-medium mb-1">Agregar tu comentario</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
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
                <span className="text-sm text-gray-600 ml-2">
                  {rating} / 5
                </span>
              </div>
              <input
                placeholder="Escribe tu comentario..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Calendario y disponibilidad */}
        <div className="flex flex-col gap-4 text-gray-800">
          <h2 className="text-2xl font-bold">
            {clinica?.nombre || 'Clínica'}
          </h2>
          <p>
            <strong>Descripción:</strong>{' '}
            {clinica?.descripcion || 'Sin descripción'}
          </p>
          <p>
            <strong>Ubicación:</strong> {clinica?.ubicacion || 'No especificada'}
          </p>

          <p className="text-blue-700 font-medium">Selecciona una fecha:</p>

          <div className="border rounded-md p-4">
            {/* MUI Calendar */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar value={selectedDate} onChange={setSelectedDate} />
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
                  <option key={idx} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 w-full"
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
