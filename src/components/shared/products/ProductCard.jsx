import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../hooks/useAuth'

export function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [added, setAdded] = useState(false);
  
  // Compatibilidad con diferentes estructuras de datos
  const id = product._id || product.id || '1';
  const name = product.name || product.title || 'Producto';
  const imageUrl = 
    product.imagery?.url || 
    product.image || 
    "https://via.placeholder.com/300";
  
  // Valores por defecto para evitar errores
  const stock = product.stock === undefined ? 10 : product.stock;
  const price = product.price || 0;
  const category = product.category || 'general';
  const description = product.description || 'Sin descripción';
  
  // Función para añadir al carrito
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirigir a la página de login si no está autenticado
      window.location.href = '/iniciar-sesion';
      return;
    }
    
    if (stock <= 0) return;
    
    const success = await addToCart(product);
    if (success) {
      setAdded(true);
      // Mostrar estado añadido por 2 segundos
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    }
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="h-48 relative">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300';
            }}
          />
        </div>
        {stock <= 5 && stock > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            ¡ÚLTIMAS {stock} UNIDADES!
          </div>
        )}
        {stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            AGOTADO
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg text-brown-900 mb-1">{name}</h3>
        <p className="text-brown-600 text-sm mb-2 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-lg">${typeof price === 'number' ? price.toFixed(2) : price}</p>
          <span className="text-sm text-brown-600">{category}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`flex items-center justify-center ${added ? 'bg-green-600' : 'bg-brown-900'} text-white px-3 py-1.5 rounded text-sm ${!loading && stock > 0 ? added ? 'hover:bg-green-700' : 'hover:bg-brown-800' : 'opacity-50 cursor-not-allowed'} transition-colors min-w-[120px]`}
            disabled={loading || stock <= 0}
            onClick={handleAddToCart}
          >
            {loading ? (
              <span className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
            ) : added ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Añadido
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Añadir
              </>
            )}
          </button>
          <Link to={`/productos/${id}`} className="border border-brown-900 text-brown-900 px-3 py-1.5 rounded text-sm hover:bg-brown-100 transition-colors">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    imagery: PropTypes.shape({
      url: PropTypes.string.isRequired,
      public_id: PropTypes.string.isRequired,
      filename: PropTypes.string
    })
  }).isRequired
}
