import axios from 'axios';

// Configura la URL base
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const favoritesService = {
  // Obtener los productos favoritos del usuario
  getFavorites: async () => {
    try {
      const response = await axios.get(`${API_URL}/wb/favorites`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener favoritos');
    }
  },

  // Agregar un producto a favoritos
  addToFavorites: async (productId) => {
    try {
      const response = await axios.post(`${API_URL}/wb/favorites/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al agregar a favoritos');
    }
  },

  // Eliminar un producto de favoritos
  removeFromFavorites: async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/wb/favorites/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al eliminar de favoritos');
    }
  },

  // Verificar si un producto está en favoritos
  isProductInFavorites: async (productId, favorites) => {
    // Si ya tenemos los favoritos, verificamos si el producto está en ellos
    if (favorites) {
      return favorites.some(product => product._id === productId);
    }
    
    // Si no tenemos los favoritos, los obtenemos y verificamos
    try {
      const favorites = await favoritesService.getFavorites();
      return favorites.some(product => product._id === productId);
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return false;
    }
  }
};

export default favoritesService;
