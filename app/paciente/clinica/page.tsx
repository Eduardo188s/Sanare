'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NavbarPaciente from '../NavBar';
import { FaStar } from 'react-icons/fa';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';

export default function ClinicaDetalle() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [rating, setRating] = useState<number | null>(5);
  const [hover, setHover] = useState<number | null>(null);
  const router = useRouter();

  const horarios = ['9:00 a.m', '10:30 a.m', '12:00 p.m', '2:00 p.m'];

  const agendarCita = () => {
    if (!selectedDate || !selectedHour) {
      alert('Selecciona una fecha y un horario para agendar tu cita.');
      return;
    }

    alert(`Cita agendada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedHour}`);
    router.push('/paciente/citas');
  };

  return (
    <main className="min-h-screen bg-white">
      <NavbarPaciente />

      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen y Calificación */}
        <div className="flex flex-col items-start">
          <Image
            src="/clinica1.jpeg"
            alt="Clinica los Angeles"
            width={600}
            height={400}
            className="rounded-lg object-cover mb-6"
          />

          <div className="text-left w-full max-w-[600px]">
            <p className="font-semibold text-lg mb-2">Calificación</p>

            <div className="mb-4">
              <p className="font-medium mb-1">Agregar tu comentario</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit neque laudantium, est voluptates doloribus, odit illo quam error, id vel impedit nam. Officia, eaque maxime doloribus sint praesentium similique rem!</p>

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
                <span className="text-sm text-gray-600 ml-2">{rating} / 5</span>
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
          <h2 className="text-2xl font-bold">Clínica los Angeles</h2>
          <p>
            <strong>Descripción:</strong> Clínica especializada en medicina general y atención médica personalizada.
          </p>
          <p>
            <strong>Ubicación:</strong> Tlaxcala
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
