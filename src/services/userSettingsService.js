import axios from 'axios';

// Configura la URL base
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const userSettingsService = {
  // Obtener la configuración completa del usuario
  getSettings: async () => {
    try {
      const response = await axios.get(`${API_URL}/wb/settings`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener configuración');
    }
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
      const response = await axios.get(`${API_URL}/wb/settings/addresses`);
      return response.data;
    } catch (error) {
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

export default userSettingsService;
