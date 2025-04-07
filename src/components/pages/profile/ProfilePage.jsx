import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { User, Heart, Settings, ShoppingBag, LogOut } from 'lucide-react';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import { useAuth } from '../../../hooks/useAuth';
import profileService from '../../../services/profileService';
import ordersService from '../../../services/ordersService';

export function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderCount, setOrderCount] = useState({ total: 0, pendiente: 0 });

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
      return;
    }

    // Si tenemos datos del usuario en el contexto de autenticación, usarlos como perfil
    if (user && (!profile || Object.keys(profile).length === 0)) {
      console.log('Usando datos de usuario del contexto de auth:', user);
      setProfile(user);
    }

    // Cargar el perfil y el conteo de pedidos
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Obtener perfil solo si no lo tenemos ya del contexto de auth
        if (!profile) {
          try {
            const profileData = await profileService.getUserProfile();
            setProfile(profileData);
          } catch (profileErr) {
            console.error('Error al cargar perfil:', profileErr);
            // Si falla la carga del perfil pero tenemos el usuario de auth, usamos ese
            if (!user) {
              setError('No se pudo cargar la información del perfil. Por favor, intenta de nuevo.');
            }
          }
        }

        // Obtener conteo de pedidos
        try {
          const orderCountData = await ordersService.getOrdersCountByStatus();
          setOrderCount(orderCountData);
        } catch (err) {
          console.error('Error al cargar conteo de pedidos:', err);
          // No establecemos error aquí para no bloquear toda la página
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfileData();
    }
  }, [navigate, isAuthenticated, authLoading, user, profile]);

  // Obtener la función de logout del contexto de autenticación
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Determinar qué pestaña está activa
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/favoritos')) return 'favoritos';
    if (path.includes('/configuracion')) return 'configuracion';
    if (path.includes('/pedidos')) return 'pedidos';
    return 'perfil';
  };

  const activeTab = getActiveTab();

  // Contenido cuando está cargando
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-brown-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Contenido cuando hay un error
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-brown-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Intentar de nuevo
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brown-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Encabezado del perfil */}
          <div className="bg-green-600 px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {profile?.profileImage?.url ? (
                  <img 
                    src={profile.profileImage.url} 
                    alt="Foto de perfil" 
                    className="h-16 w-16 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <User size={32} />
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h1 className="text-xl font-bold text-white">
                  {profile?.name || 'Usuario'}
                </h1>
                <p className="text-green-100">
                  {profile?.email || ''}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-md flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
          
          {/* Navegación de pestañas */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <Link
                to="/perfil"
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'perfil'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="inline-block mr-2 h-5 w-5" />
                Mi Perfil
              </Link>
              <Link
                to="/perfil/favoritos"
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'favoritos'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Heart className="inline-block mr-2 h-5 w-5" />
                Favoritos
              </Link>
              <Link
                to="/perfil/pedidos"
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'pedidos'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="inline-block mr-2 h-5 w-5" />
                Mis Pedidos
                {orderCount.total > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {orderCount.total}
                  </span>
                )}
              </Link>
              <Link
                to="/perfil/configuracion"
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'configuracion'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="inline-block mr-2 h-5 w-5" />
                Configuración
              </Link>
            </nav>
          </div>
          
          {/* Contenido dinámico basado en la ruta actual */}
          <div className="p-6">
            <Outlet context={{ profile, setProfile }} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
