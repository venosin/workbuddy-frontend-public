import { useState } from 'react'
import { Search } from "lucide-react"
import PropTypes from 'prop-types'

export function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleCategoryClick = (category) => {
    // Si la categoría está vacía, buscamos todos los productos
    setSearchTerm(category)
    onSearch(category)
  }

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSubmit} className="relative w-full md:w-auto flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-brown-500" />
            </div>
            <input
              type="search"
              className="block w-full p-2.5 pl-10 text-sm text-brown-900 border border-brown-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500"
              placeholder="Busca tu producto favorito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="flex flex-wrap justify-center md:justify-end space-x-2 md:space-x-4 text-sm text-brown-700 mt-4 md:mt-0">
            <button 
              onClick={() => handleCategoryClick('')} 
              className="hover:text-brown-900 transition-colors px-2 py-1 hover:bg-brown-100 rounded"
            >
              Todos
            </button>
            <button 
              onClick={() => handleCategoryClick('oficina')} 
              className="hover:text-brown-900 transition-colors px-2 py-1 hover:bg-brown-100 rounded"
            >
              Oficina
            </button>
            <button 
              onClick={() => handleCategoryClick('tecnologia')} 
              className="hover:text-brown-900 transition-colors px-2 py-1 hover:bg-brown-100 rounded"
            >
              Tecnología
            </button>
            <button 
              onClick={() => handleCategoryClick('papeleria')} 
              className="hover:text-brown-900 transition-colors px-2 py-1 hover:bg-brown-100 rounded"
            >
              Papelería
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
}
