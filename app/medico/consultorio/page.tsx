"use client";
import React, { useState } from "react";
import Image from "next/image";
import NavbarMedico from "../components/Navbar";
import { FaStar } from "react-icons/fa";

// MUI
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";

export default function Consultorio() {
  const [selectedDoctor, setSelectedDoctor] = useState("Dra. Gómez");
  const [inicio, setInicio] = useState<Dayjs | null>(dayjs());
  const [fin, setFin] = useState<Dayjs | null>(dayjs().add(1, "hour"));

  const handleGuardarHorario = () => {
    if (!inicio || !fin) return;

    alert(
      `🕒 Horario de atención registrado:\nDoctor: ${selectedDoctor}\nInicio: ${inicio.format("DD/MM/YYYY hh:mm A")}\nFin: ${fin.format("DD/MM/YYYY hh:mm A")}`
    );
  };

  return (
    <>
      <NavbarMedico />
      <div className="p-8 bg-white text-gray-800 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LADO IZQUIERDO */}
          <div>
            <Image
              src="/clinica1.jpeg"
              alt="Clinica"
              width={600}
              height={400}
              className="rounded-lg shadow"
            />
            <div className="mt-4">
              <p className="font-semibold text-lg">Calificación</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < 3 ? "#FBBF24" : "#E5E7EB"} />
                ))}
                <span className="ml-2 text-sm text-gray-500">3</span>
              </div>
              <p className="text-sm mt-2 text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-xs text-gray-400 mt-1">6 Julio 2025</p>
            </div>
          </div>

          {/* LADO DERECHO */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Descripción:</p>
              <p className="text-sm">Clínica especializada en procedimientos visuales.</p>
            </div>

            <div>
              <p className="text-sm font-semibold">Ubicación:</p>
              <p className="text-sm">Apizaco, Tlaxcala</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Doctor responsable:</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option>Dra. Gómez</option>
                <option>Dr. Ramírez</option>
              </select>
            </div>

            {/* Pickers */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DateTimePicker
                  label="Inicio de atención"
                  value={inicio}
                  onChange={setInicio}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DateTimePicker
                  label="Fin de atención"
                  value={fin}
                  onChange={setFin}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Box>
            </LocalizationProvider>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-4"
              disabled={!inicio || !fin}
              onClick={handleGuardarHorario}
            >
              Guardar horario de atención
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
