import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, User, Settings, LogOut, ShoppingBag, Heart } from 'lucide-react';

export function AuthDropdown({ isOpen, onClose }) {
  // Este estado simula si el usuario está autenticado o no
  // En el futuro, se reemplazará con la lógica real de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simula datos de usuario, en el futuro vendrán del backend
  const user = isAuthenticated ? {
    name: 'Usuario Demo',
    email: 'usuario@ejemplo.com',
    avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=0D8ABC&color=fff'
  } : null;

  // Para fines de demostración, esto permite cambiar entre estados de autenticado/no autenticado
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
    // En la implementación real, esto sería reemplazado por el proceso real de login
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-20" 
         onClick={(e) => e.stopPropagation()}>
      <div className="py-2">
        {isAuthenticated ? (
          <>
            {/* Sección de perfil de usuario */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-brown-900">{user.name}</p>
                  <p className="text-xs text-brown-500">{user.email}</p>
                </div>
              </div>
            </div>
            
            {/* Opciones de usuario autenticado */}
            <div className="py-1">
              <Link 
                to="/perfil" 
                className="flex items-center px-4 py-2 text-sm text-brown-700 hover:bg-brown-100"
                onClick={onClose}
              >
                <User className="h-4 w-4 mr-3 text-brown-500" />
                Mi Perfil
              </Link>
              <Link 
                to="/mis-pedidos" 
                className="flex items-center px-4 py-2 text-sm text-brown-700 hover:bg-brown-100"
                onClick={onClose}
              >
                <ShoppingBag className="h-4 w-4 mr-3 text-brown-500" />
                Mis Pedidos
              </Link>
              <Link 
                to="/favoritos" 
                className="flex items-center px-4 py-2 text-sm text-brown-700 hover:bg-brown-100"
                onClick={onClose}
              >
                <Heart className="h-4 w-4 mr-3 text-brown-500" />
                Favoritos
              </Link>
              <Link 
                to="/configuracion" 
                className="flex items-center px-4 py-2 text-sm text-brown-700 hover:bg-brown-100"
                onClick={onClose}
              >
                <Settings className="h-4 w-4 mr-3 text-brown-500" />
                Configuración
              </Link>
            </div>
            
            {/* Separador */}
            <div className="border-t border-gray-200"></div>
            
            {/* Opción de cerrar sesión */}
            <div className="py-1">
              <button 
                onClick={toggleAuth} 
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-brown-100"
              >
                <LogOut className="h-4 w-4 mr-3 text-red-500" />
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Opciones para usuarios no autenticados */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-brown-900">Bienvenido a WorkBuddy</p>
              <p className="text-xs text-brown-500">Inicia sesión para acceder a tu cuenta</p>
            </div>
            
            <div className="py-1">
              <Link 
                to="/iniciar-sesion" 
                className="flex items-center px-4 py-2 text-sm text-brown-700 hover:bg-brown-100"
                onClick={onClose}
              >
                <LogIn className="h-4 w-4 mr-3 text-brown-500" />
                Iniciar Sesión
              </Link>
              
              <Link 
                to="/registro" 
                className="flex items-center px-4 py-2 text-sm text-brown-700 hover:bg-brown-100"
                onClick={onClose}
              >
                <User className="h-4 w-4 mr-3 text-brown-500" />
                Registrarse
              </Link>
            </div>
            
            {/* Botón para simular inicio de sesión (solo para demostración) */}
            <div className="px-4 py-2 border-t border-gray-200">
              <button 
                onClick={toggleAuth}
                className="w-full px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
              >
                Demo: Simular Sesión
              </button>
              <p className="text-xs text-brown-500 mt-1 text-center">
                *Solo para demostración
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
