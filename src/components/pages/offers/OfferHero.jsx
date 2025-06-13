import { Link } from 'react-router-dom'

export function OfferHero() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-300 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-4">
              Ofertas Especiales
            </h1>
            <p className="text-lg text-white mb-6 max-w-lg font-sans">
              Descubre nuestras mejores promociones y aprovecha los descuentos en productos seleccionados para mejorar tu espacio de trabajo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tienda"
                className="bg-white text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-md font-sans font-medium transition-colors"
              >
                Ver todos los productos
              </Link>
              <a
                href="#ofertas"
                className="bg-amber-800 text-white hover:bg-amber-900 px-6 py-3 rounded-md font-sans font-medium transition-colors"
              >
                Ver ofertas
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12 animate-pulse">
                ¡OFERTAS!
              </div>
              <img
                src="/offer-hero-image.jpg"
                alt="Ofertas especiales WorkBuddy"
                className="rounded-lg shadow-xl max-w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/tiendaEjem.jpeg";
                }}
              />
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-amber-900 text-lg font-bold px-4 py-2 rounded-full shadow-lg transform -rotate-12">
                ¡AHORRA!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
