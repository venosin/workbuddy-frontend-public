import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Phone, MapPin, Mail, Save, Upload } from 'lucide-react';
import profileService from '../../../services/profileService';
import { BackButton } from '../../shared/ui/BackButton';

export function ProfileDetail() {
  const { profile, setProfile } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phoneNumber: profile?.phoneNumber || '',
    address: profile?.address || ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(profile?.profileImage?.url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Crear una URL para previsualizar la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Preparar datos con o sin imagen
      let dataToSend;
      if (selectedImage) {
        dataToSend = profileService.prepareProfileUpdateWithImage(formData, selectedImage);
      } else {
        dataToSend = { ...formData };
      }

      // Actualizar perfil
      const response = await profileService.updateUserProfile(dataToSend);
      
      // Actualizar estado local
      setProfile(response.user);
      setIsEditing(false);
      setSuccess('Perfil actualizado con éxito');
      
      // Limpiar estados
      setSelectedImage(null);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError('No se pudo actualizar el perfil. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <BackButton className="text-brown-600 hover:text-brown-800" label="Volver al inicio" toPath="/" />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-brown-900">Información Personal</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Editar Perfil
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: profile?.name || '',
                phoneNumber: profile?.phoneNumber || '',
                address: profile?.address || ''
              });
              setSelectedImage(null);
              setPreviewImage(profile?.profileImage?.url || '');
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
      </div>

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

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Vista previa"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-green-100 text-green-500">
                      <Upload size={32} />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer"
                >
                  <Upload className="h-5 w-5 text-green-600" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-brown-700">
                Nombre Completo
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Tu nombre"
                  required
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700">
              Número de Teléfono
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="+52 123 456 7890"
                />
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700">
              Dirección
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Tu dirección"
                />
              </div>
            </label>
          </div>

          <div className="pt-5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </span>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 px-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.email || 'No disponible'}
              </dd>
            </div>
            <div className="py-4 px-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                Nombre Completo
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.name || 'No disponible'}
              </dd>
            </div>
            <div className="py-4 px-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Teléfono
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.phoneNumber || 'No disponible'}
              </dd>
            </div>
            <div className="py-4 px-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Dirección
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile?.address || 'No disponible'}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
