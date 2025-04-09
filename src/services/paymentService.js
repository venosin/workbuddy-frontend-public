import api from './api';

/**
 * Servicio para manejar operaciones relacionadas con pagos
 */
const paymentService = {
  /**
   * Iniciar proceso de pago para una orden existente
   * @param {string} orderId - ID de la orden a procesar
   * @returns {Promise} - Respuesta del servidor con información de la orden preparada
   */
  initPaymentProcess: async (orderId) => {
    try {
      const response = await api.post('/wb/payment/init-payment', { orderId });
      return response.data;
    } catch (error) {
      console.error('Error al iniciar el proceso de pago:', error);
      throw error.response ? error.response.data : new Error('Error al iniciar el proceso de pago');
    }
  },

  /**
   * Crear un pago con PayPal
   * @param {string} orderId - ID de la orden
   * @returns {Promise} - Respuesta del servidor con URL de PayPal
   */
  createPayment: async (orderId) => {
    try {
      const response = await api.post('/wb/payment/create-payment', { orderId });
      return response.data;
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw error.response ? error.response.data : new Error('Error al crear el pago');
    }
  },

  /**
   * Capturar el pago después de la aprobación del usuario
   * @param {string} paypalOrderId - ID de la orden de PayPal
   * @param {string} orderId - ID de nuestra orden
   * @returns {Promise} - Respuesta del servidor con estado del pago
   */
  capturePayment: async (paypalOrderId, orderId) => {
    try {
      const response = await api.post('/wb/payment/capture-payment', { 
        paypalOrderId, 
        orderId 
      });
      return response.data;
    } catch (error) {
      console.error('Error al capturar el pago:', error);
      throw error.response ? error.response.data : new Error('Error al capturar el pago');
    }
  },

  /**
   * Cancelar un pago
   * @param {string} orderId - ID de la orden
   * @returns {Promise} - Respuesta del servidor con confirmación de cancelación
   */
  cancelPayment: async (orderId) => {
    try {
      const response = await api.post('/wb/payment/cancel-payment', { orderId });
      return response.data;
    } catch (error) {
      console.error('Error al cancelar el pago:', error);
      throw error.response ? error.response.data : new Error('Error al cancelar el pago');
    }
  },

  /**
   * Obtener el estado de un pago
   * @param {string} orderId - ID de la orden
   * @returns {Promise} - Respuesta del servidor con estado actual del pago
   */
  getPaymentStatus: async (orderId) => {
    try {
      const response = await api.get(`/wb/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el estado del pago:', error);
      throw error.response ? error.response.data : new Error('Error al obtener el estado del pago');
    }
  }
};

export default paymentService;
