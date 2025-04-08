import { useState, useEffect } from 'react';
import { Bell, Lock, Plus, Pencil, Trash2, Check, MapPin } from 'lucide-react';
import { userSettingsService } from '../../../services/userSettingsService';

export function UserSettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para editar direcciones
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    title: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  });

  // Estado para preferencias
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      promotions: true,
      orderUpdates: true
    },
    privacy: {
      shareProfileData: false
    }
  });

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const data = await userSettingsService.getSettings();
        console.log('Configuración cargada:', data);
        setSettings(data);
        
        // Inicializar preferencias con los datos del servidor
        if (data && data.preferences) {
          setPreferences(data.preferences);
        }
      } catch (err) {
        console.error('Error al cargar configuración:', err);
        setError('No se pudo cargar la configuración. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  // Contenido de la página mientras carga
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preferencias de Notificaciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-brown-900">Notificaciones</h3>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brown-700">Notificaciones por correo electrónico</p>
              <p className="text-sm text-brown-500">Recibe actualizaciones importantes por correo</p>
            </div>
            <button 
              onClick={() => setPreferences(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  email: !prev.notifications.email
                }
              }))}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ${preferences.notifications.email ? 'bg-green-500' : 'bg-gray-200'}`}
              role="switch"
              aria-checked={preferences.notifications.email}
            >
              <span 
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${preferences.notifications.email ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brown-700">Promociones y descuentos</p>
              <p className="text-sm text-brown-500">Recibe ofertas especiales y novedades</p>
            </div>
            <button 
              onClick={() => setPreferences(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  promotions: !prev.notifications.promotions
                }
              }))}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ${preferences.notifications.promotions ? 'bg-green-500' : 'bg-gray-200'}`}
              role="switch"
              aria-checked={preferences.notifications.promotions}
            >
              <span 
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${preferences.notifications.promotions ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brown-700">Actualizaciones de pedidos</p>
              <p className="text-sm text-brown-500">Recibe notificaciones sobre el estado de tus compras</p>
            </div>
            <button 
              onClick={() => setPreferences(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  orderUpdates: !prev.notifications.orderUpdates
                }
              }))}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ${preferences.notifications.orderUpdates ? 'bg-green-500' : 'bg-gray-200'}`}
              role="switch"
              aria-checked={preferences.notifications.orderUpdates}
            >
              <span 
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${preferences.notifications.orderUpdates ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>

        <button 
          onClick={async () => {
            try {
              setIsLoading(true);
              setError('');
              setSuccess('');
              await userSettingsService.updatePreferences({ notifications: preferences.notifications });
              setSuccess('Preferencias de notificaciones actualizadas con éxito');
              setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
              console.error('Error al actualizar preferencias:', err);
              setError('No se pudieron actualizar las preferencias. Por favor, intenta de nuevo.');
            } finally {
              setIsLoading(false);
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Guardando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Guardar preferencias
            </>
          )}
        </button>
      </div>
      
      {/* Privacidad */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <div className="flex items-center mb-4">
          <Lock className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-brown-900">Privacidad</h3>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brown-700">Compartir datos de perfil</p>
              <p className="text-sm text-brown-500">Permite que WorkBuddy utilice tus datos para mejorar recomendaciones</p>
            </div>
            <button 
              onClick={() => setPreferences(prev => ({
                ...prev,
                privacy: {
                  ...prev.privacy,
                  shareProfileData: !prev.privacy.shareProfileData
                }
              }))}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ${preferences.privacy.shareProfileData ? 'bg-green-500' : 'bg-gray-200'}`}
              role="switch"
              aria-checked={preferences.privacy.shareProfileData}
            >
              <span 
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${preferences.privacy.shareProfileData ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>
        
        <button 
          onClick={async () => {
            try {
              setIsLoading(true);
              setError('');
              setSuccess('');
              await userSettingsService.updatePreferences({ privacy: preferences.privacy });
              setSuccess('Configuración de privacidad actualizada con éxito');
              setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
              console.error('Error al actualizar preferencias de privacidad:', err);
              setError('No se pudo actualizar la configuración de privacidad. Por favor, intenta de nuevo.');
            } finally {
              setIsLoading(false);
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Guardando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Guardar configuración
            </>
          )}
        </button>
      </div>

      {/* Direcciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-brown-900">Mis Direcciones</h3>
          </div>
          
          {!showAddAddress && (
            <button 
              onClick={() => {
                setShowAddAddress(true);
                setEditingAddressId(null);
                setAddressForm({
                  title: '',
                  street: '',
                  city: '',
                  state: '',
                  postalCode: '',
                  isDefault: false
                });
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Agregar Dirección
            </button>
          )}
        </div>

        {/* Formulario para agregar o editar dirección */}
        {showAddAddress && (
          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <h4 className="text-lg font-medium text-brown-900 mb-4">
              {editingAddressId ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
            </h4>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                setIsLoading(true);
                setError('');
                setSuccess('');
                
                if (editingAddressId) {
                  // Actualizar dirección existente
                  await userSettingsService.updateAddress(editingAddressId, addressForm);
                  setSuccess('Dirección actualizada con éxito');
                } else {
                  // Agregar nueva dirección
                  await userSettingsService.addAddress(addressForm);
                  setSuccess('Dirección agregada con éxito');
                }
                
                // Recargar la lista de direcciones
                const data = await userSettingsService.getSettings();
                setSettings(data);
                
                // Limpiar formulario
                setShowAddAddress(false);
                setEditingAddressId(null);
                setAddressForm({
                  title: '',
                  street: '',
                  city: '',
                  state: '',
                  postalCode: '',
                  isDefault: false
                });
                
                setTimeout(() => setSuccess(''), 3000);
              } catch (err) {
                console.error('Error al guardar dirección:', err);
                setError('No se pudo guardar la dirección. Por favor, intenta de nuevo.');
              } finally {
                setIsLoading(false);
              }
            }}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-brown-700">Título</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={addressForm.title}
                    onChange={(e) => setAddressForm({...addressForm, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Ej: Casa, Trabajo, etc."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-brown-700">Calle y número</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-brown-700">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-brown-700">Estado/Provincia</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-brown-700">Código Postal</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                    className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-brown-700">
                    Establecer como dirección predeterminada
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {editingAddressId ? 'Actualizar' : 'Guardar'}
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAddress(false);
                    setEditingAddressId(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de direcciones */}
        {settings?.addresses && settings.addresses.length > 0 ? (
          <div className="space-y-4">
            {settings.addresses.map(address => (
              <div key={address._id} className="border border-gray-200 rounded-md p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-brown-900">{address.title}</h4>
                    {address.isDefault && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Principal</span>
                    )}
                  </div>
                  <p className="text-sm text-brown-700 mt-1">{address.street}</p>
                  <p className="text-sm text-brown-700">{address.city}, {address.state} {address.postalCode}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setEditingAddressId(address._id);
                      setAddressForm({
                        title: address.title,
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        isDefault: address.isDefault
                      });
                      setShowAddAddress(true);
                    }}
                    className="p-1 text-gray-400 hover:text-green-500"
                    aria-label="Editar dirección"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
                        try {
                          setIsLoading(true);
                          setError('');
                          setSuccess('');
                          
                          await userSettingsService.deleteAddress(address._id);
                          
                          // Recargar la lista de direcciones
                          const data = await userSettingsService.getSettings();
                          setSettings(data);
                          
                          setSuccess('Dirección eliminada con éxito');
                          setTimeout(() => setSuccess(''), 3000);
                        } catch (err) {
                          console.error('Error al eliminar dirección:', err);
                          setError('No se pudo eliminar la dirección. Por favor, intenta de nuevo.');
                        } finally {
                          setIsLoading(false);
                        }
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                    aria-label="Eliminar dirección"
                    disabled={address.isDefault}
                    title={address.isDefault ? 'No puedes eliminar la dirección principal' : 'Eliminar dirección'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-brown-500">
            No tienes direcciones guardadas.
          </div>
        )}
      </div>
    </div>
  );
}