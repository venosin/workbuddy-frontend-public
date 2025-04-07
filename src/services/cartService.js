import axios from 'axios';

// Configura la URL base - ajustado para tu backend
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const cartService = {
  // Obtener el carrito del usuario actual
  getUserCart: async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        console.warn('No se encontró userId en localStorage, verificando token...');
        // Intentar obtener el userId del token si está disponible
        if (!token) {
          throw new Error('Usuario no autenticado');
        }
      }
      
      // Configurar el header de autorización para la petición
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      };
      
      // Intentamos obtener el carrito activo del usuario
      console.log('Buscando carrito activo para el usuario:', userId);
      const response = await axios.get(`${API_URL}/wb/shoppingCarts`, config);
      
      // Filtrar para encontrar el carrito activo o pendiente del usuario actual
      const userCarts = response.data.filter(cart => {
        console.log('Evaluando carrito:', cart._id, 'clienteId:', cart.clienteId, 'state:', cart.state);
        
        // Verificar si clienteId es un objeto o un string
        const cartClientId = cart.clienteId && typeof cart.clienteId === 'object' 
          ? cart.clienteId._id 
          : cart.clienteId;
        
        // Incluir carritos con estado 'active' o 'pending'
        return cartClientId === userId && (cart.state === 'active' || cart.state === 'pending');
      });
      
      if (userCarts.length > 0) {
        console.log('Carrito encontrado:', userCarts[0]);
        return userCarts[0];
      } else {
        console.log('No se encontró un carrito activo, creando uno nuevo');
        // Si no hay carrito activo, creamos uno nuevo
        return await cartService.createCart();
      }
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      // Si hay un error de autenticación o no se encuentra el carrito
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        // Devolvemos un objeto vacío para crear uno nuevo si es necesario
        return { products: [], total: 0, state: 'active' };
      }
      throw error;
    }
  },
  
  // Crear un nuevo carrito
  createCart: async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }
      
      // Configurar el header de autorización para la petición
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      };
      
      const newCart = {
        clienteId: userId,
        products: [],
        discountCodesId: null,
        total: 0,
        state: 'active'
      };
      
      console.log('Creando nuevo carrito con datos:', newCart);
      const response = await axios.post(`${API_URL}/wb/shoppingCarts`, newCart, config);
      console.log('Respuesta al crear carrito:', response.data);
      return response.data.cart;
    } catch (error) {
      console.error('Error creando carrito:', error);
      throw error;
    }
  },
  
  // Añadir producto al carrito
  addProductToCart: async (cartId, productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      
      // Configurar el header de autorización para la petición
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      };
      
      console.log(`Añadiendo producto ${productId} al carrito ${cartId} con cantidad ${quantity}`);
      const response = await axios.post(`${API_URL}/wb/shoppingCarts/${cartId}/addProduct`, {
        idProduct: productId,
        quantity: quantity
      }, config);
      
      console.log('Producto añadido al carrito:', response.data);
      return response.data.cart;
    } catch (error) {
      console.error('Error añadiendo producto al carrito:', error);
      throw error;
    }
  },
  
  // Eliminar producto del carrito
  removeProductFromCart: async (cartId, productId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Configurar el header de autorización para la petición
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      };
      
      console.log(`Eliminando producto ${productId} del carrito ${cartId}`);
      const response = await axios.post(`${API_URL}/wb/shoppingCarts/${cartId}/removeProduct`, {
        idProduct: productId
      }, config);
      
      console.log('Producto eliminado del carrito:', response.data);
      return response.data.cart;
    } catch (error) {
      console.error('Error eliminando producto del carrito:', error);
      throw error;
    }
  },
  
  // Actualizar la cantidad de un producto en el carrito
  updateProductQuantity: async (cartId, productId, quantity) => {
    try {
      // Primero obtenemos el carrito actual
      const cartResponse = await axios.get(`${API_URL}/wb/shoppingCarts/${cartId}`);
      const cart = cartResponse.data;
      
      // Actualizamos la cantidad del producto específico
      const updatedProducts = cart.products.map(item => {
        if (item.idProduct._id === productId || item.idProduct === productId) {
          return { ...item, quantity: quantity };
        }
        return item;
      });
      
      // Calculamos el nuevo total (esto es una simplificación, idealmente el backend calculará el total)
      // En una implementación real, se deberían considerar descuentos, impuestos, etc.
      
      // Actualizamos el carrito
      const response = await axios.put(`${API_URL}/wb/shoppingCarts/${cartId}`, {
        ...cart,
        products: updatedProducts
      });
      
      return response.data.cart;
    } catch (error) {
      console.error('Error actualizando cantidad de producto:', error);
      throw error;
    }
  },
  
  // Aplicar código de descuento
  applyDiscountCode: async (cartId, code) => {
    try {
      // Esta función dependerá de cómo esté implementado el backend para los códigos de descuento
      // Por ahora, es un ejemplo básico
      const response = await axios.post(`${API_URL}/wb/shoppingCarts/${cartId}/applyDiscount`, {
        discountCode: code
      });
      
      return response.data;
    } catch (error) {
      console.error('Error aplicando código de descuento:', error);
      throw error;
    }
  },
  
  // Vaciar el carrito
  clearCart: async (cartId) => {
    try {
      const response = await axios.put(`${API_URL}/wb/shoppingCarts/${cartId}/clear`, {});
      return response.data;
    } catch (error) {
      console.error('Error vaciando el carrito:', error);
      throw error;
    }
  }
};

export default cartService;
