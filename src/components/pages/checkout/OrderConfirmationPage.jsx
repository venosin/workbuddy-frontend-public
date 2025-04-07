import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ShoppingBag, Truck, Calendar, ChevronRight } from 'lucide-react';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import ordersService from '../../../services/ordersService';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderData = await ordersService.getOrderById(orderId);
        setOrder(orderData);
        console.log('Order details:', orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('No pudimos cargar los detalles de tu pedido. Por favor contacta con atención al cliente.');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Función para obtener fecha estimada de entrega (5 días después de la orden)
  const getEstimatedDelivery = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 5);
    return formatDate(date);
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-brown-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-brown-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ha ocurrido un error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link 
              to="/perfil/pedidos" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Ver mis pedidos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="flex min-h-screen flex-col bg-brown-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-brown-900 mb-4">Pedido no encontrado</h1>
            <p className="text-gray-700 mb-6">No se pudo encontrar el pedido especificado.</p>
            <Link 
              to="/tienda" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-brown-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cabecera con confirmación */}
          <div className="bg-green-600 text-white p-6 flex items-center">
            <div className="bg-white rounded-full p-2 mr-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">¡Pedido realizado con éxito!</h1>
              <p className="text-green-100">Gracias por tu compra</p>
            </div>
          </div>
          
          {/* Contenido del pedido */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-brown-900 mb-3">Detalles del pedido</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-500 mb-1">Número de pedido</p>
                  <p className="font-medium">{order._id}</p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-500 mb-1">Fecha del pedido</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-500 mb-1">Método de pago</p>
                  <p className="font-medium">
                    {order.payMethod === 'tarjeta' && 'Tarjeta de crédito/débito'}
                    {order.payMethod === 'efectivo' && 'Pago en efectivo'}
                    {order.payMethod === 'transferencia' && 'Transferencia bancaria'}
                    {!['tarjeta', 'efectivo', 'transferencia'].includes(order.payMethod) && order.payMethod}
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-500 mb-1">Entrega estimada</p>
                  <p className="font-medium">{getEstimatedDelivery(order.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-brown-900 mb-3">Dirección de envío</h2>
              <div className="border border-gray-200 rounded-md p-4">
                <p className="whitespace-pre-line">{order.shippingAdress}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-brown-900 mb-3">Estado del pedido</h2>
              <div className="relative">
                <div className="absolute left-7 top-0 h-full w-0.5 bg-gray-200"></div>
                
                <div className="relative flex items-center mb-4">
                  <div className="z-10 flex items-center justify-center w-14 h-14 bg-green-100 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-brown-900">Pedido recibido</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                <div className="relative flex items-center mb-4">
                  <div className="z-10 flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full">
                    <Truck className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-brown-900">Envío en proceso</h3>
                    <p className="text-sm text-gray-500">Pendiente</p>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className="z-10 flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full">
                    <Calendar className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-brown-900">Entrega</h3>
                    <p className="text-sm text-gray-500">Estimada para {getEstimatedDelivery(order.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between">
              <Link 
                to={`/perfil/pedidos/${order._id}`} 
                className="inline-flex items-center text-green-600 hover:text-green-800 mb-4 sm:mb-0"
              >
                Ver detalles completos del pedido
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              
              <Link 
                to="/tienda" 
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
