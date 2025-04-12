import api from './api';

/**
 * Servicio para manejar operaciones relacionadas con pagos a través de PayPal
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
      console.log('Respuesta de inicialización de pago:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al iniciar el proceso de pago:', error);
      throw error.response ? error.response.data : new Error('Error al iniciar el proceso de pago');
    }
  },

  /**
   * Crear un pago con PayPal
   * @param {string} orderId - ID de la orden
   * @returns {Promise} - Respuesta del servidor con URL de PayPal para completar el pago
   */
  createPayment: async (orderId) => {
    try {
      const response = await api.post('/wb/payment/create-payment', { orderId });
      console.log('Respuesta de creación de pago PayPal:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear el pago con PayPal:', error);
      throw error.response ? error.response.data : new Error('Error al crear el pago con PayPal');
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
      console.log('Intentando capturar pago:', { paypalOrderId, orderId });
      const response = await api.post('/wb/payment/capture-payment', { 
        paypalOrderId, 
        orderId 
      });
      console.log('Respuesta de captura de pago:', response.data);
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
      console.log('Respuesta de cancelación de pago:', response.data);
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
      console.log('Estado de pago obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el estado del pago:', error);
      throw error.response ? error.response.data : new Error('Error al obtener el estado del pago');
    }
  },

  /**
   * Procesar el retorno de PayPal después de una transacción exitosa
   * @param {Object} urlParams - Parámetros de URL del retorno de PayPal
   * @param {string} orderId - ID de nuestra orden
   * @returns {Promise} - Resultado del proceso de captura
   */
  processPayPalReturn: async (urlParams, orderId) => {
    try {
      console.log('Procesando retorno de PayPal. Parámetros URL:', {
        urlParamsEntries: Array.from(urlParams.entries()),
        orderId
      });
      
      // Extraer todos los posibles identificadores que PayPal podría enviar
      const paypalOrderId = urlParams.get('token') || urlParams.get('paymentId') || urlParams.get('orderID');
      const payerId = urlParams.get('PayerID');
      
      console.log('IDs extraídos:', { paypalOrderId, payerId });
      
      if (!paypalOrderId) {
        throw new Error('No se encontró el ID de orden de PayPal en la URL de retorno');
      }
      
      // Verificar que tengamos un ID de orden válido
      if (!orderId) {
        throw new Error('ID de orden no proporcionado para capturar el pago');
      }
      
      // Capturar el pago con el ID de PayPal y nuestro ID de orden
      console.log('Intentando capturar pago con:', { paypalOrderId, orderId });
      const result = await paymentService.capturePayment(paypalOrderId, orderId);
      console.log('Resultado de captura de pago:', result);
      return result;
    } catch (error) {
      console.error('Error al procesar el retorno de PayPal:', error);
      // Registrar más detalles sobre el error para diagnóstico
      if (error.response) {
        console.error('Detalles de respuesta de error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  },

  /**
   * Verificar si un método de pago está disponible (por ejemplo, PayPal)
   * @param {string} method - Método de pago a verificar
   * @returns {boolean} - true si el método está disponible
   */
  isPaymentMethodAvailable: (method) => {
    const availableMethods = ['paypal', 'credit_card', 'efectivo'];
    return availableMethods.includes(method);
  },

  /**
   * Obtener opciones de métodos de pago disponibles
   * @returns {Array} - Array de objetos {value, label} con los métodos disponibles
   */
  getPaymentMethodOptions: () => {
    return [
      { value: 'paypal', label: 'PayPal', icon: 'paypal' },
      { value: 'credit_card', label: 'Tarjeta de Crédito', icon: 'credit-card' },
      { value: 'efectivo', label: 'Efectivo (pago al recibir)', icon: 'cash' }
    ];
  },
  
  /**
   * Obtener un objeto de información sobre el método de pago
   * @param {string} method - Método de pago
   * @returns {Object} - Información del método de pago
   */
  getPaymentMethodInfo: (method) => {
    const methods = {
      paypal: {
        name: 'PayPal',
        icon: 'paypal',
        description: 'Pago seguro a través de PayPal',
        processingTime: 'Inmediato'
      },
      credit_card: {
        name: 'Tarjeta de Crédito',
        icon: 'credit-card',
        description: 'Pago con tarjeta de crédito o débito',
        processingTime: 'Inmediato'
      },
      efectivo: {
        name: 'Efectivo',
        icon: 'cash',
        description: 'Pago en efectivo al recibir el pedido',
        processingTime: 'Al momento de la entrega'
      }
    };
    
    return methods[method] || {
      name: 'Método desconocido',
      icon: 'question',
      description: 'Información no disponible',
      processingTime: 'No especificado'
    };
  }
};

export default paymentService;
