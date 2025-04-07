import axios from 'axios';

// Configura la URL base
const API_URL = 'http://localhost:4000';

// Configura axios para que incluya las cookies en las solicitudes
axios.defaults.withCredentials = true;

const profileService = {
  // Obtener información del perfil del usuario actual
  getUserProfile: async () => {
    try {
      // Ajustado a la ruta del controlador de perfil (basado en las rutas del backend)
      const response = await axios.get(`${API_URL}/wb/profile`);
      console.log('Perfil obtenido correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error.response ? error.response.data : new Error('Error al obtener perfil');
    }
  },

  // Actualizar información del perfil
  updateUserProfile: async (profileData) => {
    try {
      // Si estamos enviando una imagen, necesitamos usar FormData
      if (profileData instanceof FormData) {
        const response = await axios.put(`${API_URL}/wb/profile`, profileData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        // Si solo son datos regulares
        const response = await axios.put(`${API_URL}/wb/profile`, profileData);
        return response.data;
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al actualizar perfil');
    }
  },

  // Función auxiliar para preparar FormData con la imagen de perfil
  prepareProfileUpdateWithImage: (profileData, imageFile) => {
    const formData = new FormData();
    
    // Agregar datos básicos del perfil
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.phoneNumber) formData.append('phoneNumber', profileData.phoneNumber);
    if (profileData.address) formData.append('address', profileData.address);
    
    // Agregar la imagen
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }
    
    return formData;
  }
};

export default profileService;
