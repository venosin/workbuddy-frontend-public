import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import favoritesService from '../../../services/favoritesService';
import { BackButton } from '../../shared/ui/BackButton';

export function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await favoritesService.getFavorites();
        setFavorites(data);
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
        setError('No se pudieron cargar los productos favoritos. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFromFavorites = async (productId) => {
    try {
      await favoritesService.removeFromFavorites(productId);
      // Actualizar la lista local de favoritos
      setFavorites(prevFavorites => prevFavorites.filter(product => product._id !== productId));
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
      setError('No se pudo eliminar el producto de favoritos. Por favor, intenta de nuevo.');
    }
  };

  // Contenido cuando está cargando
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Contenido cuando hay un error
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Contenido cuando no hay favoritos
  if (favorites.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <Heart size={32} />
        </div>
        <h3 className="text-lg font-medium text-brown-900 mb-2">No tienes productos favoritos</h3>
        <p className="text-brown-600 max-w-md mx-auto">
          Añade productos a tus favoritos para verlos aquí y tener acceso rápido a ellos.
        </p>
        <button 
          onClick={() => window.location.href = '/tienda'}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Explorar productos
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <BackButton className="text-brown-600 hover:text-brown-800" label="Volver al inicio" toPath="/" />
      </div>
      <h2 className="text-xl font-semibold text-brown-900 mb-6">Mis Favoritos</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              {/* Imagen del producto */}
              <img 
                src={product.imagery?.url || product.image || '/images/product-placeholder.png'} 
                alt={product.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' font-family='Arial' font-size='18' fill='%23777777' text-anchor='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";
                }}
                className="w-full h-48 object-cover"
              />
              
              {/* Botón para eliminar de favoritos */}
              <button
                onClick={() => handleRemoveFromFavorites(product._id)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50"
                title="Eliminar de favoritos"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-brown-900 truncate" title={product.name}>
                  {product.name}
                </h3>
                <div className="font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              
              <p className="mt-1 text-sm text-brown-600 line-clamp-2" title={product.description}>
                {product.description || 'Sin descripción disponible'}
              </p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {product.category || 'Sin categoría'}
                </span>
                
                <button
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Añadir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
