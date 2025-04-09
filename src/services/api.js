import axios from 'axios';

// Configura la URL base (asegúrate de que esto coincida con tu backend)
const API_URL = 'http://localhost:4000';

// Crear una instancia de axios con configuración personalizada
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Para enviar cookies en las solicitudes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para solicitudes
api.interceptors.request.use(
  (config) => {
    // Puedes agregar tokens de autenticación aquí si es necesario
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

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // El servidor respondió con un código de estado diferente de 2xx
      console.error('Error de respuesta:', error.response.status, error.response.data);
      
      // Manejo de errores de autenticación (401)
      if (error.response.status === 401) {
        // Redirigir a la página de login o limpiar el estado de autenticación
        localStorage.removeItem('token');
        // Si tienes acceso al router, podrías hacer una redirección
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('Error de solicitud:', error.request);
    } else {
      // Algo ocurrió durante la configuración de la solicitud
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
