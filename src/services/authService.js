import axios from 'axios';
import { normalizeUserType } from '../utils/userTypeUtils';

// Configura la URL base - ajustado para tu backend
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const authService = {
  // Función para iniciar sesión
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/wb/login`, { email, password });
      
      console.log('Respuesta del login:', response.data); // Para debug
      
      // Si la respuesta es exitosa, guardar datos importantes en localStorage
      if (response.data.token) {
        // Guardar el token en localStorage para usarlo en peticiones
        localStorage.setItem('token', response.data.token);
        
        // Extraer tipo de usuario del mensaje (formato: '{userType} login successful')
        const messageUserType = response.data.message?.split(' ')?.[0] || '';
        
        // Guardar el tipo de usuario para verificaciones locales
        const userType = normalizeUserType(response.data.userType || messageUserType || 'clients');
        const userId = response.data.userId || response.data.user?._id || '';
        
        localStorage.setItem('userType', userType);
        localStorage.setItem('userId', userId);
        
        console.log('Datos guardados en localStorage:', { token: 'TOKEN-GUARDADO', userType, userId }); // Para debug
      } else {
        console.warn('No se recibió token en la respuesta del login');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  },

  // Función para cerrar sesión
  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/wb/logout`);
      // Eliminar todos los datos de autenticación del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      console.log('Sesión cerrada, datos de autenticación eliminados');
      return response.data;
    } catch (error) {
      // Eliminar los datos incluso si hay error en el backend
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  },

  // Función para registrar un nuevo cliente
  registerClient: async (clientData) => {
    try {
      const response = await axios.post(`${API_URL}/wb/registerClient`, clientData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  },

  // Función para verificar el código de email
  verifyEmailCode: async (verificationCode) => {
    try {
      // Ruta correcta según el backend proporcionado
      const response = await axios.post(`${API_URL}/wb/registerClient/verifyCodeEmail`, { verificationCode });
      
      // Si la verificación es exitosa y recibimos un token, guardar información para autenticación automática
      if (response.data.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);
        
        // Guardar el ID del cliente
        if (response.data.client && response.data.client.id) {
          localStorage.setItem('userId', response.data.client.id);
        }
        
        // Guardar el tipo de usuario (siempre será "client" para este endpoint)
        localStorage.setItem('userType', 'clients');
        
        console.log('Login automático después de verificación:', {
          token: 'TOKEN-GUARDADO',
          userId: response.data.client?.id,
          userType: 'clients'
        });
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    
    // Verificar que existan token y userId
    const hasAuth = !!token && !!userId && !!userType;
    console.log('Estado de autenticación:', { hasAuth, hasToken: !!token, hasUserId: !!userId, hasUserType: !!userType });
    return hasAuth;
  },
  
  // Obtener datos del usuario actual
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        console.warn('No hay token o userId para obtener el perfil');
        return null;
      }
      
      // Configurar headers con el token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      // Obtener el perfil del usuario
      console.log('Solicitando perfil de usuario con token');
      const response = await axios.get(`${API_URL}/wb/profile`, config);
      console.log('Perfil obtenido en getCurrentUser:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil de usuario:', error);
      // Si hay error de autenticación, limpiar localStorage
      if (error.response && error.response.status === 401) {
        console.warn('Error 401 obteniendo perfil - limpiando credenciales');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
      }
      return null;
    }
  },

  // Obtener el tipo de usuario
  getUserType: () => {
    return localStorage.getItem('userType');
  },
  
  // Solicitar código de recuperación de contraseña
  requestPasswordRecovery: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/wb/passwordRecovery/request-code`, { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  },

  // Verificar código de recuperación
  verifyPasswordRecoveryCode: async (code) => {
    try {
      const response = await axios.post(`${API_URL}/wb/passwordRecovery/verify-code`, { code });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  },

  // Resetear contraseña
  resetPassword: async (newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/wb/passwordRecovery/reset-password`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  }
};

export default authService;
