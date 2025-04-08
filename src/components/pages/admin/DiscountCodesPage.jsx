import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Check, X, Loader } from 'lucide-react';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import discountCodeService from '../../../services/discountCodeService';
import { useAuth } from '../../../hooks/useAuth';

export function DiscountCodesPage() {
  const { isAuthenticated, user } = useAuth();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' o 'edit'
  const [currentCode, setCurrentCode] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    percentage: 10,
    isActive: true,
    clientsId: []
  });
  
  // Redirigir si no tiene permisos de administrador
  if (!isAuthenticated) {
    window.location.href = '/iniciar-sesion?redirect=/admin/discount-codes';
    return null;
  }
  
  // Solo usuarios admin pueden acceder
  if (user && user.role !== 'admin') {
    window.location.href = '/';
    return null;
  }
  
  // Cargar códigos al inicio
  useEffect(() => {
    fetchCodes();
  }, []);
  
  // Obtener todos los códigos desde la API
  const fetchCodes = async () => {
    try {
      setLoading(true);
      const data = await discountCodeService.getCodes();
      setCodes(data);
    } catch (err) {
      console.error('Error al cargar códigos de descuento:', err);
      setError('No se pudieron cargar los códigos de descuento');
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      code: '',
      percentage: 10,
      isActive: true,
      clientsId: []
    });
    setFormMode('add');
    setCurrentCode(null);
  };
  
  // Editar un código existente
  const handleEditCode = (code) => {
    setCurrentCode(code);
    setFormData({
      code: code.code,
      percentage: code.percentage,
      isActive: code.isActive,
      clientsId: code.clientsId || []
    });
    setFormMode('edit');
  };
  
  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (formMode === 'add') {
        await discountCodeService.createCode(formData);
      } else {
        await discountCodeService.updateCode(currentCode._id, formData);
      }
      
      // Recargar la lista y resetear el formulario
      await fetchCodes();
      resetForm();
    } catch (err) {
      console.error('Error al guardar código de descuento:', err);
      setError('No se pudo guardar el código de descuento');
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar un código
  const handleDeleteCode = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este código?')) {
      return;
    }
    
    try {
      setLoading(true);
      await discountCodeService.deleteCode(id);
      // Recargar la lista
      await fetchCodes();
    } catch (err) {
      console.error('Error al eliminar código de descuento:', err);
      setError('No se pudo eliminar el código de descuento');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-brown-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-brown-900">Códigos de Descuento</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Formulario para agregar/editar código */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {formMode === 'add' ? 'Agregar nuevo código' : 'Editar código'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="DESCUENTO20"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje de descuento
                </label>
                <input
                  type="number"
                  id="percentage"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min="1"
                  max="100"
                  required
                />
              </div>
              
              <div className="mb-4 flex items-center">
                <label htmlFor="isActive" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isActive ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium">Activo</div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              {formMode === 'edit' && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
              
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  formMode === 'add' ? 'Agregar Código' : 'Actualizar Código'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Lista de códigos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Porcentaje
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clientes asignados
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && !codes.length ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Loader className="h-8 w-8 text-green-500 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No hay códigos de descuento. Agrega uno nuevo.
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{code.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{code.percentage}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        code.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {code.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {code.clientsId && code.clientsId.length 
                          ? `${code.clientsId.length} cliente(s)` 
                          : 'Todos los clientes'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCode(code)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCode(code._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
