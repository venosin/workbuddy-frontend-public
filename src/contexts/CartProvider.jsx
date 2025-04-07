import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import cartService from '../services/cartService';
import ordersService from '../services/ordersService';

// Crear el contexto
const CartContext = createContext();

// Exportar el contexto para que pueda ser utilizado por los hooks
export { CartContext };

// Proveedor del contexto
export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Función para cargar el carrito del usuario
  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, no se carga el carrito');
      setCartId(null);
      setCart(null);
      setItems([]);
      return;
    }
    
    try {
      console.log('Intentando cargar carrito para usuario:', user?._id);
      setLoading(true);
      setError(null);
      
      // Asegurarnos de que el userId esté en localStorage para la autenticación
      if (user && user._id) {
        localStorage.setItem('userId', user._id);
      }

      // Obtener carrito del usuario
      const userCart = await cartService.getUserCart();
      
      console.log('Carrito cargado:', userCart);
      
      if (userCart && userCart._id) {
        console.log('Procesando carrito encontrado:', userCart);
        setCart(userCart);
        setCartId(userCart._id);
        
        // Transformar los productos para que coincidan con el formato esperado por el componente
        if (userCart.products && userCart.products.length > 0) {
          console.log('Productos en carrito:', JSON.stringify(userCart.products));
          
          const cartItems = userCart.products.map(item => {
            // Verificar si idProduct es un objeto o solo un ID
            let product;
            if (item.idProduct) {
              if (typeof item.idProduct === 'object') {
                product = item.idProduct;
              } else {
                // Si es solo un ID, creamos un objeto básico
                product = { _id: item.idProduct };
                console.log('ID de producto como string:', item.idProduct);
              }
            } else if (item.product) {
              // Algunos backends usan 'product' en lugar de 'idProduct'
              product = typeof item.product === 'object' ? item.product : { _id: item.product };
              console.log('Usando campo product:', product);
            }
            
            // Asegurarnos de que product existe
            if (!product) {
              console.warn('Producto no encontrado en item:', item);
              product = { _id: 'unknown' };
            }
            
            console.log('Producto procesado:', product);
            
            return {
              id: product._id,
              name: product.name || 'Producto',
              price: product.price || 0,
              quantity: item.quantity || 1,
              image: product.imagery?.url || product.imageUrl || 'https://placehold.co/200x200/e9d8c4/333333?text=Producto'
            };
          });
          
          console.log('Items procesados para el carrito:', cartItems);
          setItems(cartItems);
        } else {
          console.log('Carrito sin productos');
          setItems([]);
        }
        
        // Si hay un código de descuento aplicado
        if (userCart.discountCodesId) {
          setDiscountApplied(true);
          // Calcular el descuento basado en el total del carrito
          // Por ahora usamos un valor fijo del 10% como ejemplo
          const discount = (userCart.total || 0) * 0.1;
          setDiscountAmount(discount);
        } else {
          setDiscountApplied(false);
          setDiscountAmount(0);
        }
      } else {
        console.log('No se encontró carrito, creando uno nuevo');
        // Si no hay carrito, creamos uno nuevo
        const newCart = await cartService.createCart();
        console.log('Nuevo carrito creado:', newCart);
        setCart(newCart);
        setCartId(newCart._id);
        setItems([]);
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setError('No se pudo cargar el carrito de compras');
      setCart(null);
      setCartId(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]); // Añadimos user a las dependencias porque lo usamos para almacenar el userId
  
  // Cargar carrito cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      // Si no está autenticado, limpiar el carrito
      setCart(null);
      setCartId(null);
      setItems([]);
      setDiscountApplied(false);
      setDiscountAmount(0);
    }
  }, [isAuthenticated, user, loadCart]);



  // Los descuentos se calculan directamente dentro de las funciones que los necesitan

  // Función para añadir un producto al carrito
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    
    try {
      setLoading(true);
      
      if (!cartId) {
        // Si no hay un carrito, creamos uno nuevo
        const newCart = await cartService.createCart();
        setCart(newCart);
        setCartId(newCart._id);
      }
      
      // Añadir el producto al carrito
      const updatedCart = await cartService.addProductToCart(cartId, product._id, quantity);
      
      // Actualizar el estado local
      setCart(updatedCart);
      
      // Transformar los productos para que coincidan con el formato esperado
      const cartItems = updatedCart.products.map(item => ({
        id: item.idProduct._id || item.idProduct,
        name: item.idProduct.name || 'Producto',
        price: item.idProduct.price || 0,
        quantity: item.quantity,
        image: item.idProduct.imagery?.url || 'https://placehold.co/200x200/e9d8c4/333333?text=Producto'
      }));
      
      setItems(cartItems);
      
      return true;
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      setError('No se pudo añadir el producto al carrito');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para incrementar la cantidad de un producto
  const incrementQuantity = async (productId) => {
    try {
      if (!cartId) return;
      
      setLoading(true);
      
      // Encontrar el ítem actual
      const currentItem = items.find(item => item.id === productId);
      if (!currentItem) return;
      
      // Actualizar cantidad en el backend
      const updatedCart = await cartService.updateProductQuantity(
        cartId, 
        productId, 
        currentItem.quantity + 1
      );
      
      // Actualizar el estado local
      setCart(updatedCart);
      
      // Actualizar los items locales también
      setItems(items.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
      
    } catch (error) {
      console.error('Error al incrementar cantidad:', error);
      setError('No se pudo actualizar la cantidad');
    } finally {
      setLoading(false);
    }
  };

  // Función para decrementar la cantidad de un producto
  const decrementQuantity = async (productId) => {
    try {
      if (!cartId) return;
      
      setLoading(true);
      
      // Encontrar el ítem actual
      const currentItem = items.find(item => item.id === productId);
      if (!currentItem || currentItem.quantity <= 1) return;
      
      // Actualizar cantidad en el backend
      const updatedCart = await cartService.updateProductQuantity(
        cartId, 
        productId, 
        currentItem.quantity - 1
      );
      
      // Actualizar el estado local
      setCart(updatedCart);
      
      // Actualizar los items locales también
      setItems(items.map(item => 
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
      
    } catch (error) {
      console.error('Error al decrementar cantidad:', error);
      setError('No se pudo actualizar la cantidad');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = async (productId) => {
    try {
      if (!cartId) return;
      
      setLoading(true);
      
      // Eliminar producto en el backend
      const updatedCart = await cartService.removeProductFromCart(cartId, productId);
      
      // Actualizar el estado local
      setCart(updatedCart);
      
      // Filtrar el producto del array local
      setItems(items.filter(item => item.id !== productId));
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setError('No se pudo eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  // Función para aplicar un código de descuento
  const applyDiscountCode = async (code) => {
    try {
      if (!cartId || !code) return;
      
      setLoading(true);
      
      // En una implementación real, aquí llamarías a tu API para validar y aplicar el código
      // Por ahora, simulamos un descuento del 10% si el código es 'WORKBUDDY10'
      if (code.toUpperCase() === 'WORKBUDDY10') {
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = subtotal * 0.1; // 10% de descuento
        
        setDiscountApplied(true);
        setDiscountAmount(discount);
        
        // En una implementación real, actualizarías el carrito en el backend
        // const updatedCart = await cartService.applyDiscountCode(cartId, code);
        // setCart(updatedCart);
        
        return true;
      }
      
      setDiscountApplied(false);
      setDiscountAmount(0);
      return false;
      
    } catch (error) {
      console.error('Error al aplicar código de descuento:', error);
      setError('No se pudo aplicar el código de descuento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para vaciar el carrito
  const clearCart = async () => {
    try {
      if (!cartId) return;
      
      setLoading(true);
      
      // En una implementación real, llamarías a tu API para vaciar el carrito
      // const response = await cartService.clearCart(cartId);
      
      // Por ahora, simplemente reiniciamos el estado local
      setItems([]);
      setDiscountApplied(false);
      setDiscountAmount(0);
      
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      setError('No se pudo vaciar el carrito');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para crear una orden a partir del carrito
  const createOrder = async (orderData) => {
    if (!cartId) {
      console.error('No hay carrito para crear la orden');
      return { success: false, error: 'No hay productos en el carrito' };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Preparar datos de la orden
      const orderPayload = {
        CartId: cartId,
        payMethod: orderData.payMethod,
        shippingAdress: orderData.shippingAdress
      };
      
      console.log('Creando orden con datos:', orderPayload);
      
      // Llamar al servicio para crear la orden
      const result = await ordersService.createOrder(orderPayload);
      
      console.log('Resultado de crear orden:', result);
      
      // Si la orden se crea con éxito, limpiar el carrito
      if (result && result.order) {
        await clearCart();
        return { success: true, orderId: result.order._id };
      } else {
        setError('Error al crear la orden');
        return { success: false, error: 'Error al crear la orden' };
      }
    } catch (error) {
      console.error('Error al crear la orden:', error);
      setError(error.message || 'Error al procesar el pedido');
      return { 
        success: false, 
        error: error.message || 'Error al procesar el pedido' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Calcular subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calcular total con descuento
  const total = subtotal - discountAmount;

  // Valor del contexto
  const value = {
    cart,
    cartId,
    items,
    loading,
    error,
    subtotal,
    total,
    discountApplied,
    discountAmount,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    applyDiscountCode,
    clearCart,
    createOrder,
    refreshCart: loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
