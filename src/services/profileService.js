import axios from 'axios';
import api from './api';

// Configura la URL base
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const profileService = {
  // Obtener información del perfil del usuario actual
  getUserProfile: async () => {
    try {
      // Ajustado a la ruta del controlador de perfil (basado en las rutas del backend)
      const response = await axios.get(`${API_URL}/wb/profile`);
      console.log('Perfil obtenido correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error.response ? error.response.data : new Error('Error al obtener perfil');
    }
  },

  // Actualizar información del perfil
  updateUserProfile: async (profileData) => {
    try {
      // Si estamos enviando una imagen, necesitamos usar FormData
      if (profileData instanceof FormData) {
        const response = await axios.put(`${API_URL}/wb/profile`, profileData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Si solo son datos regulares
        const response = await axios.put(`${API_URL}/wb/profile`, profileData);
        return response.data;
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al actualizar perfil');
    }
  },

  // Función auxiliar para preparar FormData con la imagen de perfil
  prepareProfileUpdateWithImage: (profileData, imageFile) => {
    const formData = new FormData();
    
    // Agregar datos básicos del perfil
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.phoneNumber) formData.append('phoneNumber', profileData.phoneNumber);
    if (profileData.address) formData.append('address', profileData.address);
    
    // Agregar la imagen
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }
    
    return formData;
  },

  // ------ Métodos relacionados con órdenes ------

  // Obtener las órdenes del usuario con opciones de filtrado y paginación
  getUserOrders: async (filters = {}) => {
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      
      // Añadir filtros si están presentes
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.page) params.append('page', filters.page);

      const response = await api.get(`/wb/profile/orders?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo órdenes del usuario:', error);
      throw error.response ? error.response.data : new Error('Error al obtener órdenes');
    }
  },

  // Obtener una orden específica por su ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/wb/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo orden ${orderId}:`, error);
      throw error.response ? error.response.data : new Error('Error al obtener la orden');
    }
  },

  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/wb/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creando orden:', error);
      throw error.response ? error.response.data : new Error('Error al crear la orden');
    }
  },

  // Actualizar el estado de una orden
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/wb/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error actualizando estado de orden ${orderId}:`, error);
      throw error.response ? error.response.data : new Error('Error al actualizar estado de la orden');
    }
  },

  // Cancelar una orden (solo disponible para órdenes pendientes)
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`/wb/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelando orden ${orderId}:`, error);
      throw error.response ? error.response.data : new Error('Error al cancelar la orden');
    }
  }
};

export default profileService;
