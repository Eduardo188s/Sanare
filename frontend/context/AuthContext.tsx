"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedRefreshToken && storedUser) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                //console.error("Error parsing user from localStorage:", e);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (userNameOrEmail: string, password: string) => {
        setLoading(true);
        //console.log("Access Token:", accessToken);
        try {
            const response = await fetch('http://localhost:8000/api/auth/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: userNameOrEmail, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const { access, refresh } = data;
                setAccessToken(access);
                setRefreshToken(refresh);

                const decodedToken = JSON.parse(atob(access.split('.')[1]));
                const userData: User = {
                    id: decodedToken.user_id,
                    username: decodedToken.username,
                    email: decodedToken.email,
                    is_medico: decodedToken.is_medico,
                    is_paciente: decodedToken.is_paciente,
                    full_name: decodedToken.full_name || '',
                    telefono: decodedToken.telefono,
                    sexo: decodedToken.sexo,
                    fecha_nacimiento: decodedToken.fecha_nacimiento,
                    especialidad: decodedToken.especialidad,
                    cedula_profesional: decodedToken.cedula_profesional,
                };
                setUser(userData);

                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('user', JSON.stringify(userData));

                if (userData.is_medico) {
                    router.push('/medico'); 
                } else if (userData.is_paciente) {
                    router.push('/paciente'); 
                } else {
                    router.push('/'); 
                }

            } else {
            let errorDetail = data.detail || 'Credenciales no válidas';
            
            const genericCredentialError = 'No active account found with the given credentials.';
            const drfError = 'Credenciales no válidas';
            
            if (errorDetail === genericCredentialError || errorDetail.includes(drfError)) {
                errorDetail = 'Nombre de usuario/Email o contraseña incorrectos.';
            }

            throw new Error(errorDetail); 
        }
    } catch (error) {
        
        const errorMessage = (error as Error).message || 'Error de conexión. Asegúrate de que el servidor esté activo.';

        throw new Error(errorMessage);
    } finally {
        setLoading(false);
    }
};

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        router.replace('/');
    };

    const refreshAccessToken = async () => {
        if (!refreshToken) {
            logout();
            return null;
        }
        try {
            const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });
            const data = await response.json();
            if (response.ok) {
                setAccessToken(data.access);
                localStorage.setItem('accessToken', data.access);
                return data.access;
            } else {
                //console.error('Failed to refresh token:', data);
                logout();
                return null;
            }
        } catch (error) {
            //console.error('Error refreshing token:', error);
            logout();
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
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};