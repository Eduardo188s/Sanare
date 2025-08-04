"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Define la interfaz para el usuario en el contexto
interface User {
    id: number;
    username: string;
    email: string;
    is_medico: boolean;
    is_paciente: boolean;
    full_name: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
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
                console.error("Error parsing user from localStorage:", e);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/auth/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
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
                };
                setUser(userData);

                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                localStorage.setItem('user', JSON.stringify(userData));

                // Redirección a la página principal de cada rol
                if (userData.is_medico) {
                    router.push('/medico'); 
                } else if (userData.is_paciente) {
                    router.push('/paciente'); 
                } else {
                    // Si no tiene un rol específico, puedes redirigirlo a una página general o de inicio
                    router.push('/'); 
                }

            } else {
                console.error('Login failed:', data);
                throw new Error(data.detail || 'Error de inicio de sesión');
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
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
        router.push('/login');
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
                console.error('Failed to refresh token:', data);
                logout();
                return null;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
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