/**
 * Utilidades para normalizar y validar tipos de usuario
 */

// Mapeo de tipos de usuario (singular a plural)
const USER_TYPE_MAP = {
  'client': 'clients',
  'employee': 'employees',
  'admin': 'admin'  // Admin se mantiene igual
};

/**
 * Normaliza el tipo de usuario al formato esperado por el backend
 * @param {string} userType - Tipo de usuario en cualquier formato
 * @returns {string} Tipo de usuario normalizado
 */
export const normalizeUserType = (userType) => {
  if (!userType) return 'clients'; // Valor por defecto
  
  // Si ya está en el formato correcto, devolverlo
  if (['clients', 'employees', 'admin'].includes(userType)) {
    return userType;
  }
  
  // Convertir a minúsculas para normalizar
  const lowerType = userType.toLowerCase();
  
  // Usar el mapeo para normalizar
  return USER_TYPE_MAP[lowerType] || 'clients';
};

/**
 * Valida si un tipo de usuario es válido
 * @param {string} userType - Tipo de usuario a validar
 * @returns {boolean} Verdadero si es válido
 */
export const isValidUserType = (userType) => {
  return ['clients', 'employees', 'admin'].includes(userType);
};
