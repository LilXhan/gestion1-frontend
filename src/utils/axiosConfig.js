import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Ruta base de la API

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Interceptor para agregar el token a las solicitudes
axiosInstance.interceptors.request.use(
    (config) => {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        
        // Si hay un token, lo agregamos al header de la solicitud
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para convertir las rutas relativas en URLs completas
axiosInstance.interceptors.response.use(
    (response) => {
        // Verificar si la respuesta contiene datos y si son de tipo objeto
        if (response.data && typeof response.data === 'object') {
            for (const key in response.data) {
                const value = response.data[key];
                
                // Solo modificar valores que sean cadenas de texto
                if (typeof value === 'string') {
                    // Si la URL comienza con /media/, la completamos con BASE_URL
                    if (value.startsWith('/media/')) {
                        response.data[key] = `${BASE_URL}${value}`;
                    } 
                    // Si la URL comienza con /api/, no la modificamos
                    else if (value.startsWith('/api/')) {
                        // No hacemos nada, ya está completa con BASE_URL
                        continue;
                    }
                }
            }
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
