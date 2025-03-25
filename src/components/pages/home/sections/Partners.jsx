export function Partners() {
  const partners = [
    { name: "Spotify", logo: "/logos/spotify.svg" },
    { name: "Slack", logo: "/logos/slack.svg" },
    { name: "Dropbox", logo: "/logos/dropbox.svg" },
    { name: "Webflow", logo: "/logos/webflow.svg" },
  ]

  return (
    <section className="bg-gradient-to-r from-brown-200 to-brown-100 py-10 border-t border-brown-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-md mx-auto bg-green-500/10 rounded-full px-6 py-2 mb-8 transform -rotate-1">
          <p className="text-center text-brown-800 font-medium text-sm tracking-wider uppercase">
            Usado por profesionales
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <div className="h-6 w-24 relative">
                {partner.name === "Spotify" && (
                  <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current text-brown-900">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                )}
                {partner.name === "Slack" && (
                  <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current text-brown-900">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                  </svg>
                )}
                {partner.name === "Dropbox" && (
                  <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current text-brown-900">
                    <path d="M12 0l-6 3.6 6 3.6-6 3.6 6 3.6 6-3.6-6-3.6 6-3.6L12 0zM6 14.4L0 10.8l6-3.6-6-3.6L6 0l6 3.6L6 7.2l6 3.6-6 3.6zm12 0l-6-3.6 6-3.6-6-3.6L18 0l6 3.6-6 3.6 6 3.6-6 3.6z" />
                  </svg>
                )}
                {partner.name === "Webflow" && (
                  <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current text-brown-900">
                    <path d="M17.76 0H6.24C2.792 0 0 2.792 0 6.24v11.52C0 21.208 2.792 24 6.24 24h11.52c3.448 0 6.24-2.792 6.24-6.24V6.24C24 2.792 21.208 0 17.76 0zm3.6 16.12c0 .423-.36.783-.783.783h-1.2c-.424 0-.784-.36-.784-.783v-2.063c0-1.2-.967-2.167-2.167-2.167s-2.167.967-2.167 2.167v2.063c0 .423-.36.783-.783.783h-1.2c-.423 0-.783-.36-.783-.783V7.88c0-.423.36-.783.783-.783h1.2c.423 0 .783.36.783.783v.14c.726-.847 1.798-1.363 2.967-1.363 2.203 0 4.001 1.798 4.001 4v5.463h-.067z" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
