import React, { useState } from 'react';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import productsService from '../../../services/productsService';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'oficina',
    price: '',
    stock: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? value : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que todos los campos estén completos
    if (!formData.name || !formData.description || !formData.category || !image) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar que price y stock sean números válidos
    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock, 10);
    
    if (isNaN(price) || price <= 0) {
      setError('El precio debe ser un número mayor que cero');
      return;
    }
    
    if (isNaN(stock) || stock < 0) {
      setError('El stock debe ser un número no negativo');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Crear un FormData para enviar los datos y la imagen
      const productFormData = new FormData();
      
      // Añadir los campos del formulario con valores numéricos para price y stock
      productFormData.append('name', formData.name);
      productFormData.append('description', formData.description);
      productFormData.append('category', formData.category);
      productFormData.append('price', price);
      productFormData.append('stock', stock);
      
      // Añadir la imagen
      productFormData.append('image', image);

      // Enviar los datos al servidor
      await productsService.createProduct(productFormData);
      
      setSuccess('¡Producto creado con éxito!');
      // Limpiar el formulario
      setFormData({
        name: '',
        description: '',
        category: 'oficina',
        price: '',
        stock: ''
      });
      setImage(null);
      setPreview(null);
      
    } catch (err) {
      console.error('Error al crear producto:', err);
      setError(err.message || 'Error al crear el producto. Verifica la conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brown-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <Link to="/tienda" className="text-brown-700 hover:text-brown-900 mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h2 className="text-2xl font-display font-bold text-brown-900">Añadir Nuevo Producto</h2>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-brown-700 mb-1 font-medium">Nombre del Producto</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Silla Ergonómica Deluxe"
              />
            </div>
            
            <div>
              <label className="block text-brown-700 mb-1 font-medium">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="4"
                placeholder="Describe detalladamente el producto, sus características y beneficios..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-brown-700 mb-1 font-medium">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="oficina">Oficina</option>
                <option value="tecnologia">Tecnología</option>
                <option value="papeleria">Papelería</option>
              </select>
            </div>
            
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-brown-700 mb-1 font-medium">Precio (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                />
              </div>
              
              <div className="w-1/2">
                <label className="block text-brown-700 mb-1 font-medium">Stock (unidades)</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-brown-700 mb-1 font-medium">Imagen del Producto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-brown-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {preview && (
                <div className="mt-2">
                  <p className="text-sm text-brown-600 mb-1">Vista previa:</p>
                  <img 
                    src={preview} 
                    alt="Vista previa" 
                    className="h-40 object-contain border border-brown-300 rounded p-1"
                  />
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creando producto...' : 'Crear Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
