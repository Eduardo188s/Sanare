"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

interface User {
  id: number;
  username: string;
  email: string;
  is_medico: boolean;
  is_paciente: boolean;
  full_name?: string;
  telefono?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  especialidad?: string;
  cedula_profesional?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshAccessToken: () => Promise<string | null>;
}

// Clave para cifrar y descifrar datos
const SECRET_KEY = "clave_123";

// Texto cifrado
const cipherText = "U2FsdGVkX1/XQdBI6qK51DJwDbcyz2/2FbDYcdE2zVoTlFDsuwRzcz4xFEDanEX/i7wba8sIGBWHe94a12Y6QCdiyM1peyEUa58IZgmxBQQTgVHGcT9jyT4y5AHLmj0gtTdUOwHIm2Hqhw9RUkSShHVupoTf21M3mx3EJORfzoNlFUzFuHzaHWYofSVR1/1aPI3nudyHdTb0NE2vqcaN/MxnOxYsgjssZbcl5+3xXbJcg/fnPfPtmcnUsF1T9+DVcFjOqB8wE1HkwCUnKUFmB5o098EMLF3Cj2F6IYFXvZgrfCGRHwUbUiwPpXBQPin3aEzwHIx/Ebj4RssdlBKAng==";

//Intentar descifrar el texto
try {
  if (cipherText.trim() !== "") {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) throw new Error("Texto vacío o clave incorrecta");

    const decryptedData = JSON.parse(decryptedText);
    console.log("Texto descifrado correctamente:", decryptedData);
  } else {
    console.log("No hay texto para descifrar");
  }
} catch (err) {
  console.warn("Error al descifrar:", (err as Error).message);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cifrar datos antes de guardarlos
  const encryptData = (data: object) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  };

  // Descifrar datos
  const decryptData = (ciphertext: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) throw new Error("Texto vacío o clave incorrecta");

      const decryptedData = JSON.parse(decryptedText);
      return decryptedData;
    } catch (error) {
      console.error("Error al descifrar:", (error as Error).message);
      return null;
    }
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const encryptedUser = localStorage.getItem("user");

    if (storedAccessToken && storedRefreshToken && encryptedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);

      const decryptedUser = decryptData(encryptedUser);
      if (decryptedUser) {
        setUser(decryptedUser);
        console.log("Usuario descifrado desde localStorage:", decryptedUser);
      }
    }

    setLoading(false);
  }, []);

  // Inicio de sesión
  const login = async (userNameOrEmail: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userNameOrEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { access, refresh } = data;
        setAccessToken(access);
        setRefreshToken(refresh);

        const decodedToken = JSON.parse(atob(access.split(".")[1]));
        const userData: User = {
          id: decodedToken.user_id,
          username: decodedToken.username,
          email: decodedToken.email,
          is_medico: decodedToken.is_medico,
          is_paciente: decodedToken.is_paciente,
          full_name: decodedToken.full_name || "",
          telefono: decodedToken.telefono,
          sexo: decodedToken.sexo,
          fecha_nacimiento: decodedToken.fecha_nacimiento,
          especialidad: decodedToken.especialidad,
          cedula_profesional: decodedToken.cedula_profesional,
        };

        const encryptedUser = encryptData(userData);
        console.log("Usuario cifrado:", encryptedUser);

        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", encryptedUser);

        setUser(userData);

        if (userData.is_medico) router.push("/medico");
        else if (userData.is_paciente) router.push("/paciente");
        else router.push("/");
      } else {
        let errorDetail = data.detail || "Credenciales no válidas";
        if (
          errorDetail.includes("No active account") ||
          errorDetail.includes("Credenciales no válidas")
        ) {
          errorDetail = "Nombre de usuario o contraseña incorrectos.";
        }
        throw new Error(errorDetail);
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cierre de sesión
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.replace("/");
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      console.warn("No hay refresh token, no se cerrará sesión automáticamente.");
      return null;
    }
    try {
      const response = await fetch("http://localhost:8000/api/auth/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const data = await response.json();
      if (response.ok) {
        setAccessToken(data.access);
        localStorage.setItem("accessToken", data.access);
        return data.access;
      } else {
        console.warn("Token expirado o inválido, pero sin cerrar sesión automáticamente.");
        return null;
      }
    } catch (error) {
      console.error("Error al refrescar token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, loading, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
