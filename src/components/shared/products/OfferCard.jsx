import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ShoppingCart, Check, Heart, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../hooks/useAuth'
import favoritesService from '../../../services/favoritesService'
import offersService from '../../../services/offersService'

export function OfferCard({ product: offer }) {
  // Extraer el producto de la oferta
  const product = offer.productId;
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  // Validamos el producto
  const isValidProduct = !!product;
  
  // Compatibilidad con diferentes estructuras de datos
  const id = product._id || product.id || '1';
  const name = product.name || product.title || 'Oferta Especial';
  const imageUrl = 
    product.imagery?.url || 
    product.image || 
    "/tiendaEjem.jpeg";
  
  // Valores por defecto para evitar errores
  const stock = product.stock === undefined ? 10 : product.stock;
  const originalPrice = product.price || 0;
  
  // Calcular el precio con descuento según el tipo de descuento
  const discountPrice = offersService.calculateDiscountedPrice(product, offer);
  
  // Calcular el porcentaje de descuento
  const discountPercentage = offer.discountType === 'percentage' ? 
    offer.percentage : 
    Math.round((originalPrice - discountPrice) / originalPrice * 100);
  
  const category = product.category || 'oferta';
  const description = product.description || 'Sin descripción';
  
  // Función para añadir al carrito
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirigir a la página de login si no está autenticado
      window.location.href = '/iniciar-sesion';
      return;
    }
    
    if (stock <= 0) return;
    
    try {
      // Al añadir al carrito, usamos el precio con descuento y añadimos info de la oferta
      const productWithDiscountPrice = {
        ...product,
        price: discountPrice,
        originalPrice: originalPrice,
        offerId: offer._id,
        offerType: offer.discountType,
        offerValue: offer.discountType === 'percentage' ? offer.percentage : offer.value
      };

      // Intentar agregar al carrito
      const success = await addToCart(productWithDiscountPrice);
      
      if (success) {
        // Mostrar estado de éxito
        setAdded(true);
        
        // Mostrar estado añadido por 2 segundos
        setTimeout(() => {
          setAdded(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };
  
  // Verificar si el producto está en favoritos cuando se carga el componente
  useEffect(() => {
    if (isAuthenticated && isValidProduct && product && product._id) {
      const checkFavoriteStatus = async () => {
        try {
          const isInFavorites = await favoritesService.isProductInFavorites(product._id);
          setIsFavorite(isInFavorites);
        } catch (error) {
          console.error('Error al verificar estado de favorito:', error);
        }
      };
      
      checkFavoriteStatus();
    }
  }, [isAuthenticated, product, isValidProduct]);

  // Función para añadir a favoritos
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      // Redirigir a la página de login si no está autenticado
      window.location.href = '/iniciar-sesion';
      return;
    }
    
    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        // Remover de favoritos
        await favoritesService.removeFromFavorites(product._id);
      } else {
        // Agregar a favoritos
        await favoritesService.addToFavorites(product._id);
      }
      
      // Cambiar el estado local
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };
  
  // Si el producto no es válido, no renderizar nada
  if (!isValidProduct) {
    console.error('Oferta sin producto válido:', offer);
    return null;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-amber-200">
      <div className="relative">
        <div className="h-48 relative">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/tiendaEjem.jpeg';
            }}
          />
          <button 
            onClick={handleToggleFavorite} 
            className={`absolute top-2 right-2 p-1.5 rounded-full ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-white text-gray-400 hover:text-red-400'} transition-colors shadow`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <span className="h-5 w-5 border-t-2 border-b-2 border-current rounded-full animate-spin inline-block"></span>
            ) : (
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            )}
          </button>
          
          {/* Badge de oferta */}
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {offer.discountType === 'percentage' ? 
              `${discountPercentage}% OFF` : 
              `$${offer.value} OFF`
            }
          </div>
        </div>
        {stock <= 5 && stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            ¡ÚLTIMAS {stock} UNIDADES!
          </div>
        )}
        {stock === 0 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            AGOTADO
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg text-brown-900 mb-1">{name}</h3>
        <p className="text-brown-600 text-sm mb-2 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-bold text-lg text-red-600">${typeof discountPrice === 'number' ? discountPrice.toFixed(2) : discountPrice}</p>
            <p className="text-gray-500 text-sm line-through">${typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice}</p>
          </div>
          <span className="text-sm text-brown-600">{category}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`flex items-center justify-center ${added ? 'bg-green-600' : 'bg-red-600'} text-white px-3 py-1.5 rounded text-sm ${!loading && stock > 0 ? added ? 'hover:bg-green-700' : 'hover:bg-red-700' : 'opacity-50 cursor-not-allowed'} transition-colors min-w-[120px]`}
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
          <Link to={`/productos/${id}`} className="border border-brown-900 text-brown-900 px-3 py-1.5 rounded text-sm hover:bg-brown-100 transition-colors flex-grow text-center">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  )
}

OfferCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    productId: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      category: PropTypes.string,
      price: PropTypes.number,
      stock: PropTypes.number,
      imagery: PropTypes.shape({
        url: PropTypes.string,
        public_id: PropTypes.string,
        filename: PropTypes.string
      })
    }),
    discountType: PropTypes.oneOf(['percentage', 'fixed_value']),
    percentage: PropTypes.number,
    value: PropTypes.number,
    from: PropTypes.string,
    to: PropTypes.string,
    state: PropTypes.oneOf(['active', 'inactive', 'scheduled', 'expired'])
  }).isRequired
}
