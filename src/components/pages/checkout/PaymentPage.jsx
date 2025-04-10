import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import orderService from '../../../services/orderService';
import paymentService from '../../../services/paymentService';

/**
 * Página de pago que integra PayPal para procesar pagos de órdenes
 */
const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  // Estado para guardar el ID de orden de PayPal cuando se crea el pago
  const [, setPaypalOrderId] = useState(null); // Usamos solo el setter
  
  // Manejar el retorno desde PayPal (usando useCallback para evitar dependencias circulares)
  const handlePayPalReturn = useCallback(async () => {
    try {
      setLoading(true);
      const result = await paymentService.processPayPalReturn(searchParams, orderId);
      
      if (result.status === 'COMPLETED') {
        setPaymentStatus('completed');
        // Redirigir a la página de éxito después de un breve delay
        setTimeout(() => {
          navigate('/checkout/success', { 
            state: { 
              orderId, 
              paymentMethod: 'paypal',
              status: result.status
            } 
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error al procesar el retorno de PayPal:', error);
      setError('Error al completar el pago. Por favor, contacte con soporte.');
    } finally {
      setLoading(false);
    }
  }, [searchParams, orderId, navigate]);
  
  // Verificar si venimos de una redirección de PayPal
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && orderId) {
      handlePayPalReturn();
    }
  }, [orderId, searchParams, handlePayPalReturn]);
  
  // Cargar datos de la orden
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        // Inicializar el proceso de pago si es necesario
        await paymentService.initPaymentProcess(orderId);
        
        // Obtener datos de la orden
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
        
        // Verificar estado del pago
        const paymentData = await paymentService.getPaymentStatus(orderId);
        setPaymentStatus(paymentData.paymentStatus);
        
      } catch (error) {
        console.error('Error al cargar datos de pago:', error);
        setError(error.message || 'Error al cargar la información de pago');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderData();
  }, [orderId]);
  
  // Iniciar pago con PayPal
  const handlePayPalPayment = async () => {
    try {
      setLoading(true);
      const paymentData = await paymentService.createPayment(orderId);
      
      if (paymentData.approveUrl) {
        // Guardar el ID de la orden de PayPal
        setPaypalOrderId(paymentData.id);
        // Redirigir al usuario a PayPal para completar el pago
        window.location.href = paymentData.approveUrl;
      } else {
        throw new Error('No se pudo obtener el enlace de pago de PayPal');
      }
    } catch (error) {
      console.error('Error al iniciar pago con PayPal:', error);
      setError(error.message || 'Error al iniciar el pago con PayPal');
      setLoading(false);
    }
  };
  
  // Cancelar el pago
  const handleCancelPayment = async () => {
    try {
      setLoading(true);
      await paymentService.cancelPayment(orderId);
      // Redirigir al carrito de compras o página anterior
      navigate('/cart');
    } catch (error) {
      console.error('Error al cancelar el pago:', error);
      setError(error.message || 'Error al cancelar el pago');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Procesando información de pago...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/cart')}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          Volver al carrito
        </button>
      </div>
    );
  }
  
  if (paymentStatus === 'completed') {
    return (
      <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <Alert type="success" message="¡Pago completado con éxito!" />
        <p className="mt-4 text-center">Redirigiendo a la página de confirmación...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Finalizar compra</h1>
      
      {order && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Resumen de la orden</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2"><strong>Orden #:</strong> {order._id}</p>
            <p className="mb-2"><strong>Total:</strong> ${order.totalAmount?.toFixed(2)}</p>
            <p className="mb-2">
              <strong>Estado:</strong> {
                order.status === 'pending' ? 'Pendiente' :
                order.status === 'paid' ? 'Pagada' :
                order.status === 'processing' ? 'En proceso' :
                order.status === 'shipped' ? 'Enviada' :
                order.status === 'delivered' ? 'Entregada' :
                order.status === 'cancelled' ? 'Cancelada' : 'Desconocido'
              }
            </p>
            <p className="mb-2">
              <strong>Método de pago:</strong> {
                order.paymentInfo?.method === 'paypal' ? 'PayPal' :
                order.paymentInfo?.method === 'credit_card' ? 'Tarjeta de crédito' :
                order.paymentInfo?.method === 'efectivo' ? 'Efectivo' : 'No seleccionado'
              }
            </p>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Métodos de pago</h2>
        
        {/* Opciones de pago */}
        <div className="space-y-4">
          {/* PayPal */}
          <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="h-10 w-16 mr-4">
                  <img 
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                    alt="PayPal" 
                    className="h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium">PayPal</h3>
                  <p className="text-sm text-gray-500">Pago seguro a través de PayPal</p>
                </div>
              </div>
              <button 
                onClick={handlePayPalPayment}
                disabled={loading || paymentStatus === 'completed'}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pagar con PayPal
              </button>
            </div>
          </div>
          
          {/* Opción para cancelar */}
          <div className="text-center mt-6">
            <button
              onClick={handleCancelPayment}
              className="text-red-500 hover:text-red-700 underline"
              disabled={loading}
            >
              Cancelar compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
