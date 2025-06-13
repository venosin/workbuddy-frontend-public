import React from 'react';

export const OurHistory = () => {
  return (
    <section className="py-16 bg-secondary px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-accent rounded-lg"></div>
              <img 
                src="/images/office.jpg" 
                alt="Historia de WorkBuddy" 
                className="rounded-lg shadow-xl relative z-10 w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80";
                }}
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h2 className="animated-heading text-contrast shine-effect font-sans">Nuestra Historia</h2>
            <div className="animated-divider bg-accent"></div>
            
            <p className="text-contrast/80 mb-6 font-sans opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              WorkBuddy nació en 2022 con una visión clara: transformar la manera en que las personas interactúan con los espacios de trabajo. Fundada por un grupo de profesionales apasionados por el diseño y la innovación, nuestra empresa ha crecido hasta convertirse en un referente en la industria inmobiliaria.
            </p>
            
            <p className="text-contrast/80 mb-6 font-sans opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              Lo que comenzó como una pequeña startup se ha convertido en una plataforma robusta que conecta personas con propiedades que se adaptan perfectamente a sus necesidades, ofreciendo siempre una experiencia intuitiva y atractiva.
            </p>
            
            <p className="text-contrast/80 font-sans opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
              Hoy en día, seguimos comprometidos con nuestra misión original, mejorando constantemente nuestra plataforma y ampliando nuestros servicios para ofrecer la mejor experiencia posible a nuestros usuarios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
