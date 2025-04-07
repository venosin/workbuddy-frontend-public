import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Trash2, Gift, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';

export function ShoppingCartDropdown({ isOpen, onClose }) {
  // Usar el contexto del carrito para acceder al estado y funciones
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
  
  // Estado local solo para el código de descuento
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

  // Si el dropdown no está abierto, no mostrar nada
  if (!isOpen) return null;

  return (
    <div 
      className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden z-20"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-brown-900">Carrito de Compras</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading && (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando tu carrito...</p>
          </div>
        )}
        
        {error && (
          <div className="py-4 px-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="text-sm">{error}</p>
            <button 
              onClick={refreshCart}
              className="mt-2 text-sm text-red-700 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
        
        {/* Lista de productos en el carrito */}
        <div className="max-h-96 overflow-y-auto">
          {!loading && !error && items.length === 0 ? (
            <div className="py-8 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-brown-900">Carrito vacío</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aún no has agregado productos a tu carrito
              </p>
              <div className="mt-6">
                <Link
                  to="/tienda"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={onClose}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Ver productos
                </Link>
              </div>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex">
                  <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-center object-cover" 
                    />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-brown-900">
                        <h4>
                          <Link to={`/producto/${item.id}`} onClick={onClose}>
                            {item.name}
                          </Link>
                        </h4>
                        <p className="ml-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        ${item.price.toFixed(2)} por unidad
                      </p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => decrementQuantity(item.id)} 
                          className="px-2 py-1 text-gray-600 hover:text-gray-700"
                          disabled={item.quantity <= 1 || loading}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-2 py-1 text-gray-700">{item.quantity}</span>
                        <button 
                          onClick={() => incrementQuantity(item.id)} 
                          className="px-2 py-1 text-gray-600 hover:text-gray-700"
                          disabled={loading}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(item.id)}
                        className="font-medium text-red-600 hover:text-red-500"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!loading && items.length > 0 && (
          <>
            {/* Sección de código de descuento */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <Gift className="h-5 w-5 text-gray-400 mr-2" />
                <p className="text-sm text-gray-600">¿Tienes un código de descuento?</p>
              </div>
              <div className="mt-2 flex">
                <input
                  type="text"
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
              {discountApplied && (
                <p className="mt-1 text-sm text-green-600">
                  ¡Descuento aplicado! Ahorraste ${discountAmount.toFixed(2)}
                </p>
              )}
            </div>

            {/* Resumen del carrito */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <p>Subtotal</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-sm text-green-600 mt-1">
                  <p>Descuento</p>
                  <p className="font-medium">-${discountAmount.toFixed(2)}</p>
                </div>
              )}
              <div className="flex justify-between text-base font-medium text-brown-900 mt-2">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-4">
              <Link
                to="/checkout"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={onClose}
              >
                Proceder al pago
              </Link>
              <Link
                to="/carrito"
                className="mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-brown-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={onClose}
              >
                Ver carrito completo
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
