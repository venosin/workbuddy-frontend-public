// Este servicio actúa como un puente entre la lógica de negocio y el contexto de notificaciones
// Permite mostrar notificaciones desde cualquier parte de la aplicación sin necesidad de acceder directamente al contexto

let notificationContext = null;

// Esta función será llamada por el componente App para proporcionar acceso al contexto
export const initNotificationService = (context) => {
  notificationContext = context;
};

const notificationService = {
  /**
   * Muestra una notificación de éxito
   * @param {string} message - Mensaje de la notificación
   * @param {string} title - Título opcional de la notificación
   */
  success: (message, title = 'Éxito') => {
    if (!notificationContext) return;
    return notificationContext.showSuccess(message, title);
  },

  /**
   * Muestra una notificación de error
   * @param {string} message - Mensaje de error
   * @param {string} title - Título opcional del error
   */
  error: (message, title = 'Error') => {
    if (!notificationContext) return;
    return notificationContext.showError(message, title);
  },

  /**
   * Muestra una notificación informativa
   * @param {string} message - Mensaje informativo
   * @param {string} title - Título opcional
   */
  info: (message, title = 'Información') => {
    if (!notificationContext) return;
    return notificationContext.showInfo(message, title);
  },

  /**
   * Muestra una notificación de advertencia
   * @param {string} message - Mensaje de advertencia
   * @param {string} title - Título opcional
   */
  warning: (message, title = 'Advertencia') => {
    if (!notificationContext) return;
    return notificationContext.showWarning(message, title);
  },

  /**
   * Muestra una notificación de pago completado
   */
  paymentCompleted: (orderId) => {
    return notificationService.success(
      `Tu pago para la orden #${orderId} ha sido procesado correctamente.`,
      '¡Pago Completado!'
    );
  },

  /**
   * Muestra una notificación de actualización de estado de pedido
   */
  orderStatusUpdated: (orderId, status) => {
    const statusMessages = {
      "processing": "¡Tu pedido está siendo procesado!",
      "shipped": "¡Tu pedido ha sido enviado!",
      "delivered": "¡Tu pedido ha sido entregado!",
      "cancelled": "Tu pedido ha sido cancelado",
      "paid": "¡Pago recibido! Tu pedido está siendo procesado"
    };

    const message = `El estado de tu pedido #${orderId} ha cambiado a: ${statusMessages[status] || status}`;
    return notificationService.info(message, 'Actualización de Pedido');
  },

  /**
   * Muestra una notificación de error en el pago
   */
  paymentError: (message) => {
    return notificationService.error(
      message || 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.',
      'Error de Pago'
    );
  }
};

export default notificationService;
