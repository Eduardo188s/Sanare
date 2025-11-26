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
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
  refreshAccessToken: () => Promise<string | null>;
}

const SECRET_KEY = "clave_123";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const encryptData = (data: object) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  };

  const decryptData = (ciphertext: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) return null;

      const decryptedData = JSON.parse(decryptedText);
      return decryptedData;
    } catch {
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
      if (decryptedUser) setUser(decryptedUser);
    }

    setLoading(false);
  }, []);

  const login = async (userNameOrEmail: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userNameOrEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorDetail = data.detail || "Credenciales no válidas";
        if (errorDetail.includes("No active account") || errorDetail.includes("Credenciales no válidas")) {
          errorDetail = "Nombre de usuario o contraseña incorrectos.";
        }
        return { success: false, message: errorDetail };
      }

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
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", encryptedUser);

      setUser(userData);

      if (userData.is_medico) router.push("/medico");
      else if (userData.is_paciente) router.push("/paciente");
      else router.push("/");

      return { success: true };
    } catch (error) {
      return { success: false, message: "Error desconocido al iniciar sesión." };
    } finally {
      setLoading(false);
    }
  };

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
    if (!refreshToken) return null;
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
        return null;
      }
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
