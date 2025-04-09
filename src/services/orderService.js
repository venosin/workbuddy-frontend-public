import api from './api';

// Servicio específico para la creación y gestión de nuevas órdenes
// Note: Este servicio complementa a ordersService.js existente
const orderService = {
  // Obtener todas las órdenes del usuario actual
  getUserOrders: async () => {
    try {
      const response = await api.get('/wb/orders/user');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las órdenes del usuario:', error);
      throw error;
    }
  },

  // Obtener una orden por ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/wb/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la orden ${orderId}:`, error);
      throw error;
    }
  },

  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/wb/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la orden:', error);
      throw error;
    }
  },

  // Actualizar el estado de una orden
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/wb/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado de la orden ${orderId}:`, error);
      throw error;
    }
  },

  // Cancelar una orden pendiente
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`/wb/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al cancelar la orden ${orderId}:`, error);
      throw error;
    }
  }
};

export default orderService;
