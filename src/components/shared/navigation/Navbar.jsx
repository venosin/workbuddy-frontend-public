import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { User, ShoppingCart } from "lucide-react"
import { AuthDropdown } from '../../shared/auth/AuthDropdown'
import { ShoppingCartDropdown } from '../../shared/cart/ShoppingCartDropdown'
import { useCart } from '../../../hooks/useCart'

export function Navbar() {
  // Estado para controlar si el dropdown está abierto o cerrado
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const authDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);
  
  // Obtener datos del carrito
  const { items } = useCart();

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      // Manejar dropdown de autenticación
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target)) {
        setIsAuthDropdownOpen(false);
      }
      
      // Manejar dropdown del carrito
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setIsCartDropdownOpen(false);
      }
    }

    // Añadir eventListener cuando algún dropdown está abierto
    if (isAuthDropdownOpen || isCartDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Limpiar eventListener al desmontar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAuthDropdownOpen, isCartDropdownOpen]);

  // Alternar el estado del dropdown de autenticación
  const toggleAuthDropdown = () => {
    setIsAuthDropdownOpen(!isAuthDropdownOpen);
    // Cerrar el otro dropdown si está abierto
    if (isCartDropdownOpen) setIsCartDropdownOpen(false);
  };

  // Alternar el estado del dropdown del carrito
  const toggleCartDropdown = () => {
    setIsCartDropdownOpen(!isCartDropdownOpen);
    // Cerrar el otro dropdown si está abierto
    if (isAuthDropdownOpen) setIsAuthDropdownOpen(false);
  };

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
          <Link to="/ofertas" className="text-sm hover:text-green-300 transition-colors">
            Ofertas
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <div className="relative" ref={authDropdownRef}>
            <button 
              className="p-1 rounded-full hover:bg-brown-800 transition-colors" 
              aria-label="Ver perfil"
              onClick={toggleAuthDropdown}
            >
              <User className="h-5 w-5" />
            </button>
            <AuthDropdown 
              isOpen={isAuthDropdownOpen} 
              onClose={() => setIsAuthDropdownOpen(false)} 
            />
          </div>
          <div className="relative" ref={cartDropdownRef}>
            <button 
              className="p-1 rounded-full hover:bg-brown-800 transition-colors"
              aria-label="Ver carrito"
              onClick={toggleCartDropdown}
            >
              <ShoppingCart className="h-5 w-5" />
              {items && items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-xs text-white font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <ShoppingCartDropdown 
              isOpen={isCartDropdownOpen} 
              onClose={() => setIsCartDropdownOpen(false)} 
            />
          </div>
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
