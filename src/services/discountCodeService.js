import axios from 'axios';
import { API_URL } from './api/config.js';

const discountCodeService = {
  // Obtener todos los códigos de descuento
  getCodes: async () => {
    try {
      const response = await axios.get(`${API_URL}/dcodes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener códigos de descuento:', error);
      throw error;
    }
  },

  // Crear un nuevo código de descuento
  createCode: async (codeData) => {
    try {
      const response = await axios.post(`${API_URL}/dcodes`, codeData);
      return response.data;
    } catch (error) {
      console.error('Error al crear código de descuento:', error);
      throw error;
    }
  },

  // Actualizar un código de descuento existente
  updateCode: async (id, codeData) => {
    try {
      const response = await axios.put(`${API_URL}/dcodes/${id}`, codeData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar código de descuento:', error);
      throw error;
    }
  },

  // Eliminar un código de descuento
  deleteCode: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/dcodes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar código de descuento:', error);
      throw error;
    }
  },

  // Obtener un código de descuento por su valor
  getCodeByCode: async (code) => {
    try {
      const response = await axios.get(`${API_URL}/dcodes/code/${code}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener código de descuento por su valor:', error);
      throw error;
    }
  },

  // Obtener un código por ID
  getCodeById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/dcodes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener código de descuento por ID:', error);
      throw error;
    }
  }
};

export default discountCodeService;
