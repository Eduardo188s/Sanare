"use client";

import { useState } from "react";

interface CedulaData {
  valid: boolean;
  nombre: string;
  especialidad: string;
  sexo?: "M" | "F" | "O" | string;
  error?: string;
}

export default function RegisterForm() {
  const [userType, setUserType] = useState<"medico" | "paciente">("paciente");

  const [cedulaVerified, setCedulaVerified] = useState(false);
  const [medicoForm, setMedicoForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    fecha_nacimiento: "",
    sexo: "",
    telefono: "",
    especialidad: "",
    cedula: "",
  });

  const [pacienteForm, setPacienteForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    fecha_nacimiento: "",
    sexo: "",
    telefono: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
  const phoneRegex = /^[0-9]{8,15}$/;
  const minDate = "1900-01-01";
  const maxDate = new Date().toISOString().split("T")[0];


  const splitFullName = (fullName: string): { firstName: string, lastName: string } => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');
      return { firstName, lastName };
    }
    return { firstName: fullName, lastName: "" };
  };

  const handleCedulaBlur = async () => {
    if (!medicoForm.cedula || cedulaVerified) return;

    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const cedulaResponse = await fetch(
        `https://sanarebackend-production.up.railway.app/api/auth/cedula/${medicoForm.cedula}/`
      );
      const cedulaData: CedulaData = await cedulaResponse.json();

      if (cedulaResponse.ok && cedulaData.valid) {
        const { firstName, lastName } = splitFullName(cedulaData.nombre);
        
        setMedicoForm(prev => ({ 
            ...prev, 
            firstName: firstName,
            lastName: lastName,
            especialidad: cedulaData.especialidad,
            sexo: cedulaData.sexo || "",
        }));
        setCedulaVerified(true);
        setMessage("Cédula validada con éxito. Por favor, complete su información de contacto.");
      } else {
        setError(cedulaData.error || "La cédula profesional no es válida o no fue encontrada.");
        setCedulaVerified(false);
        setMedicoForm(prev => ({ ...prev, firstName: "", lastName: "", especialidad: "", sexo: ""}));
      }
    } catch {
      setError("Error de conexión al validar la cédula profesional.");
      setCedulaVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    formType: "medico" | "paciente"
  ) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "firstName" || name === "lastName") {
      newValue = newValue.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");
    }
    if (name === "telefono") {
      newValue = newValue.replace(/[^0-9]/g, "");
    }

    formType === "medico"
      ? setMedicoForm((prev) => ({ ...prev, [name]: newValue }))
      : setPacienteForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateForm = (form: any, type: "medico" | "paciente"): boolean => {
    if (type === "medico" && !cedulaVerified) {
      setError("Debe validar su cédula profesional primero.");
      return false;
    }
    
    if (!phoneRegex.test(form.telefono)) {
      setError("El teléfono debe contener entre 8 y 15 dígitos numéricos.");
      return false;
    }
    if (form.fecha_nacimiento < minDate || form.fecha_nacimiento > maxDate) {
      setError("La fecha de nacimiento no es válida.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const form = userType === "medico" ? medicoForm : pacienteForm;
    if (userType === "medico" && !cedulaVerified) {
        setError("Por favor, valide su cédula profesional antes de continuar con el registro.");
        setLoading(false);
        return;
    }

    if (!validateForm(form, userType)) {
      setLoading(false);
      return;
    }

    try {
            const endpoint =
        userType === "medico"
          ? "https://sanarebackend-production.up.railway.app/api/auth/register/medico/"
          : "https://sanarebackend-production.up.railway.app/api/auth/register/paciente/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          userType === "medico"
            ? {
                username: medicoForm.username,
                email: medicoForm.email,
                password: medicoForm.password,
                password2: medicoForm.password2,
                first_name: medicoForm.firstName,
                last_name: medicoForm.lastName,
                fecha_nacimiento: medicoForm.fecha_nacimiento,
                sexo: medicoForm.sexo,
                telefono: medicoForm.telefono,
                especialidad: medicoForm.especialidad,
                cedula: medicoForm.cedula,
              }
            : {
                username: pacienteForm.username,
                email: pacienteForm.email,
                password: pacienteForm.password,
                password2: pacienteForm.password2,
                first_name: pacienteForm.firstName,
                last_name: pacienteForm.lastName,
                fecha_nacimiento: pacienteForm.fecha_nacimiento,
                sexo: pacienteForm.sexo,
                telefono: pacienteForm.telefono,
              }
        ),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(
          data.message ||
            `Registro de ${userType === "medico" ? "médico" : "paciente"} exitoso.`
        );

        const initialFormState = {
            username: "", email: "", password: "", password2: "", firstName: "", lastName: "",
            fecha_nacimiento: "", sexo: "", telefono: "", especialidad: "", cedula: "",
        };
        userType === "medico"
          ? (setMedicoForm(initialFormState), setCedulaVerified(false))
          : setPacienteForm(initialFormState);

      } else {
        const errorMessages = Object.values(data).flat().join(" ");
        setError(errorMessages || "Error en el registro.");
      }
    } catch {
      setError("Error de conexión o del servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg text-left">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#6381A8]">
        Crea una Cuenta
      </h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setUserType("paciente")}
          className={`px-4 py-2 rounded-l-lg ${
            userType === "paciente"
              ? "bg-[#6381A8] text-white"
              : "bg-gray-200 text-[#556f91]"
          }`}
        >
          Soy Paciente
        </button>
        <button
          onClick={() => setUserType("medico")}
          className={`px-4 py-2 rounded-r-lg ${
            userType === "medico"
              ? "bg-[#6381A8] text-white"
              : "bg-gray-200 text-[#577193]"
          }`}
        >
          Soy Médico
        </button>
      </div>

      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {userType === "medico" && (
            <div className="relative">
                <input
                    type="text"
                    name="cedula"
                    placeholder="Cédula profesional"
                    value={medicoForm.cedula}
                    onChange={(e) => {
                        handleChange(e, "medico");
                        if(cedulaVerified) setCedulaVerified(false);
                        setMedicoForm(prev => ({ ...prev, firstName: "", lastName: "", especialidad: "", sexo: "" }));
                    }}
                    onBlur={handleCedulaBlur}
                    required
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-md p-2 pr-28 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8]"
                />
                <div 
                    className={`absolute right-2 top-2 text-sm font-medium ${
                        cedulaVerified ? 'text-green-600' : 'text-gray-500'
                    }`}
                >
                    {cedulaVerified ? "Verificada" : "Esperando..."}
                </div>
            </div>
        )}
        
        <input
          type="text"
          name="username"
          placeholder="Nombre de Usuario"
          value={
            userType === "medico" ? medicoForm.username : pacienteForm.username
          }
          onChange={(e) => handleChange(e, userType)}
          required
          disabled={userType === "medico" && !cedulaVerified}
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8]"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={userType === "medico" ? medicoForm.email : pacienteForm.email}
          onChange={(e) => handleChange(e, userType)}
          required
          disabled={userType === "medico" && !cedulaVerified}
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8]"
        />

        <div className="flex gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={
              userType === "medico"
                ? medicoForm.firstName
                : pacienteForm.firstName
            }
            onChange={(e) => handleChange(e, userType)}
            required
            disabled={userType === "medico"}
            className="w-1/2 border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8]"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={
              userType === "medico"
                ? medicoForm.lastName
                : pacienteForm.lastName
            }
            onChange={(e) => handleChange(e, userType)}
            required
            disabled={userType === "medico"}
            className="w-1/2 border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8]"
          />
        </div>
        
        {userType === "medico" && (
            <input
                type="text"
                name="especialidad"
                placeholder="Especialidad"
                value={medicoForm.especialidad}
                required
                disabled={true}
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8] bg-gray-100"
            />
        )}
        
        <input
          type="date"
          name="fecha_nacimiento"
          value={
            userType === "medico"
              ? medicoForm.fecha_nacimiento
              : pacienteForm.fecha_nacimiento
          }
          onChange={(e) => handleChange(e, userType)}
          min={minDate}
          max={maxDate}
          required
          disabled={userType === "medico" && !cedulaVerified}
          className={`w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#6381A8] 
          ${
            (userType === "medico"
              ? medicoForm.fecha_nacimiento
              : pacienteForm.fecha_nacimiento) === ""
              ? "text-gray-400"
              : "text-black"
          }`}
        />

        <select
          name="sexo"
          value={userType === "medico" ? medicoForm.sexo : pacienteForm.sexo}
          onChange={(e) => handleChange(e, userType)}
          required
          disabled={userType === "medico"}
          className={`w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#6381A8] 
            ${
              (userType === "medico"
                ? medicoForm.sexo
                : pacienteForm.sexo) === ""
                ? "text-gray-400"
                : "text-black"
            }`}
        >
          <option value="" disabled>
            Selecciona tu sexo
          </option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={
            userType === "medico"
              ? medicoForm.telefono
              : pacienteForm.telefono
          }
          onChange={(e) => handleChange(e, userType)}
          required
          disabled={userType === "medico" && !cedulaVerified}
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8]"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={
            userType === "medico" ? medicoForm.password : pacienteForm.password
          }
          onChange={(e) => handleChange(e, userType)}
          required
          disabled={userType === "medico" && !cedulaVerified}
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8]"
        />

        <input
          type="password"
          name="password2"
          placeholder="Confirmar Contraseña"
          value={
            userType === "medico"
              ? medicoForm.password2
              : pacienteForm.password2
          }
          onChange={(e) => handleChange(e, userType)}
          required
          disabled={userType === "medico" && !cedulaVerified}
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-[#6381A8]"
        />

        <button
          type="submit"
          disabled={loading || (userType === "medico" && !cedulaVerified)} 
          className="w-full bg-[#6381A8] text-white py-2 px-4 rounded hover:bg-[#4f6a8f] transition duration-200"
        >
          {loading
            ? "Registrando..."
            : userType === "medico" && !cedulaVerified
            ? "Verifique la Cédula para Continuar"
            : `Registrar ${userType === "medico" ? "Médico" : "Paciente"}`}
        </button>
      </form>
    </div>
  );
}
