import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-brown-100 text-brown-700">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap justify-center text-xs space-x-4 mb-6">
          <Link to="/sobre-workbuddy" className="hover:text-brown-900 transition-colors">
            © 2025 WorkBuddy
          </Link>
          <Link to="/terminos-de-servicio" className="hover:text-brown-900 transition-colors">
            Términos de Servicio
          </Link>
          <Link to="/politica-de-privacidad" className="hover:text-brown-900 transition-colors">
            Política de Privacidad
          </Link>
          <Link to="/terminos-de-envio" className="hover:text-brown-900 transition-colors">
            Términos de Envío
          </Link>
          <Link to="/configuracion-de-cookies" className="hover:text-brown-900 transition-colors">
            Configuración de Cookies
          </Link>
        </div>

        <div className="flex justify-center space-x-4">
          <Link to="#" className="text-brown-600 hover:text-brown-900 transition-colors">
            <Facebook className="h-5 w-5" />
          </Link>
          <Link to="#" className="text-brown-600 hover:text-brown-900 transition-colors">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link to="#" className="text-brown-600 hover:text-brown-900 transition-colors">
            <Instagram className="h-5 w-5" />
          </Link>
          <Link to="#" className="text-brown-600 hover:text-brown-900 transition-colors">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link to="#" className="text-brown-600 hover:text-brown-900 transition-colors">
            <Youtube className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
