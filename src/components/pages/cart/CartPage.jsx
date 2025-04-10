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
    navigate('/checkout/finalizar');
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
