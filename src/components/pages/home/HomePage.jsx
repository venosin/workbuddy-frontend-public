import { Navbar } from "../../shared/navigation/Navbar"
import { Footer } from "../../shared/navigation/Footer"
import { Hero } from "./sections/Hero"
import { Partners } from "./sections/Partners"
import { Gallery } from "./sections/Gallery"
import { Testimonials } from "./sections/Testimonials"
import { Newsletter } from "./sections/Newsletter"
import { FinalCta } from "./sections/FinalCta"

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Partners />
      <Gallery />
      <Testimonials />
      <Newsletter />
      <FinalCta />
      <Footer />
    </main>
  )
}
