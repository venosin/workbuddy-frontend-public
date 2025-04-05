import axios from 'axios';

// Configura la URL base - ajustado para tu backend
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const authService = {
  // Función para iniciar sesión
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/wb/login`, { email, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  },

  // Función para cerrar sesión
  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/wb/logout`);
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      return response.data;
    } catch (error) {
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
      const response = await axios.post(`${API_URL}/wb/registerClient/verifyCodeEmail`, { verificationCode });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el servidor');
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('userType');
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
