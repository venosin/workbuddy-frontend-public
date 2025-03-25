import { Search } from "lucide-react"

export function SearchBar() {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-auto flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-brown-500" />
            </div>
            <input
              type="search"
              className="block w-full p-2.5 pl-10 text-sm text-brown-900 border border-brown-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500"
              placeholder="Busca tu producto favorito..."
            />
          </div>
          <div className="flex space-x-4 text-sm text-brown-700 mt-4 md:mt-0">
            <button className="hover:text-brown-900 transition-colors">Tienda</button>
            <button className="hover:text-brown-900 transition-colors">Los más/destacados</button>
            <button className="hover:text-brown-900 transition-colors">Recomendaciones</button>
            <button className="hover:text-brown-900 transition-colors">Para compartir</button>
          </div>
        </div>
      </div>
    </section>
  )
}
