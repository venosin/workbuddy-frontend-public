import axios from 'axios';

// Configura la URL base
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const productsService = {
  // Obtener todos los productos
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/wb/products`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener productos');
    }
  },

  // Obtener un producto por ID
  getProduct: async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/wb/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener el producto');
    }
  },

  // Crear un nuevo producto
  createProduct: async (productData) => {
    try {
      // Si productData incluye un archivo de imagen, necesitamos usar FormData
      if (productData instanceof FormData) {
        const response = await axios.post(`${API_URL}/wb/products`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        throw new Error('Se requiere un FormData con la imagen del producto');
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al crear el producto');
    }
  },

  // Actualizar un producto existente
  updateProduct: async (productId, productData) => {
    try {
      // Si productData incluye un archivo de imagen, necesitamos usar FormData
      if (productData instanceof FormData) {
        const response = await axios.put(`${API_URL}/wb/products/${productId}`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Si solo son datos sin imagen, enviamos como JSON
        const response = await axios.put(`${API_URL}/wb/products/${productId}`, productData);
        return response.data;
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al actualizar el producto');
    }
  },

  // Eliminar un producto
  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/wb/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al eliminar el producto');
    }
  },

  // Buscar productos por término
  searchProducts: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/wb/products/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al buscar productos');
    }
  },

  // Filtrar productos por categoría
  getProductsByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/wb/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al filtrar productos por categoría');
    }
  },
  
  // Función de utilidad para preparar FormData para enviar un producto
  prepareProductFormData: (productData, imageFile) => {
    const formData = new FormData();
    
    // Agregar datos básicos del producto
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('stock', productData.stock);
    
    // Agregar la imagen si existe
    if (imageFile) {
      formData.append('productImage', imageFile);
    }
    
    return formData;
  }
};

export default productsService;
