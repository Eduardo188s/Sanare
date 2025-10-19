"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(userNameOrEmail, password);
    } catch (err: any) {
      let errorMessage = "Error desconocido al iniciar sesión.";
      const message = err.message ? err.message.toLowerCase() : "";

      if (message.includes("wrong password") || message.includes("contraseña incorrecta")) {
        errorMessage = "Contraseña incorrecta. Por favor, inténtalo de nuevo.";
      } else if (message.includes("user not found") || message.includes("usuario no encontrado")) {
        errorMessage = "Usuario o correo electrónico no registrado.";
      } else if (message.includes("invalid email") || message.includes("correo inválido")) {
        errorMessage = "El formato del correo electrónico es incorrecto.";
      } else if (message.includes("network error") || message.includes("fallo de red")) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md text-left">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#6381A8]">
        Inicia Sesión
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre de Usuario o Email"
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={userNameOrEmail}
          onChange={(e) => setUserNameOrEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#6381A8] text-white py-2 px-4 rounded hover:bg-[#4f6a8f] transition duration-200"
          disabled={loading}
        >
          {loading ? "Iniciando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
