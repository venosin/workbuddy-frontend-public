import './index.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { HomePage } from './components/pages/home/HomePage'
import { TiendaPage } from './components/pages/tienda/TiendaPage'
import { ProductDetail } from './components/pages/tienda/ProductDetail'
import { AboutPage } from './components/pages/about/AboutPage'
import { ContactPage } from './components/pages/contact/ContactPage'
import { OffersPage } from './components/pages/offers/OffersPage'
import { PrivacyPolicyPage } from './components/pages/legal/PrivacyPolicyPage'
import { TermsOfServicePage } from './components/pages/legal/TermsOfServicePage'
import { CookieSettingsPage } from './components/pages/legal/CookieSettingsPage'
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
import { DiscountCodesPage } from './components/pages/admin/DiscountCodesPage'
// Componentes de checkout
import { OrderCheckoutPage } from './components/pages/checkout/OrderCheckoutPage'
import { OrderConfirmationPage } from './components/pages/checkout/OrderConfirmationPage'
import { CartPage } from './components/pages/cart/CartPage'

// Componentes de pago con PayPal
import PaymentPage from './components/pages/checkout/PaymentPage'
import PaymentSuccessPage from './components/pages/checkout/PaymentSuccessPage'
import PaymentCancelPage from './components/pages/checkout/PaymentCancelPage'
import { CheckoutPaypalPage } from './components/pages/checkout/CheckoutPaypalPage'
// Importar los proveedores
import { AuthProvider } from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartProvider'
import { NotificationProvider, useNotifications } from './contexts/NotificationContext'
// Importar componente de cookies
import { CookieBanner } from './components/shared/CookieBanner'
// Importar componentes de notificaciones
import NotificationContainer from './components/shared/notifications/NotificationContainer'
// Importar servicio de notificaciones
import { initNotificationService } from './services/notificationService'

// Componente interno que inicializa el servicio de notificaciones
function NotificationInitializer() {
  const notificationContext = useNotifications();
  
  useEffect(() => {
    // Inicializar el servicio de notificaciones con el contexto
    initNotificationService(notificationContext);
  }, [notificationContext]);
  
  return null;
}

function App() {
  return (
    <NotificationProvider>
      <NotificationInitializer />
      <NotificationContainer />
      <AuthProvider>
        <CartProvider>
          <CookieBanner />
          <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<TiendaPage />} />
        <Route path="/ofertas" element={<OffersPage />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/terminos-de-servicio" element={<TermsOfServicePage />} />
        <Route path="/configuracion-de-cookies" element={<CookieSettingsPage />} />
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
          <Route path="configuracion" element={<UserSettings />} />
        </Route>
        
        {/* Rutas de administración */}
        <Route path="/admin/productos/nuevo" element={<AdminProductForm />} />
        <Route path="/admin/codigos-descuento" element={<DiscountCodesPage />} />
        
        {/* Rutas de carrito y checkout */}
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout/finalizar" element={<OrderCheckoutPage />} />
        <Route path="/pedido-confirmado/:orderId" element={<OrderConfirmationPage />} />
        
        {/* Rutas de pago con PayPal */}
        <Route path="/checkout-paypal" element={<CheckoutPaypalPage />} />
        <Route path="/checkout/payment/:orderId" element={<PaymentPage />} />
        <Route path="/checkout/success" element={<PaymentSuccessPage />} />
        <Route path="/checkout/cancel" element={<PaymentCancelPage />} />
        
        {/* Rutas de pedidos */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        
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
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App
