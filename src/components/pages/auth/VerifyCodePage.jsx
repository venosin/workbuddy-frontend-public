import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Coffee, AlertCircle } from 'lucide-react';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import authService from '../../../services/authService';

export function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // No necesitamos guardar el email en el estado ya que está en la cookie del backend
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Obtener el email y mensaje del state al cargar la página
    if (location.state) {
      // El email ya está guardado en el backend como parte de la cookie
      if (location.state.message) {
        setMessage(location.state.message);
      }
    } else {
      // Si no hay datos en el state, redirigir al registro
      navigate('/registro');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    // Eliminar espacios y limitar a 6 caracteres (asumiendo que el código es de 6 caracteres)
    const value = e.target.value.replace(/\s/g, '').slice(0, 6);
    setVerificationCode(value);
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Por favor, ingresa el código de verificación');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Llamar al servicio para verificar el código
      const response = await authService.verifyEmailCode(verificationCode);
      
      console.log('Verificación exitosa:', response);
      
      setSuccess('¡Verificación exitosa! Redirigiendo...');
      
      // Esperar 2 segundos antes de redirigir para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/iniciar-sesion', { 
          state: { 
            message: '¡Tu cuenta ha sido verificada! Ahora puedes iniciar sesión.' 
          } 
        });
      }, 2000);
    } catch (error) {
      console.error('Error de verificación:', error);
      const errorMessage = error.message || 'Código de verificación inválido. Por favor, intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brown-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <Coffee className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-brown-900">
              Verificación de cuenta
            </h2>
            <p className="mt-2 text-sm text-brown-600">
              Introduce el código de verificación enviado a tu correo electrónico
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {message && (
              <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      {success}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-brown-700">
                  Código de verificación
                </label>
                <div className="mt-1">
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    autoComplete="off"
                    required
                    value={verificationCode}
                    onChange={handleChange}
                    disabled={isLoading || success}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Ingresa el código de 6 caracteres"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || success || !verificationCode.trim()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verificando...
                    </>
                  ) : (
                    'Verificar'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-sm text-center">
              <p className="text-brown-600">
                ¿No recibiste el código?{' '}
                <button 
                  type="button"
                  className="font-medium text-green-600 hover:text-green-500"
                  // Aquí podrías implementar la lógica para reenviar el código
                  onClick={() => alert('Funcionalidad de reenvío pendiente de implementar')}
                >
                  Reenviar
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
