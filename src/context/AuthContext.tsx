import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthContextType, Usuario } from '../interfaces/UserInterfaces';
import SomosNaturales from '../api/somosNaturalesApi';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    const [status, setStatus] = useState<'checking' | 'authenticated' | 'not-authenticated'>('checking');
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    const checkAuthToken = async () => {
        const token = localStorage.getItem('x-token');

        if (!token) return setStatus('not-authenticated');

        try {
            const { data } = await SomosNaturales.get('/auth/renew');
            const { usuario: userDB, token: newToken } = data;

            localStorage.setItem('x-token', newToken);
            setUsuario(userDB);
            setStatus('authenticated');
        } catch (error) {
            localStorage.removeItem('x-token');
            setStatus('not-authenticated');
        }
    };

    useEffect(() => {
        checkAuthToken();
    }, []);

    const login = (user: Usuario, token: string) => {
        localStorage.setItem('x-token', token);
        setUsuario(user);
        setStatus('authenticated');
    };

    const logout = () => {
        localStorage.removeItem('x-token');
        setUsuario(null);
        setStatus('not-authenticated');
    };

    return (
        <AuthContext.Provider value={{ 
            status, 
            usuario, 
            token: localStorage.getItem('x-token'), 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};