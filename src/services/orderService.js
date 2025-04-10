import api from './api';

// Servicio específico para la creación y gestión de órdenes
const orderService = {
  // Obtener las órdenes del usuario actual con filtros y paginación
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

      const response = await api.get(`/wb/orders/user?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las órdenes del usuario:', error);
      throw error.response ? error.response.data : error;
    }
  },

  // Obtener una orden por ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/wb/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la orden ${orderId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },

  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      // Usar directamente los datos que vienen del componente OrderCheckoutPage
      // o transformarlos si es necesario
      // (formData = { CartId, payMethod, shippingAdress })
      const response = await api.post('/wb/orders', orderData);
      console.log('Respuesta al crear orden:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear la orden:', error);
      throw error.response ? error.response.data : error;
    }
  },

  // Actualizar el estado de una orden
  updateOrderStatus: async (orderId, status) => {
    try {
      // El backend espera un PUT según el controlador actualizado
      const response = await api.put(`/wb/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado de la orden ${orderId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },

  // Cancelar una orden pendiente
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`/wb/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al cancelar la orden ${orderId}:`, error);
      throw error.response ? error.response.data : error;
    }
  },

  // Formatear dirección para la creación de órdenes
  formatShippingAddress: (addressObj) => {
    // Si ya es un string, devolverlo tal cual
    if (typeof addressObj === 'string') return addressObj;

    // Si es un objeto con componentes de dirección, crear formato esperado
    if (typeof addressObj === 'object') {
      const { street, city, state, postalCode } = addressObj;
      return `${street}, ${city}, ${state}, ${postalCode}`;
    }

    return '';
  },

  // Obtener estados disponibles para las órdenes
  getOrderStatusOptions: () => {
    return [
      { value: 'pending', label: 'Pendiente' },
      { value: 'paid', label: 'Pagada' },
      { value: 'processing', label: 'En procesamiento' },
      { value: 'shipped', label: 'Enviada' },
      { value: 'delivered', label: 'Entregada' },
      { value: 'cancelled', label: 'Cancelada' }
    ];
  },

  // Obtener métodos de pago disponibles
  getPaymentMethodOptions: () => {
    return [
      { value: 'paypal', label: 'PayPal' },
      { value: 'credit_card', label: 'Tarjeta de Crédito' },
      { value: 'efectivo', label: 'Efectivo' }
    ];
  }
};

export default orderService;
