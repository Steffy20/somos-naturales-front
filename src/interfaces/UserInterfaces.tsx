// src/interfaces/auth.ts

export interface Usuario {
    uid: string;
    nombre: string;
    correo: string;
    password: string;
    rol: 'ADMIN_ROLE' | 'WORKER_ROLE' | 'CONSUMER_ROLE'; 
    estado?: boolean;
}

export interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    login: (user: Usuario, token: string) => void;
    logout: () => void;
}