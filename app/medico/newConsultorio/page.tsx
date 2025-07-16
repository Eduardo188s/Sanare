'use client';

import React, { useState } from "react";
import Image from "next/image";
import NavbarMedico from "../Navbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import { FaCamera } from "react-icons/fa";

export default function NewConsultorio() {
  const [selectedDoctor, setSelectedDoctor] = useState("Dra. Gómez");
  const [inicio, setInicio] = useState<Dayjs | null>(dayjs());
  const [fin, setFin] = useState<Dayjs | null>(dayjs().add(1, "hour"));
  const [imagenPreview, setImagenPreview] = useState<string>("/clinica1.jpeg");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImagenPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarConsultorio = () => {
    alert("✅ Consultorio registrado correctamente (simulado)");
    
  };

  return (
     <main className="min-h-screen bg-white">
          <NavbarMedico />
        <section>
        <div className="p-8 mt-10 bg-white text-gray-800 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Agregar Nuevo Consultorio</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Imagen con ícono para cambiar */}
            <div className="relative flex flex-col items-center">
                <Image
                src={imagenPreview}
                alt="Portada Consultorio"
                width={600}
                height={400}
                className="rounded-lg shadow object-cover"
                />
                <label className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-md cursor-pointer hover:bg-gray-100 transition">
                <FaCamera className="text-gray-700 text-lg" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                </label>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-semibold mb-1" htmlFor="descripcion">
                    Descripción:
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Escribe una breve descripción del consultorio..."
                />
                </div>

                <div>
                <label className="block text-sm font-semibold mb-1" htmlFor="ubicacion">
                    Ubicación:
                </label>
                <input
                    id="ubicacion"
                    name="ubicacion"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Ciudad, Estado"
                />
                </div>

                <div>
                <label className="block text-sm font-medium mb-1">Doctor responsable:</label>
                <select
                    aria-placeholder="Doctor responsable"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                    <option>Dra. Gómez</option>
                    <option>Dr. Ramírez</option>
                    <option>Dr. Ortega</option>
                </select>
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <DateTimePicker
                    label="Inicio de atención"
                    value={inicio}
                    onChange={(newValue) => setInicio(newValue)}
                    slotProps={{
                        textField: {
                        fullWidth: true,
                        helperText: null,
                        },
                    }}
                    />
                    <DateTimePicker
                    label="Fin de atención"
                    value={fin}
                    onChange={(newValue) => setFin(newValue)}
                    slotProps={{
                        textField: {
                        fullWidth: true,
                        helperText: null,
                        },
                    }}
                    />
                </Box>
                </LocalizationProvider>

                <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition mt-4 w-full"
                onClick={handleGuardarConsultorio}
                >
                Guardar consultorio
                </button>
            </div>
            </div>
        </div>
      </section>
    </main>
  );
}
