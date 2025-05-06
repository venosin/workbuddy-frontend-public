import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import notificationService from '../../../services/notificationService';
import { Navbar } from "../../shared/navigation/Navbar";
import { Footer } from "../../shared/navigation/Footer";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'El formato del correo es inválido';
    if (!formData.subject.trim()) newErrors.subject = 'El asunto es obligatorio';
    if (!formData.message.trim()) newErrors.message = 'El mensaje es obligatorio';
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // You can replace this with your actual email API endpoint
      const response = await fetch('https://formsubmit.co/ajax/workbuddy2025@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'No proporcionado',
          subject: formData.subject,
          message: formData.message,
          _subject: `Nuevo contacto: ${formData.subject}`
        })
      });
      
      if (response.ok) {
        notificationService.success('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        notificationService.error('Hubo un problema al enviar el mensaje. Por favor intenta de nuevo.');
      }
    } catch (error) {
      notificationService.error('Error de conexión. Por favor verifica tu conexión a internet e intenta de nuevo.');
      console.error('Error sending contact form:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="bg-brown-50 py-12">
        <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-brown-900 mb-4">Contáctanos</h1>
            <p className="text-brown-700 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Si tienes alguna pregunta, sugerencia o requieres información adicional sobre nuestros productos, no dudes en contactarnos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Mail className="text-green-600 h-6 w-6" />
              </div>
              <h3 className="font-semibold text-brown-900 mb-2">Correo Electrónico</h3>
              <p className="text-brown-700">workbuddy2025@gmail.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Phone className="text-green-600 h-6 w-6" />
              </div>
              <h3 className="font-semibold text-brown-900 mb-2">Teléfono</h3>
              <p className="text-brown-700">+123 456 7890</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <MapPin className="text-green-600 h-6 w-6" />
              </div>
              <h3 className="font-semibold text-brown-900 mb-2">Dirección</h3>
              <p className="text-brown-700">123 Calle Principal, Ciudad, País</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-brown-900 mb-6">Envíanos un mensaje</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brown-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Tu nombre"
                  />
                  {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brown-700 mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brown-700 mb-1">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Tu número de teléfono"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-brown-700 mb-1">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Asunto de tu mensaje"
                  />
                  {errors.subject && <p className="mt-1 text-red-500 text-sm">{errors.subject}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brown-700 mb-1">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
                {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message}</p>}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-brown-900 mb-4">Nuestra ubicación</h2>
              <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
                {/* Replace with your actual Google Maps embed code */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.33750346623!2d-73.97968099999999!3d40.6974881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1667261489300!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de WorkBuddy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}
