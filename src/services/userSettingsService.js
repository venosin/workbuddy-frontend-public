import axios from 'axios';

// Configura la URL base
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

export const userSettingsService = {
  // Obtener la configuración completa del usuario
  getUserSettings: async () => {
    try {
      const response = await axios.get(`${API_URL}/wb/settings`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener configuración');
    }
  },
  
  // Alias para mantener compatibilidad
  getSettings: async () => {
    return userSettingsService.getUserSettings();
  },

  // Actualizar las preferencias del usuario
  updatePreferences: async (preferences) => {
    try {
      const response = await axios.put(`${API_URL}/wb/settings/preferences`, preferences);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al actualizar preferencias');
    }
  },

  // Obtener todas las direcciones del usuario
  getAddresses: async () => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      
      // Crear headers con el token de autenticación
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      };
      
      console.log('Enviando solicitud a /wb/settings/addresses con token:', token ? 'Presente' : 'Ausente');
      
      const response = await axios.get(`${API_URL}/wb/settings/addresses`, { headers, withCredentials: true });
      console.log('Respuesta raw de addresses:', response);
      return response.data;
    } catch (error) {
      console.error('Error completo al obtener direcciones:', error);
      throw error.response ? error.response.data : new Error('Error al obtener direcciones');
    }
  },

  // Agregar una nueva dirección
  addAddress: async (addressData) => {
    try {
      const response = await axios.post(`${API_URL}/wb/settings/addresses`, addressData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al agregar dirección');
    }
  },

  // Actualizar una dirección existente
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await axios.put(`${API_URL}/wb/settings/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al actualizar dirección');
    }
  },

  // Eliminar una dirección
  deleteAddress: async (addressId) => {
    try {
      const response = await axios.delete(`${API_URL}/wb/settings/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al eliminar dirección');
    }
  }
};
