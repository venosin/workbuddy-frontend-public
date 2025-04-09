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
        
        // Redirigir a la página de confirmación después de un breve delay
        setTimeout(() => {
          navigate(`/pedido-confirmado/${result.order._id}`);
        }, 2000);
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
