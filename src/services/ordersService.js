import axios from 'axios';

// Configura la URL base
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const ordersService = {
  // Obtener todos los pedidos
  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener pedidos');
    }
  },
  
  // Obtener todos los pedidos del usuario actual
  getUserOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/orders`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener pedidos del usuario');
    }
  },

  // Obtener detalles de un pedido específico
  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener detalles del pedido');
    }
  },

  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al crear la orden');
    }
  },
  
  // Actualizar el estado de una orden
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}`, statusData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al actualizar el estado de la orden');
    }
  },
  
  // Eliminar una orden
  deleteOrder: async (orderId) => {
    try {
      const response = await axios.delete(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al eliminar la orden');
    }
  },
  
  // Obtener conteo de pedidos por estado
  getOrdersCountByStatus: async () => {
    try {
      // Simulamos datos para desarrollo mientras se implementa el backend
      // En un entorno real, esto sería:
      // const response = await axios.get(`${API_URL}/user/orders/count-by-status`);
      // return response.data;
      
      // Simulación de datos
      return {
        total: 5,
        pendiente: 2,
        procesando: 1,
        enviado: 1,
        entregado: 1
      };
    } catch (error) {
      console.error('Error al obtener conteo de pedidos:', error);
      // Devolver valores por defecto en caso de error
      return {
        total: 0,
        pendiente: 0
      };
    }
  }
};

export default ordersService;
