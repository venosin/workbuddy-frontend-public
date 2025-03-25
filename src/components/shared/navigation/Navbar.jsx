import { Link } from 'react-router-dom'
import { User, ShoppingCart } from "lucide-react"

export function Navbar() {
  return (
    <header className="bg-brown-900 text-white py-3 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-lg flex items-center">
            <span className="mr-1">✦</span> WorkBuddy
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/tienda" className="text-sm hover:text-green-300 transition-colors">
            Tienda
          </Link>
          <Link to="/nosotros" className="text-sm hover:text-green-300 transition-colors">
            Nosotros
          </Link>
          <Link to="/productos" className="text-sm hover:text-green-300 transition-colors">
            Productos
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <button className="p-1 rounded-full hover:bg-brown-800 transition-colors" aria-label="Ver perfil">
            <User className="h-5 w-5" />
          </button>
          <button className="p-1 rounded-full hover:bg-brown-800 transition-colors">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <Link
            to="/contacto"
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </header>
  )
}
