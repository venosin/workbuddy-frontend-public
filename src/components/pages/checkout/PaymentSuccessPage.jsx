import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaUser } from 'react-icons/fa';
import orderService from '../../../services/orderService';
import paymentService from '../../../services/paymentService';
import notificationService from '../../../services/notificationService';

/**
 * Página de éxito después de completar un pago
 */
const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Procesar el retorno de PayPal y obtener datos de la orden
  useEffect(() => {
    const completePayment = async () => {
      try {
        setLoading(true);
        
        // Obtener los parámetros de la URL (token/PayerID de PayPal)
        const urlParams = new URLSearchParams(location.search);
        console.log('Parámetros URL de PayPal:', Object.fromEntries(urlParams));
        
        // Obtener orderId del localStorage (guardado antes de redirigir a PayPal)
        const orderId = localStorage.getItem('currentOrderId');
        console.log('ID de orden recuperado:', orderId);
        
        if (!orderId) {
          throw new Error('No se encontró el ID de la orden');
        }
        
        // Si hay parámetros de PayPal, procesar el pago
        if (urlParams.has('token') || urlParams.has('paymentId') || urlParams.has('orderID')) {
          console.log('Detectados parámetros de retorno de PayPal, procesando pago...');
          try {
            const result = await paymentService.processPayPalReturn(urlParams, orderId);
            console.log('Pago procesado correctamente', result);
            notificationService.paymentCompleted(orderId);
          } catch (captureError) {
            console.error('Error al capturar el pago:', captureError);
            // Continuamos para mostrar al menos los detalles de la orden
          }
        }
        
        // Cargar los detalles de la orden actualizada
        const orderData = await orderService.getOrderById(orderId);
        console.log('Datos de la orden cargados:', orderData);
        setOrder(orderData);
        
        // Limpiar el orderId de localStorage ya que ya no lo necesitamos
        localStorage.removeItem('currentOrderId');
        
        // Redirigir a la página de órdenes después de 2 segundos
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
        
      } catch (error) {
        console.error('Error en el proceso de pago:', error);
        setError('No se pudo completar el proceso de pago. Por favor, contacte con soporte.');
        notificationService.paymentError(error?.message || 'Error al completar el pago');
      } finally {
        setLoading(false);
      }
    };

    completePayment();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Cargando detalles de su pedido...</p>
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
          onClick={() => navigate('/profile/orders')}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          Ver mis pedidos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">¡Pago completado con éxito!</h1>
        <p className="text-gray-600">
          Gracias por tu compra. Tu pedido ha sido procesado y está en camino.
        </p>
      </div>

      {order && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Detalles del pedido</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600 mb-1">Número de orden:</p>
              <p className="font-medium">{order._id}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Estado:</p>
              <p className="font-medium">
                <span className="inline-block px-2 py-1 rounded-full text-xs text-white bg-green-500">
                  {order.status === 'pending' ? 'Pendiente' :
                  order.status === 'paid' ? 'Pagada' :
                  order.status === 'processing' ? 'En proceso' :
                  order.status === 'shipped' ? 'Enviada' :
                  order.status === 'delivered' ? 'Entregada' : 'Procesada'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Fecha:</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('es-SV', {
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Total:</p>
              <p className="font-medium">${order.totalAmount?.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Información de pago</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Método:</p>
                <p className="font-medium">
                  {order.paymentInfo?.method === 'paypal' ? 'PayPal' :
                  order.paymentInfo?.method === 'credit_card' ? 'Tarjeta de crédito' :
                  order.paymentInfo?.method === 'efectivo' ? 'Efectivo' : 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Estado del pago:</p>
                <p className="font-medium">
                  {order.paymentInfo?.status === 'pending' ? 'Pendiente' :
                  order.paymentInfo?.status === 'completed' ? 'Completado' :
                  order.paymentInfo?.status === 'failed' ? 'Fallido' :
                  order.paymentInfo?.status === 'refunded' ? 'Reembolsado' : 'No especificado'}
                </p>
              </div>
            </div>
          </div>
          
          {order.shippingAddress && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Dirección de envío</h3>
              <p className="text-gray-700">
                {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}`}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
        <Link to="/orders" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300 flex items-center justify-center">
          <FaUser className="mr-2" />
          Ver mis pedidos
        </Link>
        <Link to="/tienda" className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded transition duration-300 flex items-center justify-center">
          <FaShoppingBag className="mr-2" />
          Continuar comprando
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
