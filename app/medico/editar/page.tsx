"use client";

import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import { CloudUpload, X } from "lucide-react";
import NavbarMedico from "../Navbar";

const CloudUploadIcon = (props: React.SVGProps<SVGSVGElement>) => <CloudUpload {...props} />;
const XIcon = (props: React.SVGProps<SVGSVGElement>) => <X {...props} />;

function FileUploadClínica() {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="w-80 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white text-center text-black hover:border-blue-400 transition">
      <label className="flex flex-col items-center cursor-pointer w-full">
        <CloudUploadIcon className="h-8 w-8 text-blue-600 mb-2" />
        <span className="text-sm font-medium text-gray-700">Sube la imagen del consultorio</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
      {fileName && (
        <p className="mt-2 text-sm text-gray-600">Archivo seleccionado: {fileName}</p>
      )}
    </div>
  );
}

function FileUploadMedico() {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white text-center text-black hover:border-blue-400 transition">
      <label className="flex flex-col items-center cursor-pointer w-full">
        <CloudUploadIcon className="h-8 w-8 text-blue-600 mb-2" />
        <span className="text-sm font-medium text-gray-700">Foto de perfil del médico</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
      {fileName && (
        <p className="mt-2 text-sm text-gray-600">Archivo seleccionado: {fileName}</p>
      )}
    </div>
  );
}

export default function EditarConsultorio() {
  const [mostrarFormularioMedico, setMostrarFormularioMedico] = useState(false);
  const [inicio, setInicio] = useState<Dayjs | null>(dayjs());
  const [fin, setFin] = useState<Dayjs | null>(dayjs().add(1, "hour"));

  return (
    <>
      <NavbarMedico />

      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex gap-8">
          <div>
            <FileUploadClínica />
            <p className="mt-4 text-center text-sm text-gray-700 font-medium">Calificación</p>
          </div>

          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-semibold">Editar Consultorio</h2>

            <input type="text" placeholder="Nombre" className="w-full p-2 border rounded" />
            <textarea placeholder="Descripción" className="w-full p-2 border rounded h-20" />

            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Dirección" className="p-2 border rounded" />
              <input type="text" placeholder="Código postal" className="p-2 border rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Estado" className="p-2 border rounded" />
              <select className="p-2 border rounded">
                <option>Doctores agregados</option>
                <option>Dra. Gómez</option>
                <option>Dr. Ramírez</option>
              </select>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DateTimePicker
                  label="Inicio de atención"
                  value={inicio}
                  onChange={setInicio}
                  slotProps={{ textField: { size: "small" } }}
                />
                <DateTimePicker
                  label="Fin de atención"
                  value={fin}
                  onChange={setFin}
                  slotProps={{ textField: { size: "small" } }}
                />
              </Box>
            </LocalizationProvider>

            <div className="flex justify-between mt-4">
              <button className="bg-[#6381A8] hover:bg-[#4e6a8f] text-white px-4 py-2 rounded">
                Guardar
              </button>
              <button
                className="bg-[#6381A8] hover:bg-[#4e6a8f] text-white px-4 py-2 rounded"
                onClick={() => setMostrarFormularioMedico(true)}
              >
                Agregar Médico
              </button>
            </div>
          </div>
        </div>

        {mostrarFormularioMedico && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="w-full max-w-2xl bg-white text-black p-8 rounded-lg relative shadow-lg">
              <button
                onClick={() => setMostrarFormularioMedico(false)}
                className="absolute top-4 right-4 text-black hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold mb-6 text-[#6381A8]">
                Agrega un Nuevo Médico a tu Consultorio
              </h2>

              <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                  <input type="radio" name="genero" className="mr-1" /> F
                </label>
                <label className="flex items-center">
                  <input type="radio" name="genero" className="mr-1" /> M
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Nombre" className="p-2 rounded border" />
                <input type="text" placeholder="Apellido" className="p-2 rounded border" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <select className="p-2 rounded border">
                  <option>Área de Salud</option>
                  <option>Oftalmología</option>
                  <option>Cardiología</option>
                </select>
                <input type="number" placeholder="Edad" className="p-2 rounded border" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="email" placeholder="E-Mail*" className="p-2 rounded border" />
                <input type="tel" placeholder="Teléfono" className="p-2 rounded border" />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Validar Cédula Profesional"
                  className="p-2 rounded-l w-full border"
                />
                <button className="bg-[#6381A8] text-white px-4 py-2 rounded-r font-semibold">
                  Validar
                </button>
              </div>

              <FileUploadMedico />

              <div className="flex justify-between mt-6">
                <button
                  className="bg-[#6381A8] text-white px-4 py-2 rounded font-semibold"
                  onClick={() => {
                    alert("Se registró un nuevo médico");
                    setMostrarFormularioMedico(false);
                  }}
                >
                  Registrar
                </button>
                <button
                  onClick={() => setMostrarFormularioMedico(false)}
                  className="text-[#6381A8] underline hover:text-[#4e6a8f]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
