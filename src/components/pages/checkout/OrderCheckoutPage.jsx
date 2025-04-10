import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import { BackButton } from '../../shared/ui/BackButton';
import orderService from '../../../services/orderService';

export function OrderCheckoutPage() {
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
  
  const [formData, setFormData] = useState({
    shippingAdress: user?.address || '',
    payMethod: 'tarjeta'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  useEffect(() => {
    // Si el usuario no está autenticado, redirigir a login
    if (!isAuthenticated) {
      navigate('/iniciar-sesion?redirect=checkout');
    }
    
    // Si no hay productos en el carrito, redirigir a la tienda
    if (items.length === 0 && !cartLoading) {
      navigate('/carrito');
    }
  }, [isAuthenticated, items.length, cartLoading, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.shippingAdress.trim()) {
      newErrors.shippingAdress = 'La dirección de envío es obligatoria';
    }
    
    if (!formData.payMethod) {
      newErrors.payMethod = 'Selecciona un método de pago';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setOrderError('');
    
    try {
      // Crear la orden con los datos del formulario
      const orderData = {
        CartId: cartId, // ID del carrito actual
        payMethod: formData.payMethod,
        shippingAdress: formData.shippingAdress
      };
      
      const result = await orderService.createOrder(orderData);
      
      if (result && result.order && result.order._id) {
        // Limpiamos el carrito después de crear la orden exitosamente
        await clearCart();
        
        setOrderSuccess(true);
        setOrderId(result.order._id);
        
        // Si el método de pago es PayPal, redirigir a la página de pago de PayPal
        if (formData.payMethod === 'paypal') {
          setTimeout(() => {
            navigate(`/checkout/payment/${result.order._id}`);
          }, 1000);
        } else {
          // Para otros métodos de pago, ir a la confirmación directamente
          setTimeout(() => {
            navigate(`/pedido-confirmado/${result.order._id}`);
          }, 1000);
        }
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                <h2 className="mt-4 text-xl font-semibold text-brown-900">Procesando tu orden</h2>
                <p className="mt-2 text-gray-600">Estamos procesando tu orden, por favor espera un momento...</p>
              </div>
            )}
            
            {orderSuccess && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-brown-900">¡Orden creada con éxito!</h2>
                <p className="mt-2 text-gray-600">Tu orden ha sido creada. Redirigiendo a la página de confirmación...</p>
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
        
        <h1 className="text-2xl font-bold text-brown-900 mb-6">Finalizar Compra</h1>
        
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
          {/* Formulario de checkout */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Información de envío</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Dirección de envío */}
                <div className="mb-4">
                  <label htmlFor="shippingAdress" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de envío
                  </label>
                  <textarea
                    id="shippingAdress"
                    name="shippingAdress"
                    value={formData.shippingAdress}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.shippingAdress ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Calle, número, colonia, ciudad, estado, código postal"
                  ></textarea>
                  {errors.shippingAdress && (
                    <p className="mt-1 text-sm text-red-600">{errors.shippingAdress}</p>
                  )}
                </div>
                
                {/* Método de pago */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de pago
                  </label>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payMethod"
                        value="tarjeta"
                        checked={formData.payMethod === 'tarjeta'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <CreditCard className="ml-3 h-5 w-5 text-green-500" />
                      <span className="ml-2">Tarjeta de crédito/débito</span>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 bg-blue-50 border-blue-200">
                      <input
                        type="radio"
                        name="payMethod"
                        value="paypal"
                        checked={formData.payMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <svg className="ml-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.32 21.97a.546.546 0 0 1-.26-.32c-.03-.15-.09-.26-.08-.21.08.65.194.75.304.06.105.105.21.105.37.01L8.32 21.97zm3.71.92c-.2-.25-.2-.38-.2-.7 0 .05-.01.11-.01.1-.2.36-.05.54.19.83.236.3.3.35.35.3l-.33-.54V22.9l-.01-.01zm-7.4-.62c-.6.18-.2.36.58.37h.03c.5.13.13.63.1.52 0 0 .3.38.78.28.48-.1.3-.18.3-.18s.3-.3.17-.27c-.13.03-.4.88.2.8.64-.1.58.13.62.1.2.65.49.11.49.1L8.79 22c.37-.1.83-.56.82-.81.04.1.07.22.2.44.3.1.57.36.58.37.1.1.22.17.34.23.1.06.22.1.33.14.11.04.22.07.34.09.12.03.23.04.35.05.1 0 .21 0 .31-.01.28-.04.55-.1.79-.24.24-.1.47-.27.66-.47.2-.19.36-.42.49-.67.13-.25.23-.52.29-.8 0-.01 0-.02.01-.03.1.82.22 1.5.35 1.82.4.1.8.17.12.23.3.05.7.09.1.14.4.5.7.1.11.15.1.14.17.28.25.41.2.4.7.9.4.14-.3.05-.9.08-.12.1-.3.03-.06.05-.09.09-.3.04-.05.09-.06.14-.1.17.03.4.2.51.1.07.22.12.35.14.13.02.26.02.39 0 .12-.02.25-.06.36-.11.11-.05.22-.12.3-.21 .2-.19.29-.46.27-.72-.01-.12-.04-.23-.08-.34-.04-.1-.09-.2-.15-.28-.06-.08-.11-.17-.13-.27-.04-.2.03-.39.2-.51.18-.12.4-.18.62-.18.19 0 .37.03.55.08.17.04.33.09.49.15.15.05.29.12.42.21.09.06.19.13.28.21.04.04.08.1.12.15.3.05.6.1.1.16.04.3.9.05.14.06.1 0 .18-.02.25-.08.19-.16.22-.42.12-.65-.08-.15-.21-.28-.36-.39-.15-.1-.31-.19-.48-.26l-.02-.01c-.01-.01-.03-.01-.04-.02-.01-.01-.03 0-.04-.01 0 0-.01 0-.02-.01 0 0-.01-.01-.01-.01v-.01c-.03-.03-.05-.01-.06-.01-.01-.01-.02 0-.03-.01 0 0-.01 0-.01-.01 0 0-.01 0-.01-.01-.01 0-.03-.01-.04-.01-.04-.01-.08-.02-.12-.03-.12-.03-.25-.05-.38-.08-.12-.02-.24-.04-.37-.04-.12 0-.24 0-.35.01-.12.01-.23.03-.34.06-.11.03-.22.06-.32.1-.28.11-.53.27-.75.47-.22.21-.39.45-.51.73-.13.28-.2.58-.22.89-.1.31.04.61.16.9.12.28.29.53.49.76.2.22.42.42.65.59.28.21.54.46.75.74.1.13.18.27.24.42.06.15.1.31.09.47-.01.15-.07.3-.16.43-.09.14-.23.25-.39.31-.16.07-.34.09-.51.07s-.34-.09-.47-.19c-.13-.09-.24-.22-.31-.37-.07-.15-.11-.31-.13-.47-.02-.17 0-.34.05-.5.04-.16.11-.32.2-.47s.18-.3.27-.44c.1-.15.16-.32.21-.49.05-.16.08-.33.07-.51-.01-.17-.06-.34-.15-.5-.08-.15-.2-.29-.34-.41-.14-.11-.3-.2-.47-.26-.17-.06-.34-.1-.52-.12-.18-.02-.35-.02-.53 0-.18.02-.35.07-.51.13-.16.07-.31.15-.45.25-.15.11-.27.24-.38.38-.1.14-.2.29-.27.45-.07.15-.11.31-.14.48-.11.31-.12.65-.04.97.08.32.25.62.48.87.23.25.52.45.83.59.31.14.64.22.98.25.33.03.67 0 .99-.09.31-.09.61-.23.88-.42.2-.14.39-.31.57-.51 0 0 .1.1.24.3.13.2.33.16.33.16s.01-.01.02-.02c0 0 .12-.13.24-.38.13-.24.19-.43.19-.44 0 0 .09-.19.37-.27.07-.02.18-.05.33-.09.07-.02.13-.06.19-.11.06-.05.11-.12.14-.2.05-.12.05-.27-.01-.39-.06-.12-.16-.22-.29-.28-.05-.02-.1-.04-.15-.06-.05-.02-.11-.04-.16-.06-.56-.17-1.33-.4-1.33-.4 0 0-.02-.16-.02-.16-.01-.07-.03-.14-.06-.2-.02-.07-.06-.13-.1-.19-.08-.12-.19-.22-.32-.3-.08-.04-.16-.08-.25-.11-.09-.03-.18-.05-.28-.05-.07 0-.15.01-.22.04-.39.17-.49.55-.49.55s-.32.02-.48.05c-.35.06-.82.16-1.48.34-.68.19-1.3.24-1.3.24s-.03-.18-.12-.42c-.09-.24-.24-.61-.24-.61s-.09-.24-.27-.36c-.19-.12-.5-.16-.76-.03-.26.13-.32.44-.32.44s-.25.92-.37 1.5c-.12.57-.16.91-.16.91s-.43.16-1 .42c-.57.26-.89.44-.89.44l-.34.18s-.4.21-.52.38c-.12.17-.14.43.03.63.17.21.44.22.44.22l.53.07c.19.02.45.06.8.11.89.12.92.1.92.1l.13.64s.37 1.86.69 3.18c.31 1.33.53 2.13.53 2.13s.08.44.39.55c.31.11.63-.11.63-.11l2.38-1.53 2.21-1.44s.26-.17.26-.45c0-.27-.26-.35-.26-.35s-1.36-.59-1.67-.7c-.31-.12-1.7-.64-2.25-.75-.56-.11-.52-.04-.52-.04l-.27-1.09s-.72-2.77-.72-2.77c0 0 .02-.03.06-.07.05-.05.11-.11.2-.15.18-.08.76-.34 1.57-.65.83-.31 1.94-.69 3.24-1.06 1.97-.57 2.91-.62 3.25-.61.34 0 .42.05.54.11.12.06.2.16.22.31.02.15-.02.36-.24.61-.21.24-.3.28-.76.56-.45.28-1.13.66-1.65.91-.53.25-.87.38-.87.38s-.23.1-.27.25c-.04.15.05.38.36.46.3.08.43.09 1.3.11.87.01 1.38-.02 1.82-.1.44-.07.73-.19.85-.24.13-.05.32-.06.53.08.2.14.32.47.32.47s.16 1.43.69 2.25c.53.82.77.94.77.94s.23.14.34-.01c.11-.16.16-.38.16-.38s.54-3.97.38-7.02c-.16-3.06-.26-3.8-.63-4.94-.37-1.13-.66-1.45-.66-1.45s-.17-.17-.46-.14c-.29.03-.45.26-.51.29-.06.03-.43.26-1.09.5-.66.23-1.45.51-2.5.73-1.04.22-2.31.36-3.83.36-1.52.01-2.75-.1-3.49-.25-.76-.16-.93-.36-.99-.46-.05-.1-.11-.31-.08-.58.03-.27.17-.59.47-.9.3-.31.44-.41.44-.41s.92-.67 2.19-1.13c1.26-.46 2.46-.5 2.46-.5s.33-.01.71.09c.38.1.81.32 1.07.74.25.42.28 1.05.28 1.05s.06 1.39.01 2.76c-.06 1.36-.2 1.93-.2 1.93s-.5.39-.24.6c.26.21.62.07.62.07s.52-.17 1.07-.8c.55-.63.97-1.32 1.36-2.78.38-1.46.44-3.7.02-5.08-.42-1.38-.75-1.75-1.09-2.05-.34-.31-.7-.48-1.09-.58-.9-.24-2.14-.15-2.14-.15s-3.28.19-5.73 1.39c-2.44 1.2-3.69 2.89-3.69 2.89s-.86.98-1.11 2.13c-.25 1.15-.14 2.2-.14 2.2s.19 1.31 1.16 2.13c.98.82 2.01.84 2.01.84s3.5.09 5.4-.57c.3-.1.55-.2.76-.29-.57 1.4-1.19 1.7-1.19 1.7s-1.17.28-2.95-.41c-1.78-.69-2.54-1.54-2.54-1.54s-1.43-1.66-1.51-4.03c-.09-2.37.69-4.05.69-4.05s1.2-2.8 4.88-4.25c3.68-1.46 6.22-1.48 7.24-1.4 1.02.08 2.47.3 3.64 1.72 1.16 1.42 1.27 2.68 1.33 3.27.6.66.06 1.42.06 1.42s-.01-.19 0 .08l-.2.54s.1.31.1.31c-.4.52-.23 1.55-.43 2.21-.2.66-.36 1.21-.36 1.21l-.37.97s.28.42.76.37c.48-.06.62-.28.78-.58.15-.31.45-1.13.63-1.81.18-.69.2-1.09.24-1.38.04-.29.15-.74.25-1.38.1-.63.16-1.46.16-1.46l.05-1.21-.1-1.04s-.24-2.26-1.95-3.7c-1.71-1.45-3.24-1.5-3.24-1.5s-3.77-.26-8.31 1.66c-4.54 1.91-5.69 5.49-5.69 5.49s-.67 1.87-.5 4.16c.17 2.3 1.33 3.92 1.33 3.92s1.32 1.98 3.97 2.55c2.64.58 4.32-.04 4.32-.04s.52-.12 1.26-.6c.74-.48 1.18-1.07 1.18-1.07s-1.53.82-3.26.66c-1.74-.16-2.89-1.16-2.89-1.16s-1.45-1.12-1.54-2.81c-.09-1.68.51-2.83.51-2.83s.96-1.86 3.22-2.95c2.25-1.1 4.11-1.22 4.9-1.19.79.02 1.53.15 2.06.52.53.37.86.89.86.89s.9 1.19-.08 2.49c-.98 1.3-2.31 1.39-2.89 1.54-.58.15-2.11.55-3.61.52-1.5-.03-2.03-.36-2.03-.36s-.34-.15-.58-.48c-.25-.33-.29-.38-.29-.38l.66-.24s.59-.24 1.12-.58c.53-.34 1.05-.8 1.05-.8s.49-.41.52-.85c.02-.45-.35-.77-.35-.77s-.24-.26-.93-.26c-.68 0-1.34.28-1.34.28s-.64.22-1.28.74c-.65.51-1.01 1.12-1.01 1.12s-.58.95-.4 2.04c.14.79.42 1.12.68 1.37.26.25.6.46 1.07.6.43.13 1.06.23 1.93.23.08 0 .16 0 .24-.01h.01c.08-.3.16-.3.24-.1.01 0 .02 0 .03 0 .1 0 .2-.1.29-.03.35-.7.68-.17.96-.31.07-.4.14-.8.21-.13.51-.33.9-.78 1.2-1.16.29-.38.5-.72.62-.97.25-.5.35-.91.4-1.42.03-.24.02-.51-.02-.8-.04-.27-.13-.56-.27-.84-.28-.58-.74-1.02-.74-1.02s-1.21-1.1-3.64-1.02c-2.44.08-4.46 1.03-4.46 1.03s-3.67 1.95-4.94 5.18c-1.28 3.23-.87 6.61-.87 6.61s.18 2.44 1.8 4.42c1.44 1.75 3.17 2.49 4.27 2.83 1.11.35 1.87.38 2.55.38.69 0 2.07-.15 2.07-.15s.59-.07 1.22-.29c.63-.22 1.28-.6 1.28-.6s1.02-.56 1.83-1.48c.81-.92 1.38-2.18 1.38-2.18s1.03-2.1 1.35-4.2l.17-1.15.1-.73.07-.71.02-.2s.01-.15.03-.26c.01-.11.04-.25.04-.25l.09-.69c.05-.31.09-.67.13-1.04.04-.37.07-.75.1-1.14l.02-.31c.01-.1.01-.19.02-.29.01-.19.02-.38.03-.56.04-.74.03-1.36.03-1.36l-.08-1.35-.08-.55-.11-.5s-.27-1.17-1.32-2.1c-1.05-.93-2.13-1.11-2.13-1.11s-2.03-.19-4.2.41c-2.17.6-3.66 1.93-3.66 1.93s-2.22 1.73-3.14 4.67c-.92 2.94-.65 5.31-.65 5.31s.29 2.77 2.2 4.31c.67.55 1.33.89 1.9 1.1.57.22 1.04.32 1.04.32z"/>
                      </svg>
                      <span className="ml-2">PayPal</span>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payMethod"
                        value="efectivo"
                        checked={formData.payMethod === 'efectivo'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <ShoppingBag className="ml-3 h-5 w-5 text-green-500" />
                      <span className="ml-2">Pago en efectivo</span>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payMethod"
                        value="transferencia"
                        checked={formData.payMethod === 'transferencia'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <Truck className="ml-3 h-5 w-5 text-green-500" />
                      <span className="ml-2">Transferencia bancaria</span>
                    </label>
                  </div>
                  
                  {errors.payMethod && (
                    <p className="mt-1 text-sm text-red-600">{errors.payMethod}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Procesando...' : 'Finalizar compra'}
                </button>
              </form>
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
