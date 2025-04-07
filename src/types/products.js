/**
 * @typedef {Object} Product
 * @property {string} _id - Identificador único del producto (MongoDB ObjectId)
 * @property {string} name - Nombre del producto
 * @property {string} description - Descripción del producto
 * @property {string} category - Categoría del producto
 * @property {number} price - Precio del producto
 * @property {number} stock - Cantidad disponible del producto
 * @property {Object} imagery - Información de la imagen
 * @property {string} imagery.url - URL de la imagen en Cloudinary
 * @property {string} imagery.public_id - ID público de la imagen en Cloudinary
 * @property {string} imagery.filename - Nombre original del archivo
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de última actualización
 */

// Exportación vacía para permitir la importación del archivo
export default {};
