import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function CookieBanner() {
  const { isAuthenticated } = useAuth();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Don't show banner for authenticated users
    if (isAuthenticated) {
      return;
    }

    // Check if user has already set cookie preferences
    const hasSetPreferences = localStorage.getItem("cookiePreferencesSet");
    
    // Show banner only if preferences haven't been set
    if (!hasSetPreferences) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleAcceptAll = () => {
    // Set all cookie preferences to true
    const preferences = {
      functional: true,
      analytics: true,
      advertising: true
    };
    
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    localStorage.setItem("cookiePreferencesSet", "true");
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    // Set only essential cookies
    const preferences = {
      functional: false,
      analytics: false,
      advertising: false
    };
    
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    localStorage.setItem("cookiePreferencesSet", "true");
    setShowBanner(false);
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-brown-200 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex-grow mb-4 md:mb-0 pr-4">
          <p className="text-brown-700 text-sm">
            En WorkBuddy utilizamos cookies para mejorar tu experiencia de navegación.
            Puedes aceptar todas las cookies, solo las esenciales o{" "}
            <Link to="/configuracion-de-cookies" className="text-green-600 hover:underline">
              personalizar tus preferencias
            </Link>.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAcceptEssential}
            className="text-sm px-4 py-2 border border-brown-300 rounded-md hover:bg-brown-50 transition-colors"
          >
            Solo esenciales
          </button>
          
          <button
            onClick={handleAcceptAll}
            className="text-sm px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Aceptar todas
          </button>
          
          <button
            onClick={handleCloseBanner}
            className="text-brown-500 p-1 hover:bg-brown-100 rounded-full"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
