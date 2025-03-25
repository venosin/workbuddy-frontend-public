import { Link } from 'react-router-dom'

export function Newsletter() {
  return (
    <section className="bg-brown-100 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900 mb-4">
              ¡Únete a nuestra comunidad!
            </h2>
            <p className="text-brown-700 mb-6">Descubre cómo mejorar tu espacio de trabajo.</p>
            <Link
              to="/explorar"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
            >
              Explorar ahora
            </Link>
          </div>

          <div className="md:w-1/2 bg-green-500/10 p-8 rounded-lg">
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-brown-900">Soporte Ergonómico</h3>
                  <p className="text-sm text-brown-700">Mejora tu postura mientras trabajas.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-brown-900">Iluminación Ajustable</h3>
                  <p className="text-sm text-brown-700">Redefine tu espacio de manera eficiente.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-1 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-brown-900">Organización Inteligente</h3>
                  <p className="text-sm text-brown-700">Mantén tu espacio ordenado y funcional.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
