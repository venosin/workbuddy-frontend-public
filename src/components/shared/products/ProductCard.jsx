import PropTypes from 'prop-types'

export function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="h-48 relative">
          <img src={product.image || "/placeholder.svg"} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">NEW</div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg text-brown-900 mb-1">{product.title}</h3>
        <p className="text-brown-600 text-sm mb-2">{product.description}</p>
        <p className="font-bold text-lg mb-3">${product.price}</p>
        <div className="flex space-x-2">
          <button className="bg-brown-900 text-white px-3 py-1.5 rounded text-sm hover:bg-brown-800 transition-colors">
            Añadir al carrito
          </button>
          <button className="border border-brown-900 text-brown-900 px-3 py-1.5 rounded text-sm hover:bg-brown-100 transition-colors">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired
}
