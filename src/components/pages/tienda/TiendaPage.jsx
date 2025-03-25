import { Navbar } from "../../shared/navigation/Navbar"
import { Footer } from "../../shared/navigation/Footer"
import { HeroSection } from "./sections/HeroSection"
import { SearchBar } from "./sections/SearchBar"
import { ProductsSection } from "./sections/ProductsSection"

export function TiendaPage() {
  // Datos de ejemplo para los productos
  const officeSuppliesProducts = [
    {
      id: 1,
      title: "Computadora de Oficina",
      description: "Computadora básica de trabajo",
      price: 200,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      title: "Computadora de Oficina",
      description: "Computadora básica de trabajo",
      price: 200,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      title: "Computadora de Oficina",
      description: "Computadora básica de trabajo",
      price: 200,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 4,
      title: "Computadora de Oficina",
      description: "Computadora básica de trabajo",
      price: 200,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 5,
      title: "Computadora de Oficina",
      description: "Computadora básica de trabajo",
      price: 200,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 6,
      title: "Computadora de Oficina",
      description: "Computadora básica de trabajo",
      price: 200,
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-brown-100">
      <Navbar />
      <HeroSection />
      <SearchBar />

      {/* Office Supplies Section */}
      <ProductsSection id="office-supplies" title="Office Supplies" products={officeSuppliesProducts} />

      {/* Rapid Shipping Section */}
      <ProductsSection
        id="rapid-shipping"
        title="Rapid Shipping"
        products={officeSuppliesProducts.slice(0, 6)}
        bgColor="bg-brown-200/50"
      />

      {/* Quick Delivery Section */}
      <ProductsSection id="quick-delivery" title="Quick Delivery" products={officeSuppliesProducts.slice(0, 6)} />

      <Footer />
    </main>
  )
}
