import './index.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { HomePage } from './components/pages/home/HomePage'
import { TiendaPage } from './components/pages/tienda/TiendaPage'
import { ProductDetail } from './components/pages/tienda/ProductDetail'
import { AboutPage } from './components/pages/about/AboutPage'
import { PrivacyPolicyPage } from './components/pages/legal/PrivacyPolicyPage'
import { TermsOfServicePage } from './components/pages/legal/TermsOfServicePage'
import { LoginPage } from './components/pages/auth/LoginPage'
import { RegisterPage } from './components/pages/auth/RegisterPage'
import { VerifyCodePage } from './components/pages/auth/VerifyCodePage'
import { RequestPasswordRecoveryPage } from './components/pages/auth/RequestPasswordRecoveryPage'
import { VerifyPasswordRecoveryPage } from './components/pages/auth/VerifyPasswordRecoveryPage'
import { ResetPasswordPage } from './components/pages/auth/ResetPasswordPage'

// Componentes de perfil de usuario
import { ProfilePage } from './components/pages/profile/ProfilePage'
import { ProfileDetail } from './components/pages/profile/ProfileDetail'
import { Favorites } from './components/pages/profile/Favorites'
import { Orders } from './components/pages/profile/Orders'
import { OrderDetail } from './components/pages/profile/OrderDetail'
import { UserSettings } from './components/pages/profile/UserSettings'
// Componente de administración
import { AdminProductForm } from './components/pages/admin/AdminProductForm'
// Componentes de checkout
import { CheckoutPage } from './components/pages/checkout/CheckoutPage'
import { OrderConfirmationPage } from './components/pages/checkout/OrderConfirmationPage'
// Importar los proveedores
import { AuthProvider } from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartProvider'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<TiendaPage />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/terminos-de-servicio" element={<TermsOfServicePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/verificar-codigo" element={<VerifyCodePage />} />
        <Route path="/recuperar-contrasena" element={<RequestPasswordRecoveryPage />} />
        <Route path="/verificar-recuperacion" element={<VerifyPasswordRecoveryPage />} />
        <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
        
        {/* Rutas de perfil de usuario */}
        <Route path="/perfil" element={<ProfilePage />}>
          <Route index element={<ProfileDetail />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="pedidos" element={<Orders />} />
          <Route path="pedidos/:orderId" element={<OrderDetail />} />
          <Route path="configuracion" element={<UserSettings />} />
        </Route>
        
        {/* Rutas de administración */}
        <Route path="/admin/productos/nuevo" element={<AdminProductForm />} />
        
        {/* Rutas de checkout */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido-confirmado/:orderId" element={<OrderConfirmationPage />} />
        
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-brown-100">
            <h1 className="text-3xl font-bold text-brown-900 mb-4">Página no encontrada</h1>
            <p className="text-brown-700 mb-6">Lo sentimos, la página que estás buscando no existe.</p>
            <a href="/" className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors">
              Volver al inicio
            </a>
          </div>
        } />
      </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
