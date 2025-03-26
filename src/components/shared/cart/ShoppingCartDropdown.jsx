import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Trash2, Gift, ShoppingCart } from 'lucide-react';

export function ShoppingCartDropdown({ isOpen, onClose }) {
  // Estado simulado del carrito de compras
  // En la implementación real, estos datos vendrán del backend
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Taza de Café WorkBuddy',
      price: 249.99,
      quantity: 2,
      image: 'https://placehold.co/200x200/e9d8c4/333333?text=Taza'
    },
    {
      id: '2',
      name: 'Café Molido Premium 250g',
      price: 199.99,
      quantity: 1,
      image: 'https://placehold.co/200x200/e9d8c4/333333?text=Café'
    }
  ]);
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calcular total con descuento
  const total = subtotal - discountAmount;

  // Incrementar cantidad de un producto
  const incrementQuantity = (itemId) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Decrementar cantidad de un producto
  const decrementQuantity = (itemId) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Eliminar un producto del carrito
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Aplicar código de descuento
  const applyDiscountCode = () => {
    // Simulación de aplicación de descuento
    // En la implementación real, esto verificaría el código con el backend
    if (discountCode.toLowerCase() === 'workbuddy10') {
      const discountValue = subtotal * 0.1; // 10% de descuento
      setDiscountAmount(discountValue);
      setDiscountApplied(true);
    } else {
      // Mostrar mensaje de error (no implementado en este ejemplo)
      setDiscountApplied(false);
      setDiscountAmount(0);
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

        {/* Lista de productos en el carrito */}
        <div className="max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
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
              {cartItems.map((item) => (
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
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-2 py-1 text-gray-700">{item.quantity}</span>
                        <button 
                          onClick={() => incrementQuantity(item.id)} 
                          className="px-2 py-1 text-gray-600 hover:text-gray-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeItem(item.id)}
                        className="font-medium text-red-600 hover:text-red-500"
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

        {cartItems.length > 0 && (
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
                  onClick={applyDiscountCode}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Aplicar
                </button>
              </div>
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
