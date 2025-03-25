export function Testimonials() {
  const testimonials = [
    {
      name: "Ana García",
      role: "Diseñadora Freelance",
      company: "Agencia Creativa",
      quote:
        '"WorkBuddy ha transformado mi oficina en casa. Los accesorios ergonómicos han marcado una gran diferencia en mi comodidad y productividad."',
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      name: "Juan Martínez",
      role: "Desarrollador",
      company: "Tech Company",
      quote:
        '"Me encanta el diseño minimalista de los productos. No solo se ven geniales, sino que también me ayudan a organizarme."',
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
  ]

  return (
    <section className="bg-brown-800 py-16 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-brown-700 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-[60px] h-[60px] rounded-full"
                  />
                </div>
                <div>
                  <div className="flex mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm mb-4">{testimonial.quote}</p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-xs text-brown-300">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
