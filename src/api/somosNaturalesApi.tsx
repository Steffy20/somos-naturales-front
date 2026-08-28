import axios from 'axios';

const SomosNaturales = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Interceptor para añadir el token
SomosNaturales.interceptors.request.use( config => {
    const token = localStorage.getItem('x-token');
    if ( token ) {
        config.headers['x-token'] = token;
    }
    return config;
});

export default SomosNaturales;