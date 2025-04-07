import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} - El valor del contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
