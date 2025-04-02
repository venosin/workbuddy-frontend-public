import api from './config';

// Servicio para manejar todas las operaciones relacionadas con reviews
const reviewsService = {
  // Obtener todas las reviews (ya vienen con clientId y productId poblados)
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews');
      // Verificar que la respuesta sea un array
      if (!Array.isArray(response.data)) {
        console.warn('La respuesta de reviews no es un array:', response.data);
        return [];
      }
      return response.data;
    } catch (error) {
      console.error('Error al obtener reviews:', error);
      throw error;
    }
  },

  // Obtener una review específica por ID
  getReviewById: async (id) => {
    try {
      const response = await api.get(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la review con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva review
  createReview: async (reviewData) => {
    try {
      // Validar datos antes de enviar
      if (!reviewData.clientId || !reviewData.productId || !reviewData.score || !reviewData.comment) {
        throw new Error('Datos de review incompletos');
      }
      
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error al crear review:', error);
      throw error;
    }
  },
  
  // Obtener reviews por producto
  getReviewsByProduct: async (productId) => {
    try {
      if (!productId) {
        throw new Error('ID de producto no proporcionado');
      }
      
      const response = await api.get(`/reviews/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener reviews del producto ${productId}:`, error);
      throw error;
    }
  },
  
  // Actualizar una review
  updateReview: async (id, reviewData) => {
    try {
      if (!id) {
        throw new Error('ID de review no proporcionado');
      }
      
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la review con ID ${id}:`, error);
      throw error;
    }
  },
  
  // Eliminar una review
  deleteReview: async (id) => {
    try {
      if (!id) {
        throw new Error('ID de review no proporcionado');
      }
      
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la review con ID ${id}:`, error);
      throw error;
    }
  }
};

export default reviewsService;
