import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import { DiscountCodeInput } from '../../shared/cart/DiscountCodeInput';
import { BackButton } from '../../shared/ui/BackButton';

export function CartPage() {
  const navigate = useNavigate();
  const { 
    items, 
    loading, 
    error, 
    subtotal, 
    total, 
    discountApplied, 
    discountAmount,
    incrementQuantity, 
    decrementQuantity, 
    removeFromCart, 
    applyDiscountCode,
    refreshCart
  } = useCart();
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');

  // Función para aplicar código de descuento
  const handleApplyDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscountMessage('Por favor ingresa un código de descuento');
      return;
    }
    
    const result = await applyDiscountCode(discountCode);
    
    if (result) {
      setDiscountMessage('¡Descuento aplicado correctamente!');
    } else {
      setDiscountMessage('Código de descuento inválido');
    }
  };

  // Función para proceder al checkout
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="flex min-h-screen flex-col bg-brown-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-4">
          <BackButton className="text-brown-600 hover:text-brown-800" label="Volver a la tienda" toPath="/tienda" />
        </div>
        
        <h1 className="text-2xl font-bold text-brown-900 mb-6">Mi Carrito</h1>
        
        {loading && (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando tu carrito...</p>
          </div>
        )}
        
        {error && (
          <div className="py-4 px-3 bg-red-50 border-l-4 border-red-500 text-red-700 mb-6">
            <p className="text-sm">{error}</p>
            <button 
              onClick={refreshCart}
              className="mt-2 text-sm text-red-700 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
        
        {!loading && !error && items.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-brown-900">Carrito vacío</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aún no has agregado productos a tu carrito
            </p>
            <div className="mt-6">
              <Link
                to="/tienda"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ver productos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de productos en el carrito */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-brown-900 mb-4">Productos en tu carrito</h2>
                  
                  <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-center object-cover" 
                          />
                        </div>
                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-base font-medium text-brown-900">
                                <Link to={`/producto/${item.id}`}>
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="ml-4 text-base font-medium text-brown-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              ${item.price.toFixed(2)} por unidad
                            </p>
                            {item.category && (
                              <p className="mt-1 text-sm text-gray-500">
                                Categoría: {item.category}
                              </p>
                            )}
                          </div>
                          <div className="flex-1 flex items-end justify-between mt-4">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button 
                                onClick={() => decrementQuantity(item.id)} 
                                className="px-3 py-1 text-gray-600 hover:text-gray-700"
                                disabled={item.quantity <= 1 || loading}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-1 text-gray-700">{item.quantity}</span>
                              <button 
                                onClick={() => incrementQuantity(item.id)} 
                                className="px-3 py-1 text-gray-600 hover:text-gray-700"
                                disabled={loading}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeFromCart(item.id)}
                              className="font-medium text-red-600 hover:text-red-500 flex items-center"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Resumen del carrito y checkout */}
            <div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-brown-900 mb-4">Resumen de compra</h2>
                  
                  {/* Código de descuento */}
                  <div className="mb-6">
                    <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Tienes un código de descuento?
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="discount-code"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Ingresa tu código"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscountCode}
                        disabled={loading || !discountCode.trim()}
                        className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Aplicar
                      </button>
                    </div>
                    {discountMessage && (
                      <p className={`mt-1 text-sm ${discountApplied ? 'text-green-600' : 'text-red-600'}`}>
                        {discountMessage}
                      </p>
                    )}
                  </div>
                  
                  {/* Resumen de costos */}
                  <dl className="space-y-2 mb-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                    </div>
                    
                    {discountApplied && (
                      <div className="flex items-center justify-between text-green-600">
                        <dt className="text-sm">Descuento</dt>
                        <dd className="text-sm font-medium">-${discountAmount.toFixed(2)}</dd>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                      <dt className="text-base font-medium text-brown-900">Total</dt>
                      <dd className="text-base font-medium text-brown-900">${total.toFixed(2)}</dd>
                    </div>
                  </dl>
                  
                  {/* Opciones de pago */}
                  <div className="space-y-3">
                    {/* Botón de checkout normal */}
                    <button
                      type="button"
                      onClick={handleProceedToCheckout}
                      disabled={items.length === 0 || loading}
                      className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceder al pago
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                    
                    {/* Opción PayPal */}
                    <button
                      type="button"
                      onClick={() => navigate('/checkout-paypal')}
                      disabled={items.length === 0 || loading}
                      className="w-full flex justify-center items-center px-4 py-3 border border-blue-200 text-base font-medium rounded-md shadow-sm text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.32 21.97a.546.546 0 0 1-.26-.32c-.03-.15-.09-.26-.08-.21.08.65.194.75.304.06.105.105.21.105.37.01L8.32 21.97zm3.71.92c-.2-.25-.2-.38-.2-.7 0 .05-.01.11-.01.1-.2.36-.05.54.19.83.236.3.3.35.35.3l-.33-.54V22.9l-.01-.01zm-7.4-.62c-.6.18-.2.36.58.37h.03c.5.13.13.63.1.52 0 0 .3.38.78.28.48-.1.3-.18.3-.18s.3-.3.17-.27c-.13.03-.4.88.2.8.64-.1.58.13.62.1.2.65.49.11.49.1L8.79 22c.37-.1.83-.56.82-.81.04.1.07.22.2.44.3.1.57.36.58.37.1.1.22.17.34.23.1.06.22.1.33.14.11.04.22.07.34.09.12.03.23.04.35.05.1 0 .21 0 .31-.01.28-.04.55-.1.79-.24.24-.1.47-.27.66-.47.2-.19.36-.42.49-.67.13-.25.23-.52.29-.8 0-.01 0-.02.01-.03.1.82.22 1.5.35 1.82.4.1.8.17.12.23.3.05.7.09.1.14.4.5.7.1.11.15.1.14.17.28.25.41.2.4.7.9.4.14-.3.05-.9.08-.12.1-.3.03-.06.05-.09.09-.3.04-.05.09-.06.14-.1.17.03.4.2.51.1.07.22.12.35.14.13.02.26.02.39 0 .12-.02.25-.06.36-.11.11-.05.22-.12.3-.21.2-.19.29-.46.27-.72-.01-.12-.04-.23-.08-.34-.04-.1-.09-.2-.15-.28-.06-.08-.11-.17-.13-.27-.04-.2.03-.39.2-.51.18-.12.4-.18.62-.18.19 0 .37.03.55.08.17.04.33.09.49.15.15.05.29.12.42.21.09.06.19.13.28.21.04.04.08.1.12.15.3.05.6.1.1.16.04.3.9.05.14.06.1 0 .18-.02.25-.08.19-.16.22-.42.12-.65-.08-.15-.21-.28-.36-.39-.15-.1-.31-.19-.48-.26l-.02-.01c-.01-.01-.03-.01-.04-.02-.01-.01-.03 0-.04-.01 0 0-.01 0-.02-.01 0 0-.01-.01-.01-.01v-.01c-.03-.03-.05-.01-.06-.01-.01-.01-.02 0-.03-.01 0 0-.01 0-.01-.01 0 0-.01 0-.01-.01-.01 0-.03-.01-.04-.01-.04-.01-.08-.02-.12-.03-.12-.03-.25-.05-.38-.08-.12-.02-.24-.04-.37-.04-.12 0-.24 0-.35.01-.12.01-.23.03-.34.06-.11.03-.22.06-.32.1-.28.11-.53.27-.75.47-.22.21-.39.45-.51.73-.13.28-.2.58-.22.89-.1.31.04.61.16.9.12.28.29.53.49.76.2.22.42.42.65.59.28.21.54.46.75.74.1.13.18.27.24.42.06.15.1.31.09.47-.01.15-.07.3-.16.43-.09.14-.23.25-.39.31-.16.07-.34.09-.51.07s-.34-.09-.47-.19c-.13-.09-.24-.22-.31-.37-.07-.15-.11-.31-.13-.47-.02-.17 0-.34.05-.5.04-.16.11-.32.2-.47s.18-.3.27-.44c.1-.15.16-.32.21-.49.05-.16.08-.33.07-.51-.01-.17-.06-.34-.15-.5-.08-.15-.2-.29-.34-.41-.14-.11-.3-.2-.47-.26-.17-.06-.34-.1-.52-.12-.18-.02-.35-.02-.53 0-.18.02-.35.07-.51.13-.16.07-.31.15-.45.25-.15.11-.27.24-.38.38-.1.14-.2.29-.27.45-.07.15-.11.31-.14.48-.11.31-.12.65-.04.97.08.32.25.62.48.87.23.25.52.45.83.59.31.14.64.22.98.25.33.03.67 0 .99-.09.31-.09.61-.23.88-.42.2-.14.39-.31.57-.51 0 0 .1.1.24.3.13.2.33.16.33.16s.01-.01.02-.02c0 0 .12-.13.24-.38.13-.24.19-.43.19-.44 0 0 .09-.19.37-.27.07-.02.18-.05.33-.09.07-.02.13-.06.19-.11.06-.05.11-.12.14-.2.05-.12.05-.27-.01-.39-.06-.12-.16-.22-.29-.28-.05-.02-.1-.04-.15-.06-.05-.02-.11-.04-.16-.06-.56-.17-1.33-.4-1.33-.4 0 0-.02-.16-.02-.16-.01-.07-.03-.14-.06-.2-.02-.07-.06-.13-.1-.19-.08-.12-.19-.22-.32-.3-.08-.04-.16-.08-.25-.11-.09-.03-.18-.05-.28-.05-.07 0-.15.01-.22.04-.39.17-.49.55-.49.55s-.32.02-.48.05c-.35.06-.82.16-1.48.34-.68.19-1.3.24-1.3.24s-.03-.18-.12-.42c-.09-.24-.24-.61-.24-.61s-.09-.24-.27-.36c-.19-.12-.5-.16-.76-.03-.26.13-.32.44-.32.44s-.25.92-.37 1.5c-.12.57-.16.91-.16.91s-.43.16-1 .42c-.57.26-.89.44-.89.44l-.34.18s-.4.21-.52.38c-.12.17-.14.43.03.63.17.21.44.22.44.22l.53.07c.19.02.45.06.8.11.89.12.92.1.92.1l.13.64s.37 1.86.69 3.18c.31 1.33.53 2.13.53 2.13s.08.44.39.55c.31.11.63-.11.63-.11l2.38-1.53 2.21-1.44s.26-.17.26-.45c0-.27-.26-.35-.26-.35s-1.36-.59-1.67-.7c-.31-.12-1.7-.64-2.25-.75-.56-.11-.52-.04-.52-.04l-.27-1.09s-.72-2.77-.72-2.77c0 0 .02-.03.06-.07.05-.05.11-.11.2-.15.18-.08.76-.34 1.57-.65.83-.31 1.94-.69 3.24-1.06 1.97-.57 2.91-.62 3.25-.61.34 0 .42.05.54.11.12.06.2.16.22.31.02.15-.02.36-.24.61-.21.24-.3.28-.76.56-.45.28-1.13.66-1.65.91-.53.25-.87.38-.87.38s-.23.1-.27.25c-.04.15.05.38.36.46.3.08.43.09 1.3.11.87.01 1.38-.02 1.82-.1.44-.07.73-.19.85-.24.13-.05.32-.06.53.08.2.14.32.47.32.47s.16 1.43.69 2.25c.53.82.77.94.77.94s.23.14.34-.01c.11-.16.16-.38.16-.38s.54-3.97.38-7.02c-.16-3.06-.26-3.8-.63-4.94-.37-1.13-.66-1.45-.66-1.45s-.17-.17-.46-.14c-.29.03-.45.26-.51.29"/>                      
                      </svg>
                      Pagar con PayPal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
