import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ExternalLink, Clock, CreditCard, Truck, Check } from 'lucide-react';
import ordersService from '../../../services/ordersService';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await ordersService.getUserOrders();
        console.log('Órdenes cargadas:', data);
        setOrders(data);
      } catch (err) {
        console.error('Error al cargar pedidos:', err);
        setError('No se pudieron cargar los pedidos. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para obtener el estado del pedido con su icono y color
  const getOrderStatus = (order) => {
    // Mapa de estados de pedidos
    const statusMap = {
      'pendiente': { 
        label: 'Pendiente', 
        icon: <Clock className="h-5 w-5" />, 
        color: 'text-yellow-500 bg-yellow-100'
      },
      'pagado': { 
        label: 'Pagado', 
        icon: <CreditCard className="h-5 w-5" />, 
        color: 'text-blue-500 bg-blue-100'
      },
      'enviado': { 
        label: 'Enviado', 
        icon: <Truck className="h-5 w-5" />, 
        color: 'text-indigo-500 bg-indigo-100'
      },
      'entregado': { 
        label: 'Entregado', 
        icon: <Check className="h-5 w-5" />, 
        color: 'text-green-500 bg-green-100'
      }
    };

    // Derivamos el estado según la presencia de ciertos campos o status explícito
    let status = 'pendiente';
    
    if (order.status) {
      // Si hay un status explícito, lo usamos
      status = order.status.toLowerCase();
    } else if (order.deliveredAt) {
      status = 'entregado';
    } else if (order.shippedAt) {
      status = 'enviado';
    } else if (order.paidAt) {
      status = 'pagado';
    }
    
    return statusMap[status] || statusMap['pendiente'];
  };

  // Función para obtener el total del pedido
  const getOrderTotal = (order) => {
    // Si tiene un campo total, lo usamos directamente
    if (order.total) return order.total;
    
    // Si no, intentamos calcularlo desde el carrito asociado
    if (order.CartId && Array.isArray(order.CartId.products)) {
      return order.CartId.products.reduce((sum, item) => {
        const price = item.idProduct && item.idProduct.price ? item.idProduct.price : 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
      }, 0);
    }
    
    // Si no podemos calcular, devolvemos 0
    return 0;
  };

  // Contenido cuando está cargando
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Contenido cuando hay un error
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Contenido cuando no hay pedidos
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <ShoppingBag size={32} />
        </div>
        <h3 className="text-lg font-medium text-brown-900 mb-2">Aún no tienes pedidos</h3>
        <p className="text-brown-600 max-w-md mx-auto">
          Cuando realices una compra, tus pedidos aparecerán aquí para que puedas hacer un seguimiento de ellos.
        </p>
        <button 
          onClick={() => window.location.href = '/tienda'}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-brown-900 mb-6">Mis Pedidos</h2>
      
      <div className="space-y-6">
        {orders.map(order => {
          const status = getOrderStatus(order);
          const total = getOrderTotal(order);
          
          return (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-brown-900">
                      Pedido #{order._id?.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Realizado el {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  <div className={`mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    {status.icon}
                    <span className="ml-1">{status.label}</span>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Resumen del pedido</h4>
                  
                  {/* Lista de productos simplificada */}
                  <div className="text-sm text-gray-700">
                    {order.CartId && order.CartId.products ? (
                      <div>
                        <p className="font-medium">Productos: {order.CartId.products.length}</p>
                        <div className="mt-2 space-y-1">
                          {order.CartId.products.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <p className="truncate max-w-[200px]">
                                {item.idProduct?.name || 'Producto'} x{item.quantity || 1}
                              </p>
                              <p>
                                ${((item.idProduct?.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </p>
                            </div>
                          ))}
                          {order.CartId.products.length > 2 && (
                            <p className="text-gray-500 italic">... y {order.CartId.products.length - 2} productos más</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p>Detalles no disponibles</p>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-lg font-bold text-green-600">
                      Total: ${total.toFixed(2)}
                    </div>
                    
                    <Link 
                      to={`/perfil/pedidos/${order._id}`}
                      className="flex items-center text-green-600 hover:text-green-800"
                    >
                      Ver detalles
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
