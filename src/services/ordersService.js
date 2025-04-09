import api from './api';

// Servicio para gestionar órdenes (pedidos)
const ordersService = {
  // Obtener todos los pedidos (admin)
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error.response ? error.response.data : new Error('Error al obtener pedidos');
    }
  },
  
  // Obtener todos los pedidos del usuario actual
  getUserOrders: async () => {
    try {
      const response = await api.get('/wb/orders/user');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos del usuario:', error);
      throw error.response ? error.response.data : new Error('Error al obtener pedidos del usuario');
    }
  },

  // Obtener detalles de un pedido específico
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles del pedido:', error);
      throw error.response ? error.response.data : new Error('Error al obtener detalles del pedido');
    }
  },

  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la orden:', error);
      throw error.response ? error.response.data : new Error('Error al crear la orden');
    }
  },
  
  // Actualizar el estado de una orden
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await api.put(`/orders/${orderId}`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
      throw error.response ? error.response.data : new Error('Error al actualizar el estado de la orden');
    }
  },
  
  // Eliminar una orden
  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
      throw error.response ? error.response.data : new Error('Error al eliminar la orden');
    }
  }
};

export default ordersService;
