export function FinalCta() {
  return (
    <section className="relative bg-brown-900 text-white py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
      ></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Tu Espacio, Tu Estilo.</h2>
          <p className="text-lg mb-8">Transforma tu experiencia de trabajo remoto con nuestros accesorios premium.</p>
        </div>
      </div>
    </section>
  )
}
