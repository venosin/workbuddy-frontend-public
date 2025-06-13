import { useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import reviewsService from "../../../../services/api/reviewsService"

export function Testimonials() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Datos de ejemplo para mostrar mientras se cargan las reviews reales o si hay errores
  const fallbackTestimonials = [
    {
      clientId: { name: "Ana García" },
      productId: { name: "Mesa de Trabajo Ergonómica" },
      score: 5,
      comment: "WorkBuddy ha transformado mi oficina en casa. Los accesorios ergonómicos han marcado una gran diferencia en mi comodidad y productividad."
    },
    {
      clientId: { name: "Juan Martínez" },
      productId: { name: "Organizador de Escritorio" },
      score: 5,
      comment: "Me encanta el diseño minimalista de los productos. No solo se ven geniales, sino que también me ayudan a organizarme."
    },
  ]

  // Configuración del carrusel
  const sliderSettings = {
    dots: true,
    infinite: reviews.length > 1 || fallbackTestimonials.length > 1,
    speed: 500,
    slidesToShow: Math.min(2, reviews.length || fallbackTestimonials.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  // Obtener las reviews desde el backend
  useEffect(() => {
    let isMounted = true; // Bandera para evitar actualizar estado en componentes desmontados
    
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const data = await reviewsService.getAllReviews()
        
        // Prevenir actualización si el componente se desmontó
        if (!isMounted) return;
        
        if (!data || data.length === 0) {
          console.log("No se encontraron reviews en el backend, usando datos de ejemplo")
          setError("No hay reseñas disponibles en este momento. Mostrando reseñas de ejemplo.")
          setReviews([])
          return
        }
        
        // Filtrar solo reviews con buena puntuación (4 o 5) para mostrar en la landing
        const filteredReviews = data.filter(review => review && review.score >= 4)
        
        if (filteredReviews.length === 0) {
          console.log("No se encontraron reviews con puntuación alta, usando datos de ejemplo")
          setError("No hay reseñas destacadas disponibles. Mostrando reseñas de ejemplo.")
          setReviews([])
          return
        }
        
        console.log("Reviews cargadas con éxito:", filteredReviews)
        setReviews(filteredReviews)
        setError(null)
      } catch (err) {
        console.error("Error al cargar las reviews:", err)
        if (isMounted) {
          setError("No pudimos cargar las reseñas. Mostrando reseñas de ejemplo.")
          setReviews([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchReviews()
    
    // Cleanup function para evitar memory leaks
    return () => {
      isMounted = false;
    }
  }, [])

  // Determinar qué testimonios mostrar
  const testimonialsToShow = reviews.length > 0 ? reviews : fallbackTestimonials
  
  const renderStars = (score) => {
    try {
      return Array.from({ length: score || 5 }).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
    } catch (e) {
      console.error("Error al renderizar estrellas:", e);
      return <span className="text-yellow-400">★★★★★</span>;
    }
  };

  // Si hay un error de carga total, mostrar el fallback sin slider
  if (loading) {
    return (
      <section className="bg-brown-800 py-16 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brown-800 py-16 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-sans font-bold text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>

        {error && <p className="text-center text-yellow-400 mb-4">{error}</p>}

        <div className="testimonials-slider">
          {testimonialsToShow && testimonialsToShow.length > 0 ? (
            <Slider {...sliderSettings}>
              {testimonialsToShow.map((testimonial, index) => (
                <div key={testimonial._id || `testimonial-${index}`} className="px-2">
                  <div className="bg-brown-700 rounded-lg p-6 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-[60px] h-[60px] rounded-full bg-brown-500 flex items-center justify-center text-xl font-semibold">
                          {testimonial?.clientId?.name?.charAt(0) || '?'}
                        </div>
                      </div>
                      <div>
                        <div className="flex mb-2">
                          {renderStars(testimonial?.score)}
                        </div>
                        <p className="text-sm mb-4 font-sans">{testimonial?.comment || 'Sin comentario'}</p>
                        <div>
                          <p className="font-medium font-sans">{testimonial?.clientId?.name || 'Cliente'}</p>
                          {testimonial?.productId?.name && (
                            <p className="text-xs italic text-brown-400 mt-1">
                              Sobre: {testimonial.productId.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fallbackTestimonials.map((testimonial, index) => (
                <div key={`fallback-${index}`} className="bg-brown-700 rounded-lg p-6 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-[60px] h-[60px] rounded-full bg-brown-500 flex items-center justify-center text-xl font-semibold">
                        {testimonial.clientId?.name?.charAt(0) || '?'}
                      </div>
                    </div>
                    <div>
                      <div className="flex mb-2">
                        {renderStars(testimonial.score)}
                      </div>
                      <p className="text-sm mb-4 font-sans">{testimonial.comment}</p>
                      <div>
                        <p className="font-medium font-sans">{testimonial.clientId?.name || 'Cliente'}</p>
                        {testimonial.productId && (
                          <p className="text-xs italic text-brown-400 mt-1">
                            Sobre: {testimonial.productId.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
