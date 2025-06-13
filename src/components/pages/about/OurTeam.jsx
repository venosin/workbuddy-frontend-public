import React from 'react';

export const OurTeam = () => {
  const teamMembers = [
    {
      name: "Ana García",
      role: "CEO & Fundadora",
      image: "/images/team/ana.jpg",
      bio: "Con más de 15 años de experiencia en el sector inmobiliario, Ana fundó WorkBuddy con la visión de revolucionar la forma en que las personas encuentran espacios de trabajo.",
      fallbackImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
    },
    {
      name: "Carlos Méndez",
      role: "Director de Tecnología",
      image: "/images/team/carlos.jpg",
      bio: "Carlos es un apasionado de la tecnología con un fuerte enfoque en la experiencia del usuario. Lidera nuestro equipo de desarrollo para crear soluciones intuitivas y eficientes.",
      fallbackImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Elena Rodríguez",
      role: "Directora de Operaciones",
      image: "/images/team/elena.jpg",
      bio: "Elena se asegura de que todo funcione sin problemas en WorkBuddy. Su atención al detalle y su capacidad para resolver problemas son invaluables para nuestro equipo.",
      fallbackImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80"
    },
    {
      name: "Miguel Torres",
      role: "Director de Marketing",
      image: "/images/team/miguel.jpg",
      bio: "Con su creatividad y conocimiento del mercado, Miguel ha ayudado a posicionar a WorkBuddy como líder en el sector inmobiliario de espacios de trabajo.",
      fallbackImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  return (
    <section className="py-16 bg-white px-4 sm:px-6 lg:px-8" id="equipo">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="animated-heading text-contrast shine-effect font-sans">Nuestro Equipo</h2>
          <div className="animated-divider bg-accent mx-auto"></div>
          <p className="text-contrast/80 max-w-2xl mx-auto font-sans opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Conozca a las personas detrás de WorkBuddy, profesionales apasionados que trabajan para ofrecerle la mejor experiencia inmobiliaria.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow opacity-0 animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.2}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = member.fallbackImage;
                  }}
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-sans font-bold text-contrast mb-1">{member.name}</h3>
                <p className="text-accent mb-4 font-sans font-medium">{member.role}</p>
                <p className="text-contrast/80 font-sans">{member.bio}</p>
                
                <div className="mt-4 flex space-x-3">
                  <a href="#" className="text-contrast hover:text-accent transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" className="text-contrast hover:text-accent transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
