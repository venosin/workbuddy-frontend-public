import { useState, useEffect, useMemo } from 'react'
import { Navbar } from "../../shared/navigation/Navbar"
import { Footer } from "../../shared/navigation/Footer"
import { HeroSection } from "./sections/HeroSection"
import { SearchBar } from "./sections/SearchBar"
import { ProductsSection } from "./sections/ProductsSection"
import productsService from '../../../services/productsService'
import offersService from '../../../services/offersService'

export function TiendaPage() {
  const [products, setProducts] = useState([])
  const [offers, setOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Productos de ejemplo para cuando la API no devuelve datos
  const sampleProducts = useMemo(() => [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Computadora de Oficina',
      description: 'Computadora básica de trabajo ideal para tareas administrativas',
      category: 'oficina',
      price: 599.99,
      stock: 10,
      imagery: {
        url: '/tiendaEjem.jpeg',
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
        url: '/tiendaEjem.jpeg',
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
        url: '/tiendaEjem.jpeg',
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
        url: '/tiendaEjem.jpeg',
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
        url: '/tiendaEjem.jpeg',
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
        url: '/tiendaEjem.jpeg',
        public_id: 'sample_6',
        filename: 'cuadernos.jpg'
      }
    }
  ], []);

  // Cargar productos y ofertas al inicio
  useEffect(() => {
    // Iniciar usando los productos de ejemplo para garantizar que algo se muestre
    setProducts(sampleProducts);
    
    // Inicializar ofertas con ejemplos
    const sampleOffers = offersService.getSampleOffers();
    setOffers(sampleOffers);
    
    setIsLoading(false);
    
    // Intentar cargar productos y ofertas desde el API
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Intentar obtener productos
        let productData;
        try {
          // Intentar obtener datos de la API
          productData = await productsService.getProducts();
          // Solo actualizar si hay datos
          if (productData && productData.length > 0) {
            setProducts(productData);
          } else {
            // Si no hay datos, usar los de ejemplo
            console.log('La API de productos devolvió un array vacío, usando datos de ejemplo');
            productData = sampleProducts;
          }
        } catch (apiError) {
          console.warn('Error al conectar con la API de productos, usando datos de ejemplo:', apiError);
          // Si falla, usar datos de ejemplo
          productData = sampleProducts;
        }
        
        // Intentar obtener ofertas
        let offerData;
        try {
          // Intentar obtener datos de la API de ofertas
          offerData = await offersService.getOffers();
          // Solo actualizar si hay datos y están poblados con productos
          if (offerData && offerData.length > 0 && offerData[0].productId) {
            // Filtrar solo ofertas activas y válidas
            const activeOffers = offersService.filterActiveOffers(offerData);
            setOffers(activeOffers);
          } else {
            // Si no hay datos, usar los de ejemplo
            console.log('La API de ofertas devolvió un array vacío o sin productos poblados, usando datos de ejemplo');
            offerData = offersService.getSampleOffers();
            setOffers(offerData);
          }
        } catch (apiError) {
          console.warn('Error al conectar con la API de ofertas, usando datos de ejemplo:', apiError);
          // Si falla, usar datos de ejemplo
          offerData = offersService.getSampleOffers();
          setOffers(offerData);
        }
        
        setProducts(productData);
        setOffers(offerData);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        // Si todo falla, cargar datos de ejemplo
        setProducts(sampleProducts);
        setError('Error al conectar con la API. Mostrando datos de ejemplo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sampleProducts]);

  // Manejar búsquedas
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    // Intentar obtener los productos de nuevo para asegurarnos de tener datos frescos
    const fetchProductsForSearch = async () => {
      setIsLoading(true);
      try {
        // Intentar obtener datos de la API
        let data = await productsService.getProducts();
        
        // Si no hay datos, usar los de ejemplo
        if (!data || data.length === 0) {
          data = sampleProducts;
        }
        
        // Si no hay término de búsqueda, mostrar todos los productos
        if (!term.trim()) {
          setProducts(data);
        } else {
          // Filtrar por término o categoría
          const filteredProducts = data.filter(product => 
            product.name?.toLowerCase().includes(term.toLowerCase()) ||
            product.description?.toLowerCase().includes(term.toLowerCase()) ||
            product.category?.toLowerCase() === term.toLowerCase()
          );
          
          setProducts(filteredProducts);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al buscar productos:', err);
        // Si falla, usar datos de ejemplo filtrados
        if (!term.trim()) {
          setProducts(sampleProducts);
        } else {
          const filteredProducts = sampleProducts.filter(product => 
            product.name.toLowerCase().includes(term.toLowerCase()) ||
            product.description.toLowerCase().includes(term.toLowerCase()) ||
            product.category.toLowerCase() === term.toLowerCase()
          );
          setProducts(filteredProducts);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductsForSearch();
  };

  // Filtrar productos por categoría
  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  // Productos por categoría
  const electronicProducts = getProductsByCategory('electronica');
  const officeProducts = getProductsByCategory('oficina');
  const techProducts = getProductsByCategory('tecnologia');
  const stationeryProducts = getProductsByCategory('papeleria');
  const furnitureProducts = getProductsByCategory('muebles');

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
          {/* Sección de Ofertas siempre se muestra primero y solo cuando no hay búsqueda activa */}
          {!searchTerm && offers.length > 0 && (
            <ProductsSection 
              id="special-offers" 
              title="Ofertas Especiales" 
              products={offers} 
              isOfferSection={true}
              bgColor="bg-amber-100"
            />
          )}
          
          {searchTerm ? (
            <ProductsSection id="search-results" title={`Resultados para "${searchTerm}"`} products={products} />
          ) : (
            <>
              {electronicProducts.length > 0 && (
                <ProductsSection id="electronic-products" title="Electrónica" products={electronicProducts} />
              )}

              {officeProducts.length > 0 && (
                <ProductsSection 
                  id="office-supplies" 
                  title="Productos de Oficina" 
                  products={officeProducts} 
                  bgColor="bg-brown-200/50"
                />
              )}

              {techProducts.length > 0 && (
                <ProductsSection
                  id="tech-products"
                  title="Tecnología"
                  products={techProducts}
                />
              )}

              {stationeryProducts.length > 0 && (
                <ProductsSection 
                  id="stationery" 
                  title="Papelería" 
                  products={stationeryProducts} 
                  bgColor="bg-brown-200/50"
                />
              )}

              {furnitureProducts.length > 0 && (
                <ProductsSection id="furniture" title="Muebles" products={furnitureProducts} />
              )}

              {!electronicProducts.length && !officeProducts.length && !techProducts.length && 
               !stationeryProducts.length && !furnitureProducts.length && (
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
