import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import { BackButton } from '../../shared/ui/BackButton';
import orderService from '../../../services/orderService';

export function CheckoutPaypalPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { 
    items, 
    subtotal, 
    total, 
    discountAmount, 
    loading: cartLoading,
    clearCart,
    cartId 
  } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  useEffect(() => {
    // Si el usuario no está autenticado, redirigir a login
    if (!isAuthenticated) {
      navigate('/iniciar-sesion?redirect=checkout-paypal');
    }
    
    // Si no hay productos en el carrito, redirigir a la tienda
    if (items.length === 0 && !cartLoading) {
      navigate('/carrito');
    }
  }, [isAuthenticated, items.length, cartLoading, navigate]);
  
  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    setOrderError('');
    
    try {
      // Crear la orden con PayPal como método de pago automáticamente
      const orderData = {
        CartId: cartId,
        payMethod: 'paypal', // Siempre PayPal en esta página
        shippingAdress: user?.address || '' // Usar la dirección del usuario
      };
      
      console.log('Creando orden con PayPal:', orderData);
      const result = await orderService.createOrder(orderData);
      
      if (result && result.order && result.order._id) {
        // Limpiamos el carrito después de crear la orden exitosamente
        await clearCart();
        
        setOrderSuccess(true);
        setOrderId(result.order._id);
        
        // Redirigir a la página de pago de PayPal
        setTimeout(() => {
          navigate(`/checkout/payment/${result.order._id}`);
        }, 1000);
      } else {
        setOrderError('No se pudo procesar la orden. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al crear la orden:', error);
      setOrderError('Ocurrió un error al procesar tu pedido. Por favor intenta más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Si se está enviando el formulario o si se ha creado la orden exitosamente
  if (isSubmitting || orderSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-brown-50">
        <Navbar />
        
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
            {isSubmitting && !orderSuccess && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <h2 className="mt-4 text-xl font-semibold text-brown-900">Procesando tu orden</h2>
                <p className="mt-2 text-gray-600">Estamos procesando tu orden, por favor espera un momento...</p>
              </div>
            )}
            
            {orderSuccess && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.32 21.97a.546.546 0 0 1-.26-.32c-.03-.15-.09-.26-.08-.21.08.65.194.75.304.06.105.105.21.105.37.01L8.32 21.97zm3.71.92c-.2-.25-.2-.38-.2-.7 0 .05-.01.11-.01.1-.2.36-.05.54.19.83.236.3.3.35.35.3l-.33-.54V22.9l-.01-.01z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-brown-900">¡Orden creada con éxito!</h2>
                <p className="mt-2 text-gray-600">Redirigiendo a la página de pago con PayPal...</p>
                <p className="mt-1 text-sm text-gray-500">Número de orden: {orderId}</p>
              </div>
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-brown-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-4">
          <BackButton className="text-brown-600 hover:text-brown-800" label="Volver al carrito" toPath="/carrito" />
        </div>
        
        <h1 className="text-2xl font-bold text-brown-900 mb-6">Pago con PayPal</h1>
        
        {orderError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{orderError}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Información de pago */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg mb-6">
                <svg className="h-12 w-12 text-blue-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.32 21.97a.546.546 0 0 1-.26-.32c-.03-.15-.09-.26-.08-.21.08.65.194.75.304.06.105.105.21.105.37.01L8.32 21.97zm3.71.92c-.2-.25-.2-.38-.2-.7 0 .05-.01.11-.01.1-.2.36-.05.54.19.83.236.3.3.35.35.3l-.33-.54V22.9l-.01-.01zm-7.4-.62c-.6.18-.2.36.58.37h.03c.5.13.13.63.1.52 0 0 .3.38.78.28.48-.1.3-.18.3-.18s.3-.3.17-.27c-.13.03-.4.88.2.8.64-.1.58.13.62.1.2.65.49.11.49.1L8.79 22c.37-.1.83-.56.82-.81.04.1.07.22.2.44" />
                </svg>
                <div>
                  <h2 className="text-xl font-semibold text-blue-800">Pago seguro con PayPal</h2>
                  <p className="text-blue-600">Paga de forma segura usando tu cuenta de PayPal</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Dirección de envío</h3>
                <div className="p-4 border rounded-md bg-gray-50">
                  <p className="text-gray-700">{user?.address || "No has configurado una dirección de envío"}</p>
                </div>
                {!user?.address && (
                  <p className="mt-2 text-sm text-red-600">
                    Para continuar, debes agregar una dirección de envío en tu perfil.
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">¿Cómo funciona?</h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3">1</span>
                    <p>Al hacer clic en "Continuar a PayPal", crearemos tu orden.</p>
                  </li>
                  <li className="flex">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3">2</span>
                    <p>Serás redirigido a PayPal para completar el pago de forma segura.</p>
                  </li>
                  <li className="flex">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3">3</span>
                    <p>Una vez completado el pago, serás redirigido de vuelta a nuestra tienda.</p>
                  </li>
                </ol>
              </div>
              
              <button
                onClick={handleCreateOrder}
                disabled={isSubmitting || !user?.address}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Procesando...' : 'Continuar a PayPal'}
              </button>
            </div>
          </div>
          
          {/* Resumen de la compra */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-lg font-medium text-brown-900 mb-4">Resumen de tu pedido</h2>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="py-2 flex">
                      <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-center object-cover" 
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-brown-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">${subtotal.toFixed(2)}</p>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <p>Descuento</p>
                    <p className="font-medium">-${discountAmount.toFixed(2)}</p>
                  </div>
                )}
                
                <div className="flex justify-between text-base font-medium text-brown-900 pt-2">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
