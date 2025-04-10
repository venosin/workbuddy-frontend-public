import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ExternalLink, Clock, CreditCard, Truck, Check, AlertCircle, X, DollarSign, Package, RefreshCw } from 'lucide-react';
import ordersService from '../../../services/ordersService';
import paymentService from '../../../services/paymentService';
import { BackButton } from '../../shared/ui/BackButton';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await ordersService.getUserOrders();
      console.log('Órdenes cargadas:', data);
      
      // Verificar si la respuesta tiene la estructura esperada y extraer el array de órdenes
      if (data && data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        // Por si la API devuelve directamente un array en lugar de un objeto paginado
        setOrders(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        throw new Error('La respuesta del servidor no tiene el formato esperado');
      }
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('No se pudieron cargar los pedidos. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función para continuar con el pago si está pendiente
  const handlePayOrder = async (orderId) => {
    try {
      setProcessingPayment(true);
      setActiveOrderId(orderId);
      
      // Iniciar proceso de pago
      await paymentService.initPaymentProcess(orderId);
      
      // Crear el pago con PayPal
      const paymentResponse = await paymentService.createPayment(orderId);
      
      // Redirigir al usuario a la página de PayPal para completar el pago
      if (paymentResponse && paymentResponse.approveUrl) {
        window.location.href = paymentResponse.approveUrl;
      } else {
        throw new Error('No se pudo obtener el enlace de pago');
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      setError(`Error al procesar el pago: ${err.message || 'Intenta nuevamente más tarde'}`);
      setProcessingPayment(false);
      setActiveOrderId(null);
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Función para obtener el estado del pedido con su icono y color
  const getOrderStatus = (status) => {
    // Mapa de estados de pedidos
    const statusMap = {
      'pending': { 
        label: 'Pendiente', 
        icon: <Clock className="h-5 w-5" />, 
        color: 'text-yellow-500 bg-yellow-100'
      },
      'paid': { 
        label: 'Pagado', 
        icon: <CreditCard className="h-5 w-5" />, 
        color: 'text-blue-500 bg-blue-100'
      },
      'processing': { 
        label: 'En proceso', 
        icon: <Package className="h-5 w-5" />, 
        color: 'text-blue-500 bg-blue-100'
      },
      'shipped': { 
        label: 'Enviado', 
        icon: <Truck className="h-5 w-5" />, 
        color: 'text-purple-500 bg-purple-100'
      },
      'delivered': { 
        label: 'Entregado', 
        icon: <Check className="h-5 w-5" />, 
        color: 'text-green-500 bg-green-100'
      },
      'cancelled': { 
        label: 'Cancelado', 
        icon: <X className="h-5 w-5" />, 
        color: 'text-red-500 bg-red-100'
      }
    };

    // Por defecto, usar pendiente
    const statusKey = status ? status.toLowerCase() : 'pending';
    const statusInfo = statusMap[statusKey] || statusMap['pending'];

    return (
      <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        <span className="mr-1">{statusInfo.icon}</span>
        {statusInfo.label}
      </span>
    );
  };
  
  // Función para obtener el estado del pago
  const getPaymentStatus = (paymentInfo) => {
    if (!paymentInfo) return getOrderStatus('pending');
    
    const statusMap = {
      'pending': { 
        label: 'Pendiente', 
        icon: <Clock className="h-5 w-5" />, 
        color: 'text-yellow-500 bg-yellow-100'
      },
      'completed': { 
        label: 'Completado', 
        icon: <Check className="h-5 w-5" />, 
        color: 'text-green-500 bg-green-100'
      },
      'failed': { 
        label: 'Fallido', 
        icon: <AlertCircle className="h-5 w-5" />, 
        color: 'text-red-500 bg-red-100'
      },
      'refunded': { 
        label: 'Reembolsado', 
        icon: <DollarSign className="h-5 w-5" />, 
        color: 'text-blue-500 bg-blue-100'
      }
    };
    
    const status = paymentInfo.status ? paymentInfo.status.toLowerCase() : 'pending';
    const statusInfo = statusMap[status] || statusMap['pending'];
    
    return (
      <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        <span className="mr-1">{statusInfo.icon}</span>
        {statusInfo.label}
      </span>
    );
  };
  
  // Función para obtener el método de pago formateado
  const getPaymentMethod = (paymentInfo) => {
    if (!paymentInfo || !paymentInfo.method) return 'No especificado';
    
    const methodMap = {
      'paypal': 'PayPal',
      'credit_card': 'Tarjeta de Crédito',
      'efectivo': 'Efectivo'
    };
    
    return methodMap[paymentInfo.method] || paymentInfo.method;
  };
  
  // Función para formatear la dirección de envío
  const formatShippingAddress = (shippingAddress) => {
    if (!shippingAddress) return 'No especificada';
    
    const { street, city, state, postalCode } = shippingAddress;
    const parts = [street, city, state, postalCode].filter(Boolean);
    
    return parts.join(', ');
  };


  // Componente para el botón de pago
  const PaymentButton = ({ order }) => {
    const isPending = order.status?.toLowerCase() === 'pending';
    const isThisOrderProcessing = processingPayment && activeOrderId === order._id;
    
    if (!isPending) return null;
    
    return (
      <button
        onClick={() => handlePayOrder(order._id)}
        disabled={isThisOrderProcessing}
        className={`mt-2 flex items-center px-4 py-2 ${
          isThisOrderProcessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
        } text-white rounded-md text-sm`}
      >
        {isThisOrderProcessing ? (
          <>
            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
            Procesando...
          </>
        ) : (
          <>
            <DollarSign className="h-4 w-4 mr-2" />
            Pagar ahora
          </>
        )}
      </button>
    );
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
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
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
      <div className="mb-4">
        <BackButton className="text-brown-600 hover:text-brown-800" label="Volver al inicio" toPath="/" />
      </div>
      <h2 className="text-xl font-semibold text-brown-900 mb-6">Mis Pedidos</h2>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6">
              {/* Encabezado del pedido */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-brown-900">
                    Pedido #{order._id?.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Realizado el {formatDate(order.createdAt)}
                  </p>
                </div>
                
                {/* Estado del pedido */}
                <div className="mt-2 sm:mt-0">
                  {getOrderStatus(order.status)}
                </div>
              </div>
              
              {/* Información del envío */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Dirección de envío</h4>
                <p className="text-sm text-gray-700">{formatShippingAddress(order.shippingAddress)}</p>
              </div>
              
              {/* Información del pago */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-500">Información de pago</h4>
                  {getPaymentStatus(order.paymentInfo)}
                </div>
                
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Método:</span>
                    <span className="text-gray-700">{getPaymentMethod(order.paymentInfo)}</span>
                  </div>
                  
                  {order.paymentInfo?.transactionId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ID Transacción:</span>
                      <span className="font-mono text-gray-700">{order.paymentInfo.transactionId}</span>
                    </div>
                  )}
                  
                  {order.paymentInfo?.paymentDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fecha de pago:</span>
                      <span className="text-gray-700">{formatDate(order.paymentInfo.paymentDate)}</span>
                    </div>
                  )}
                </div>
                
                <PaymentButton order={order} />
              </div>
              
              {/* Total */}
              <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between items-center">
                <div className="text-lg font-bold text-green-600">
                  Total: {formatCurrency(order.totalAmount)}
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
        ))}
      </div>
    </div>
  );
}
