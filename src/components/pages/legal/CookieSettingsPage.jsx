import { useState, useEffect } from "react";
import { Navbar } from "../../shared/navigation/Navbar";
import { Footer } from "../../shared/navigation/Footer";
import { userSettingsService } from "../../../services/userSettingsService";
import { Toggle } from "../../shared/ui/Toggle";
import { useAuth } from "../../../hooks/useAuth";

export function CookieSettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" o "error"
  const [cookiePreferences, setCookiePreferences] = useState({
    functional: true,
    analytics: true,
    advertising: false
  });

  useEffect(() => {
    // Load cookie preferences from localStorage for non-authenticated users
    if (!isAuthenticated) {
      const savedPreferences = localStorage.getItem("cookiePreferences");
      if (savedPreferences) {
        setCookiePreferences(JSON.parse(savedPreferences));
      }
      return;
    }

    // Load cookie preferences from user settings for authenticated users
    const loadUserCookiePreferences = async () => {
      try {
        setLoading(true);
        const settings = await userSettingsService.getUserSettings();
        if (settings && settings.preferences && settings.preferences.cookies) {
          setCookiePreferences({
            functional: settings.preferences.cookies.functional ?? true,
            analytics: settings.preferences.cookies.analytics ?? true,
            advertising: settings.preferences.cookies.advertising ?? false
          });
        }
      } catch (error) {
        console.error("Error loading cookie preferences:", error);
        setStatusMessage("No se pudieron cargar tus preferencias de cookies");
        setStatusType("error");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      loadUserCookiePreferences();
    }
  }, [isAuthenticated, user]);

  const handleToggleChange = async (type) => {
    const newPreferences = {
      ...cookiePreferences,
      [type]: !cookiePreferences[type]
    };
    
    setCookiePreferences(newPreferences);
    
    if (!isAuthenticated) {
      // Save to localStorage for non-authenticated users
      localStorage.setItem("cookiePreferences", JSON.stringify(newPreferences));
      setStatusMessage("Preferencias de cookies actualizadas");
      setStatusType("success");
      return;
    }
    
    // Save to user settings for authenticated users
    try {
      setLoading(true);
      await userSettingsService.updatePreferences({
        cookies: {
          [type]: newPreferences[type]
        }
      });
      setStatusMessage("Preferencias de cookies actualizadas");
      setStatusType("success");
    } catch (error) {
      // Revert the change if saving fails
      setCookiePreferences(cookiePreferences);
      console.error("Error updating cookie preferences:", error);
      setStatusMessage("No se pudieron actualizar tus preferencias de cookies");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brown-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-brown-900 mb-6 text-center">Configuración de Cookies</h1>
        
        {statusMessage && (
          <div className={`mb-4 p-3 rounded-md ${statusType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {statusMessage}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <p className="text-brown-700 mb-6">
            En WorkBuddy utilizamos cookies para mejorar tu experiencia de navegación. 
            Aquí puedes personalizar qué tipo de cookies deseas aceptar.
          </p>
          
          <div className="space-y-6">
            {/* Cookies necesarias */}
            <div className="p-4 border border-brown-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-brown-900">Cookies necesarias</h3>
                <div className="bg-brown-100 text-brown-700 text-xs font-medium py-1 px-2 rounded">
                  Siempre activas
                </div>
              </div>
              <p className="text-brown-700 text-sm">
                Estas cookies son esenciales para el funcionamiento básico de nuestra plataforma. 
                Permiten navegar por la web y utilizar sus funciones básicas como acceder a áreas seguras. 
                Sin estas cookies, no podemos ofrecer nuestros servicios.
              </p>
            </div>

            {/* Cookies funcionales */}
            <div className="p-4 border border-brown-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-brown-900">Cookies funcionales</h3>
                <Toggle 
                  enabled={cookiePreferences.functional} 
                  onChange={() => handleToggleChange('functional')}
                  disabled={loading}
                />
              </div>
              <p className="text-brown-700 text-sm">
                Estas cookies nos permiten recordar tus preferencias y personalizar tu experiencia en nuestra plataforma. 
                Incluyen recordar tu idioma preferido, ubicación y configuración de servicios.
              </p>
            </div>

            {/* Cookies analíticas */}
            <div className="p-4 border border-brown-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-brown-900">Cookies analíticas</h3>
                <Toggle 
                  enabled={cookiePreferences.analytics} 
                  onChange={() => handleToggleChange('analytics')}
                  disabled={loading}
                />
              </div>
              <p className="text-brown-700 text-sm">
                Estas cookies nos ayudan a entender cómo interactúas con nuestra plataforma mediante la recopilación 
                de información anónima. Utilizamos esta información para mejorar nuestra plataforma y servicios.
              </p>
            </div>

            {/* Cookies publicitarias */}
            <div className="p-4 border border-brown-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-brown-900">Cookies publicitarias</h3>
                <Toggle 
                  enabled={cookiePreferences.advertising} 
                  onChange={() => handleToggleChange('advertising')}
                  disabled={loading}
                />
              </div>
              <p className="text-brown-700 text-sm">
                Estas cookies se utilizan para mostrarte anuncios más relevantes según tus intereses. 
                También limitan el número de veces que ves un anuncio y nos ayudan a medir la efectividad 
                de nuestras campañas publicitarias.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
