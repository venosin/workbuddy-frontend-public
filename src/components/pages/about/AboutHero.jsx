import React, { useEffect, useRef } from 'react';

export const AboutHero = () => {
  const titleRef = useRef(null);
  
  useEffect(() => {
    if (titleRef.current) {
      const text = titleRef.current.innerText;
      titleRef.current.innerHTML = '';
      
      const textWrapper = document.createElement('span');
      textWrapper.className = 'text-wrapper';
      
      [...text].forEach(char => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        textWrapper.appendChild(span);
      });
      
      titleRef.current.appendChild(textWrapper);
    }
  }, []);

  return (
    <section className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 ref={titleRef} className="title-animated text-contrast mb-6 font-sans">
            Conoce a WorkBuddy
          </h1>
          <p className="subtitle-animated text-contrast/80 mb-8 max-w-2xl mx-auto font-sans">
            Conectando personas y propiedades con un diseño intuitivo y atractivo desde 2022.
            Nuestra misión es simplificar la experiencia inmobiliaria.
          </p>
          <div className="animated-divider bg-accent mx-auto mb-10"></div>
          
          <div className="flex justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <a 
              href="/contacto" 
              className="bg-additional hover:bg-additional/90 text-white font-sans font-medium py-3 px-8 rounded-md transition-colors"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-secondary" style={{clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)'}}></div>
    </section>
  );
};
