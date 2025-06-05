import { useState, useEffect } from 'react'
import { Navbar } from '../../shared/navigation/Navbar'
import { Footer } from '../../shared/navigation/Footer'
import offersService from '../../../services/offersService'
import { ProductsSection } from '../tienda/sections/ProductsSection'
import { OfferHero } from './OfferHero'

export function OffersPage() {
  const [offers, setOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Obtener ofertas desde el API
        const fetchedOffers = await offersService.getOffers()
        
        // Filtrar solo ofertas activas
        const activeOffers = offersService.filterActiveOffers(fetchedOffers)
        
        if (activeOffers && activeOffers.length > 0) {
          setOffers(activeOffers)
        } else {
          // Si no hay ofertas activas, usar datos de ejemplo
          console.log('No se encontraron ofertas activas, usando datos de ejemplo')
          setOffers(offersService.getSampleOffers())
        }
      } catch (err) {
        console.error('Error al cargar ofertas:', err)
        setError('No pudimos cargar las ofertas. Por favor, inténtelo nuevamente más tarde.')
        // Usar datos de ejemplo en caso de error
        setOffers(offersService.getSampleOffers())
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOffers()
  }, [])

  return (
    <>
      <Navbar />
      <OfferHero />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Ofertas Especiales</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No hay ofertas disponibles actualmente.</p>
            <p className="mt-2">¡Vuelve pronto para descubrir nuevas promociones!</p>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-lg p-6 mb-8">
            <ProductsSection 
              title="Todas las Ofertas Activas" 
              products={offers} 
              isOfferSection={true} 
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
