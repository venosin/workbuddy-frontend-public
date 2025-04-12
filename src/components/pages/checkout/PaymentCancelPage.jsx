import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaTimesCircle, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import paymentService from '../../../services/paymentService';
import notificationService from '../../../services/notificationService';

/**
 * Página que se muestra cuando un usuario cancela un pago
 */
const PaymentCancelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Estado para controlar si la cancelación se ha completado
  const [isCancelled, setIsCancelled] = useState(false);

  // Extraer el orderId del estado o de los query params
  useEffect(() => {
    const extractedOrderId = location.state?.orderId || 
                           new URLSearchParams(location.search).get('orderId');
    
    if (extractedOrderId) {
      setOrderId(extractedOrderId);
      handlePaymentCancel(extractedOrderId);
    }
  }, [location]);

  // Procesar la cancelación del pago
  const handlePaymentCancel = async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      // Registrar la cancelación en el sistema
      await paymentService.cancelPayment(id);
      setIsCancelled(true);
      
      // Mostrar notificación de pago cancelado
      notificationService.warning(
        `Has cancelado el proceso de pago para la orden #${id}. Puedes intentarlo nuevamente cuando lo desees.`,
        'Pago Cancelado'
      );
    } catch (error) {
      console.error('Error al procesar la cancelación del pago:', error);
      setError('No se pudo procesar la cancelación. El estado de su orden podría no ser exacto.');
    } finally {
      setLoading(false);
    }
  };

  // Retomar el proceso de pago
  const handleRetryPayment = () => {
    if (orderId) {
      // Mostrar notificación de reintento
      notificationService.info('Reiniciando el proceso de pago...', 'Reintento de pago');
      navigate(`/checkout/payment/${orderId}`);
    } else {
      navigate('/carrito');
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Pago cancelado</h1>
        <p className="text-gray-600">
          {isCancelled 
            ? "El pago ha sido cancelado correctamente en nuestro sistema." 
            : "Has cancelado el proceso de pago. Tu orden permanece en estado pendiente."}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <h2 className="text-lg font-medium mb-4">¿Qué deseas hacer ahora?</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4 mt-1">
              <FaCreditCard className="text-blue-500 text-xl" />
            </div>
            <div>
              <h3 className="font-medium">Intentar pagar nuevamente</h3>
              <p className="text-sm text-gray-600 mb-2">
                Puedes continuar con el proceso de pago y completar tu compra.
              </p>
              <Button 
                onClick={handleRetryPayment}
                disabled={loading}
                className="text-sm px-4 py-1"
              >
                Reintentar pago
              </Button>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4 mt-1">
              <FaShoppingCart className="text-green-500 text-xl" />
            </div>
            <div>
              <h3 className="font-medium">Volver al carrito de compras</h3>
              <p className="text-sm text-gray-600 mb-2">
                Regresa a tu carrito para revisar o modificar los productos antes de completar la compra.
              </p>
              <Link to="/cart">
                <Button 
                  variant="outline"
                  className="text-sm px-4 py-1"
                  disabled={loading}
                >
                  Ir al carrito
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>
          Si tienes problemas para completar tu compra o tienes alguna pregunta,
          por favor contacta a nuestro equipo de soporte.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
