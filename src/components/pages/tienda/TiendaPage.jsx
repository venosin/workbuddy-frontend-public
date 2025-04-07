import { useState, useEffect } from 'react'
import { Navbar } from "../../shared/navigation/Navbar"
import { Footer } from "../../shared/navigation/Footer"
import { HeroSection } from "./sections/HeroSection"
import { SearchBar } from "./sections/SearchBar"
import { ProductsSection } from "./sections/ProductsSection"
import productsService from '../../../services/productsService'

export function TiendaPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Productos de ejemplo para cuando la API no devuelve datos
  const sampleProducts = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Computadora de Oficina',
      description: 'Computadora básica de trabajo ideal para tareas administrativas',
      category: 'oficina',
      price: 599.99,
      stock: 10,
      imagery: {
        url: 'https://via.placeholder.com/300',
        public_id: 'sample_1',
        filename: 'computadora.jpg'
      }
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Laptop Corporativa',
      description: 'Laptop potente para trabajo en movimiento',
      category: 'tecnologia',
      price: 899.99,
      stock: 5,
      imagery: {
        url: 'https://via.placeholder.com/300',
        public_id: 'sample_2',
        filename: 'laptop.jpg'
      }
    },
    {
      _id: '507f1f77bcf86cd799439013',
      name: 'Set de Bolígrafos Premium',
      description: 'Conjunto de bolígrafos de alta calidad para ejecutivos',
      category: 'papeleria',
      price: 29.99,
      stock: 50,
      imagery: {
        url: 'https://via.placeholder.com/300',
        public_id: 'sample_3',
        filename: 'boligrafos.jpg'
      }
    },
    {
      _id: '507f1f77bcf86cd799439014',
      name: 'Silla Ergonómica',
      description: 'Silla de oficina con soporte lumbar ajustable',
      category: 'oficina',
      price: 249.99,
      stock: 8,
      imagery: {
        url: 'https://via.placeholder.com/300',
        public_id: 'sample_4',
        filename: 'silla.jpg'
      }
    },
    {
      _id: '507f1f77bcf86cd799439015',
      name: 'Monitor 27 pulgadas 4K',
      description: 'Monitor profesional con panel IPS y alta resolución',
      category: 'tecnologia',
      price: 349.99,
      stock: 12,
      imagery: {
        url: 'https://via.placeholder.com/300',
        public_id: 'sample_5',
        filename: 'monitor.jpg'
      }
    },
    {
      _id: '507f1f77bcf86cd799439016',
      name: 'Cuadernos Executivos',
      description: 'Pack de 3 cuadernos premium con tapas de cuero',
      category: 'papeleria',
      price: 39.99,
      stock: 20,
      imagery: {
        url: 'https://via.placeholder.com/300',
        public_id: 'sample_6',
        filename: 'cuadernos.jpg'
      }
    }
  ];

  // Cargar productos al inicio
  useEffect(() => {
    // Iniciar usando los productos de ejemplo para garantizar que algo se muestre
    setProducts(sampleProducts);
    setIsLoading(false);
    
    // Intentar cargar desde el API
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let data;
        try {
          // Intentar obtener datos de la API
          data = await productsService.getProducts();
          // Solo actualizar si hay datos
          if (data && data.length > 0) {
            setProducts(data);
          } else {
            // Si no hay datos, usar los de ejemplo
            console.log('La API devolvió un array vacío, usando datos de ejemplo');
            data = sampleProducts;
          }
        } catch (apiError) {
          console.warn('Error al conectar con la API, usando datos de ejemplo:', apiError);
          // Si falla, usar datos de ejemplo
          data = sampleProducts;
        }
        
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        // Si todo falla, cargar datos de ejemplo
        setProducts(sampleProducts);
        setError('Error al conectar con la API. Mostrando datos de ejemplo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Manejar búsquedas
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      // Si no hay término, mostrar todos los productos
      setProducts(sampleProducts);
      return;
    }
    
    // Filtrar localmente entre los productos disponibles
    const filteredProducts = sampleProducts.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase())
    );
    
    setProducts(filteredProducts);
  };

  // Filtrar productos por categoría
  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  // Productos por categoría
  const officeProducts = getProductsByCategory('oficina');
  const stationeryProducts = getProductsByCategory('papeleria');
  const techProducts = getProductsByCategory('tecnologia');

  return (
    <div className="flex min-h-screen flex-col bg-brown-100">
      <Navbar />
      <HeroSection />
      
      <SearchBar onSearch={handleSearch} />

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-900"></div>
        </div>
      )}

      {error && (
        <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded mx-auto my-6 max-w-4xl">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && (
        <>
          {searchTerm ? (
            <ProductsSection id="search-results" title={`Resultados para "${searchTerm}"`} products={products} />
          ) : (
            <>
              {officeProducts.length > 0 && (
                <ProductsSection id="office-supplies" title="Productos de Oficina" products={officeProducts} />
              )}

              {techProducts.length > 0 && (
                <ProductsSection
                  id="tech-products"
                  title="Tecnología"
                  products={techProducts}
                  bgColor="bg-brown-200/50"
                />
              )}

              {stationeryProducts.length > 0 && (
                <ProductsSection id="stationery" title="Papelería" products={stationeryProducts} />
              )}

              {!officeProducts.length && !techProducts.length && !stationeryProducts.length && (
                <div className="text-center py-12">
                  <p className="text-xl text-brown-700">No hay productos disponibles en este momento.</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
