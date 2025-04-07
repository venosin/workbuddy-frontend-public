import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Check } from 'lucide-react';
import productsService from '../../../services/productsService';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsService.getProduct(id);
        setProduct(data);
        setError(null);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setError('No se pudo cargar el producto. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      navigate('/iniciar-sesion');
      return;
    }
    
    if (!product || product.stock <= 0) return;
    
    console.log(`Añadir ${quantity} unidades del producto ${product._id} al carrito`);
    
    try {
      // Usar la función del contexto para añadir al carrito
      const success = await addToCart(product, quantity);
      
      if (success) {
        setAdded(true);
        // Reiniciar el estado después de 2 segundos
        setTimeout(() => {
          setAdded(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-brown-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Link to="/tienda" className="flex items-center text-brown-700 hover:text-brown-900 mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Volver a la tienda</span>
        </Link>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-900"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto my-6 max-w-4xl">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && product && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={product.imagery?.url || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center"
                  style={{ maxHeight: '500px' }}
                />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="uppercase tracking-wide text-sm text-brown-600 font-semibold mb-1">
                  {product.category}
                </div>
                <h1 className="text-3xl font-bold text-brown-900 mb-3">{product.name}</h1>
                <p className="text-2xl font-bold text-brown-900 mb-6">${product.price.toFixed(2)}</p>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                  <p className="text-brown-700">{product.description}</p>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Disponibilidad</h2>
                  {product.stock > 0 ? (
                    <p className="text-green-600">
                      {product.stock > 10 
                        ? 'En stock' 
                        : `¡Solo quedan ${product.stock} unidades!`}
                    </p>
                  ) : (
                    <p className="text-red-600">Agotado</p>
                  )}
                </div>
                
                {product.stock > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Cantidad</h2>
                    <div className="flex items-center">
                      <button 
                        onClick={decrementQuantity}
                        className="bg-gray-200 text-gray-700 rounded-l px-3 py-1"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="bg-white px-4 py-1 border-t border-b">
                        {quantity}
                      </span>
                      <button 
                        onClick={incrementQuantity}
                        className="bg-gray-200 text-gray-700 rounded-r px-3 py-1"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || cartLoading}
                  className={`flex items-center justify-center w-full py-3 px-6 rounded ${
                    added
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : product.stock > 0 && !cartLoading
                        ? 'bg-brown-900 text-white hover:bg-brown-800' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  {cartLoading ? (
                    <span className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                  ) : added ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      ¡Añadido al carrito!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {product.stock > 0 ? 'Añadir al carrito' : 'Producto agotado'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
