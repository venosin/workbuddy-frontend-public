import PropTypes from 'prop-types'
import { ProductCard } from "../../../shared/products/ProductCard"
import { OfferCard } from "../../../shared/products/OfferCard"

export function ProductsSection({ id, title, products, bgColor = "", isOfferSection = false }) {
  return (
    <section id={id} className={`py-12 ${bgColor}`}>
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            isOfferSection ? (
              <OfferCard key={`${id}-${product._id || product.id}`} product={product} />
            ) : (
              <ProductCard key={`${id}-${product._id || product.id}`} product={product} />
            )
          ))}
        </div>
      </div>
    </section>
  )
}

ProductsSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.number, // Para compatibilidad con datos de ejemplo
      name: PropTypes.string,
      title: PropTypes.string, // Para compatibilidad con datos de ejemplo
      description: PropTypes.string.isRequired,
      category: PropTypes.string,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number,
      imagery: PropTypes.shape({
        url: PropTypes.string,
        public_id: PropTypes.string,
        filename: PropTypes.string
      }),
      image: PropTypes.string // Para compatibilidad con datos de ejemplo
    })
  ).isRequired,
  bgColor: PropTypes.string,
  isOfferSection: PropTypes.bool
}
