import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    // Función para aplicar la animación de letras con fade in
    const animateTitle = () => {
      if (!titleRef.current) return;
      
      const title = titleRef.current;
      const text = title.textContent;
      title.textContent = '';
      
      for (let i = 0; i < text.length; i++) {
        const letter = document.createElement('span');
        letter.className = 'title-letter';
        letter.style.animationDelay = `${i * 0.05}s`;
        letter.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        title.appendChild(letter);
      }
    };
    
    // Configuramos el observador de intersección
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateTitle();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Comenzamos a observar el elemento de la sección
    const currentTitleRef = titleRef.current;
    if (currentTitleRef) {
      observer.observe(currentTitleRef);
    }
    
    return () => {
      if (currentTitleRef) {
        observer.unobserve(currentTitleRef);
      }
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-contrast mb-4">
              Transforma Tu Oficina
            </h1>
            <p className="text-contrast/80 mb-6 max-w-md font-body text-lg opacity-0 animate-fade-in" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
              Descubre nuestra selección de elementos de oficina ergonómicos y elegantes para trabajo remoto.
            </p>
            <div className="opacity-0 animate-fade-in" style={{animationDelay: '0.8s', animationFillMode: 'forwards'}}>
              <a
                href="#products"
                className="inline-block bg-additional text-white px-6 py-3 rounded-md hover:bg-additional/90 transition-colors"
              >
                Ver Nuestra Colección
              </a>
            </div>
          </div>

          <div className="md:w-1/2 relative opacity-0 animate-fade-in" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Espacio de trabajo ergonómico"
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '400px', width: '600px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
