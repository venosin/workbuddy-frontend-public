import { Link } from 'react-router-dom'
import { ArrowRight } from "lucide-react"

export function Gallery() {
  const features = [
    {
      title: "Precios Accesibles",
      description: "Productos de calidad que no vaciarán tu bolsillo, haciendo que la ergonomía sea accesible.",
      image: "/images/accesibles.png",
    },
    {
      title: "Opciones Personalizables",
      description: "Haz que tu espacio de trabajo refleje tu personalidad con accesorios personalizados.",
      image: "/images/personalizables.png",
    },
    {
      title: "Diseño Minimalista",
      description: "Limpio y elegante diseño que mejora tu productividad sin distracciones.",
      image: "/images/minimalista.png",
    },
    {
      title: "Garantía de Calidad",
      description: "Nos enorgullecemos de nuestros productos, ofreciendo calidad y durabilidad.",
      image: "/images/calidad.png",
    },
    {
      title: "Experiencia Amigable",
      description: "Compra fácil y rápida con un servicio que realmente se preocupa por ti.",
      image: "/images/amigable.png",
    },
    {
      title: "Prácticas Sostenibles",
      description:
        "Comprometidos con la sostenibilidad, ofreciendo productos que son buenos para ti y para el planeta.",
      image: "/images/sostenibles.png",
    },
  ]

  return (
    <section className="bg-brown-100 py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-center mb-8">
          <Link
            to="/tienda"
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Tienda <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 relative">
                <img src={feature.image || "/placeholder.svg"} alt={feature.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-brown-900 mb-2">{feature.title}</h3>
                <p className="text-brown-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
