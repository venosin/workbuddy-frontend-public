import axios from 'axios';

// Configura la URL base (misma que en productsService)
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const offersService = {
  // Obtener todas las ofertas con sus productos asociados
  getOffers: async () => {
    try {
      const response = await axios.get(`${API_URL}/wb/offers`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener ofertas');
    }
  },

  // Obtener una oferta específica por ID
  getOffer: async (offerId) => {
    try {
      const response = await axios.get(`${API_URL}/wb/offers/${offerId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al obtener la oferta');
    }
  },

  // Crear una nueva oferta
  createOffer: async (offerData) => {
    try {
      const response = await axios.post(`${API_URL}/wb/offers`, offerData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al crear la oferta');
    }
  },

  // Actualizar una oferta existente
  updateOffer: async (offerId, offerData) => {
    try {
      const response = await axios.put(`${API_URL}/wb/offers/${offerId}`, offerData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al actualizar la oferta');
    }
  },

  // Eliminar una oferta
  deleteOffer: async (offerId) => {
    try {
      const response = await axios.delete(`${API_URL}/wb/offers/${offerId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al eliminar la oferta');
    }
  },
  
  // Filtrar oferta por productos activos (helper function)
  filterActiveOffers: (offers) => {
    const now = new Date();
    return offers.filter(offer => {
      return offer.state === 'active' && 
             new Date(offer.from) <= now && 
             new Date(offer.to) >= now;
    });
  },

  // Calcular el precio con descuento para un producto
  calculateDiscountedPrice: (product, offer) => {
    if (!product || !offer) return null;

    const price = product.price;
    
    if (offer.discountType === 'percentage' && offer.percentage) {
      // Descuento porcentual
      return price - (price * (offer.percentage / 100));
    } else if (offer.discountType === 'fixed_value' && offer.value) {
      // Descuento de valor fijo
      return Math.max(0, price - offer.value); // Para evitar precios negativos
    }
    
    return price; // Si no hay descuento aplicable
  },
  
  // Preparar datos de ejemplo para cuando la API no está disponible
  // Estos datos simulan la respuesta del backend con productos poblados
  getSampleOffers: () => {
    return [
      {
        _id: '607f1f77bcf86cd799439021',
        productId: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Computadora de Oficina',
          description: 'Computadora básica de trabajo ideal para tareas administrativas',
          category: 'oficina',
          price: 599.99,
          stock: 10,
          imagery: {
            url: '/tiendaEjem.jpeg',
            public_id: 'sample_1',
            filename: 'computadora.jpg'
          }
        },
        discountType: 'percentage',
        percentage: 15,
        value: null,
        from: new Date('2025-01-01').toISOString(),
        to: new Date('2025-12-31').toISOString(),
        state: 'active'
      },
      {
        _id: '607f1f77bcf86cd799439022',
        productId: {
          _id: '507f1f77bcf86cd799439012',
          name: 'Laptop Corporativa',
          description: 'Laptop potente para trabajo en movimiento',
          category: 'tecnologia',
          price: 899.99,
          stock: 5,
          imagery: {
            url: '/tiendaEjem.jpeg',
            public_id: 'sample_2',
            filename: 'laptop.jpg'
          }
        },
        discountType: 'fixed_value',
        percentage: null,
        value: 100,
        from: new Date('2025-01-01').toISOString(),
        to: new Date('2025-12-31').toISOString(),
        state: 'active'
      },
      {
        _id: '607f1f77bcf86cd799439023',
        productId: {
          _id: '507f1f77bcf86cd799439013',
          name: 'Set de Bolígrafos Premium',
          description: 'Conjunto de bolígrafos de alta calidad para ejecutivos',
          category: 'papeleria',
          price: 29.99,
          stock: 50,
          imagery: {
            url: '/tiendaEjem.jpeg',
            public_id: 'sample_3',
            filename: 'boligrafos.jpg'
          }
        },
        discountType: 'percentage',
        percentage: 30,
        value: null,
        from: new Date('2025-01-01').toISOString(),
        to: new Date('2025-12-31').toISOString(),
        state: 'active'
      }
    ];
  }
};

export default offersService;
