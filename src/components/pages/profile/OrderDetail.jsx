import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CreditCard, Truck, Check, MapPin, Calendar } from 'lucide-react';
import ordersService from '../../../services/ordersService';

export function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await ordersService.getOrderById(orderId);
        console.log('Detalles de la orden cargados:', data);
        setOrder(data);
      } catch (err) {
        console.error('Error al cargar detalles del pedido:', err);
        setError('No se pudieron cargar los detalles del pedido. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

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

  // Si no hay orden
  if (!order) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-brown-900 mb-2">Pedido no encontrado</h3>
        <Link 
          to="/perfil/pedidos"
          className="mt-4 inline-flex items-center text-green-600 hover:text-green-800"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  const status = getOrderStatus(order);
  
  // Calculamos el total del pedido y otros detalles
  const cartProducts = order.CartId?.products || [];
  const productsCount = cartProducts.length;
  
  // Cálculo de subtotal, impuestos y total basado en productos del carrito
  let subtotal = 0;
  if (cartProducts.length > 0) {
    subtotal = cartProducts.reduce((sum, item) => {
      const price = item.idProduct?.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  } else {
    subtotal = order.subTotal || 0;
  }
  
  const shipping = order.shipping || 0;
  const tax = order.tax || Math.round(subtotal * 0.16 * 100) / 100; // 16% por defecto si no está especificado
  const discount = order.CartId?.discountAmount || 0;
  const total = order.total || (subtotal + shipping + tax - discount);

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link 
          to="/perfil/pedidos"
          className="mr-4 inline-flex items-center text-green-600 hover:text-green-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-xl font-semibold text-brown-900">Detalles del Pedido #{order._id.substring(0, 8)}</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">
                Realizado el {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className={`mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-brown-900 mb-4">Resumen del pedido</h3>
            
            {/* Productos */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Productos ({productsCount})</h4>
              
              <div className="space-y-4">
                {cartProducts.map((item, index) => {
                  // Aquí debes adaptar según la estructura real de tus productos en el carrito
                  const product = item.idProduct || {};
                  const quantity = item.quantity || 1;
                  const price = product.price || 0;
                  
                  return (
                    <div key={index} className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.image?.url || '/tiendaEjem.jpeg'}
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-brown-900">
                          {product.name || 'Producto'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Cantidad: {quantity} x ${price.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-medium text-sm text-right">
                        ${(price * quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Información de envío */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Información de envío</h4>
              <div className="border border-gray-200 rounded-md p-4">
                <p className="flex items-center text-sm text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {order.shippingAdress || 'Dirección no disponible'}
                </p>
                <p className="flex items-center text-sm text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Fecha estimada de entrega: {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'No disponible'}
                </p>
              </div>
            </div>
            
            {/* Resumen de costos */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Resumen de costos</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Impuestos (16%)</p>
                  <p className="text-gray-900">${tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Envío</p>
                  <p className="text-gray-900">${shipping.toFixed(2)}</p>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Descuento</p>
                    <p className="text-green-600">-${discount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
                  <p className="text-gray-900">Total</p>
                  <p className="text-green-600">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
