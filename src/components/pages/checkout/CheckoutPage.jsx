import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import { DiscountCodeInput } from '../../shared/cart/DiscountCodeInput';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { 
    items, 
    subtotal, 
    total, 
    discountAmount, 
    loading, 
    createOrder, 
    appliedCode, 
    discountPercentage, 
    applyDiscountCode 
  } = useCart();
  
  const [formData, setFormData] = useState({
    shippingAdress: user?.address || '',
    payMethod: 'tarjeta'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  
  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    navigate('/iniciar-sesion?redirect=checkout');
    return null;
  }
  
  // Redirigir a la tienda si no hay productos en el carrito
  if (items.length === 0 && !loading) {
    navigate('/tienda');
    return null;
  }
  
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
      // Crear la orden
      const result = await createOrder(formData);
      
      if (result.success) {
        // Redirigir a la página de confirmación
        navigate(`/pedido-confirmado/${result.orderId}`);
      } else {
        setOrderError(result.error || 'Ocurrió un error al procesar tu pedido');
      }
    } catch (error) {
      console.error('Error al crear la orden:', error);
      setOrderError('No se pudo procesar tu pedido. Inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-brown-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold text-brown-900 mb-6">Finalizar compra</h1>
        
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
                  className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                    isSubmitting
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } transition-colors`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                      Procesando...
                    </span>
                  ) : (
                    'Confirmar pedido'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Resumen del pedido */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
              
              <div className="space-y-4 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center py-2 border-b">
                    <div className="h-16 w-16 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden">
                      <img
                        src={item.image || 'https://placehold.co/200x200/e9d8c4/333333?text=Producto'}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Sección de código de descuento */}
              <DiscountCodeInput 
                onApplyCode={applyDiscountCode}
                currentCode={appliedCode}
                discount={discountPercentage}
              />

              <div className="space-y-2 border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Descuento ({discountPercentage}%)</span>
                    <span className="font-medium text-green-600">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">$0.00</span>
                </div>
                
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600">${total.toFixed(2)}</span>
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
