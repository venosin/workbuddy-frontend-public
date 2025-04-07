import { useState, useEffect } from 'react';
import { Bell, Lock, Plus, Pencil, Trash2, Check } from 'lucide-react';
import userSettingsService from '../../../services/userSettingsService';

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

  // Manejador para cambios en las preferencias
  const handlePreferenceChange = (category, setting) => {
    setPreferences(prev => {
      const newPreferences = { ...prev };
      newPreferences[category][setting] = !newPreferences[category][setting];
      return newPreferences;
    });
  };

  // Guardar cambios en preferencias
  const savePreferences = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      await userSettingsService.updatePreferences(preferences);
      
      setSuccess('Preferencias actualizadas con éxito');
    } catch (err) {
      console.error('Error al actualizar preferencias:', err);
      setError('No se pudieron actualizar las preferencias. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en el formulario de dirección
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Agregar una nueva dirección
  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      const response = await userSettingsService.addAddress(addressForm);
      
      // Actualizar la lista local de direcciones
      setSettings(prev => ({
        ...prev,
        addresses: [...prev.addresses, response.address]
      }));
      
      // Limpiar formulario y cerrar
      setAddressForm({
        title: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        isDefault: false
      });
      setShowAddAddress(false);
      setSuccess('Dirección agregada con éxito');
    } catch (err) {
      console.error('Error al agregar dirección:', err);
      setError('No se pudo agregar la dirección. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar una dirección existente
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      const response = await userSettingsService.updateAddress(editingAddressId, addressForm);
      
      // Actualizar la lista local de direcciones
      setSettings(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr => 
          addr._id === editingAddressId ? response.address : addr
        )
      }));
      
      // Limpiar formulario y cerrar
      setAddressForm({
        title: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        isDefault: false
      });
      setEditingAddressId(null);
      setSuccess('Dirección actualizada con éxito');
    } catch (err) {
      console.error('Error al actualizar dirección:', err);
      setError('No se pudo actualizar la dirección. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar una dirección
  const handleDeleteAddress = async (addressId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      await userSettingsService.deleteAddress(addressId);
      
      // Actualizar la lista local de direcciones
      setSettings(prev => ({
        ...prev,
        addresses: prev.addresses.filter(addr => addr._id !== addressId)
      }));
      
      setSuccess('Dirección eliminada con éxito');
    } catch (err) {
      console.error('Error al eliminar dirección:', err);
      setError('No se pudo eliminar la dirección. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Preparar edición de dirección
  const startEditAddress = (address) => {
    setAddressForm({
      title: address.title,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      isDefault: address.isDefault
    });
    setEditingAddressId(address._id);
    setShowAddAddress(false);
  };

  // Contenido cuando está cargando
  if (isLoading && !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Contenido cuando hay un error
  if (error && !settings) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-brown-900 mb-6">Configuración</h2>
      
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
      
      <div className="space-y-8">
        {/* Sección de notificaciones */}
        <div>
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-brown-900">Notificaciones</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brown-900">Notificaciones por Email</h4>
                  <p className="text-sm text-gray-500">Recibe notificaciones importantes por correo electrónico</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.notifications.email}
                    onChange={() => handlePreferenceChange('notifications', 'email')}
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brown-900">Notificaciones de Promociones</h4>
                  <p className="text-sm text-gray-500">Recibe ofertas especiales y promociones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.notifications.promotions}
                    onChange={() => handlePreferenceChange('notifications', 'promotions')}
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brown-900">Actualizaciones de Pedidos</h4>
                  <p className="text-sm text-gray-500">Recibe notificaciones sobre el estado de tus pedidos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.notifications.orderUpdates}
                    onChange={() => handlePreferenceChange('notifications', 'orderUpdates')}
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de privacidad */}
        <div>
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-brown-900">Privacidad</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brown-900">Compartir Datos del Perfil</h4>
                  <p className="text-sm text-gray-500">Permite compartir tus datos para mejorar recomendaciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.privacy.shareProfileData}
                    onChange={() => handlePreferenceChange('privacy', 'shareProfileData')}
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={savePreferences}
                disabled={isLoading}
                className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    Guardar Preferencias
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Sección de direcciones */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-brown-900">Mis Direcciones</h3>
            </div>
            
            {!showAddAddress && !editingAddressId && (
              <button
                onClick={() => {
                  setShowAddAddress(true);
                  setEditingAddressId(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar Dirección
              </button>
            )}
          </div>
          
          {/* Formulario para agregar/editar dirección */}
          {(showAddAddress || editingAddressId) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-medium text-brown-900 mb-4">
                {editingAddressId ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
              </h4>
              
              <form onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    Título de la Dirección
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={addressForm.title}
                    onChange={handleAddressChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Ej. Casa, Trabajo, etc."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    Calle y Número
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Calle y número"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Ciudad"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Estado"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleAddressChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Código postal"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="default-address"
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="default-address" className="ml-2 block text-sm text-brown-700">
                    Establecer como dirección predeterminada
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
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
                    }}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Guardando...' : editingAddressId ? 'Actualizar' : 'Agregar'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Lista de direcciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            {settings && settings.addresses && settings.addresses.length > 0 ? (
              settings.addresses.map((address) => (
                <div key={address._id} className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-brown-900">{address.title}</h4>
                        {address.isDefault && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{address.street}</p>
                      <p className="text-sm text-gray-500">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditAddress(address)}
                        className="p-2 text-gray-500 hover:text-green-600"
                        disabled={isLoading}
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="p-2 text-gray-500 hover:text-red-600"
                        disabled={isLoading || address.isDefault}
                        title={address.isDefault ? "No puedes eliminar la dirección predeterminada" : "Eliminar dirección"}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500">No tienes direcciones guardadas.</p>
                {!showAddAddress && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="mt-2 text-sm text-green-600 hover:text-green-700"
                  >
                    Agregar tu primera dirección
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
