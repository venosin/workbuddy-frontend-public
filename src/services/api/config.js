// Configuración base para axios
import axios from 'axios';

// Configura la URL base de tu API aquí (ajústala según tu configuración)
// Basado en tu configuración del backend, todas las rutas comienzan con /wb/
export const API_URL = 'http://localhost:4000/wb';

// Crea una instancia de axios con la configuración básica
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 segundos
});

// Interceptores para manejar tokens de autenticación si los necesitas en el futuro
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores comunes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.status, error.response.data);
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('Error de solicitud (no hay respuesta):', error.request);
    } else {
      // Algo ocurrió al configurar la solicitud
      console.error('Error de configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
