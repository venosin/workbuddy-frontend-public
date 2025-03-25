import PropTypes from 'prop-types'
import { ProductCard } from "../../../shared/products/ProductCard"

export function ProductsSection({ id, title, products, bgColor = "" }) {
  return (
    <section id={id} className={`py-12 ${bgColor}`}>
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={`${id}-${product.id}`} product={product} />
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
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired
    })
  ).isRequired,
  bgColor: PropTypes.string
}
