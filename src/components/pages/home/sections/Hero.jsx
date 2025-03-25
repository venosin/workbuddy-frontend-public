import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play } from "lucide-react";

export function Hero() {
  const titleRef = useRef(null);
  
  useEffect(() => {
    if (titleRef.current) {
      const titleElement = titleRef.current;
      const words = titleElement.innerText.trim().split(' ');
      titleElement.innerHTML = '';
      
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word mr-5 md:mr-6';
        
        [...word].forEach((char, charIndex) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'char';
          charSpan.textContent = char;
          charSpan.style.animationDelay = `${0.05 * (wordIndex * 3 + charIndex)}s`;
          charSpan.style.marginRight = '0.1em';
          wordSpan.appendChild(charSpan);
        });
        
        titleElement.appendChild(wordSpan);
      });
    }
  }, []);

  return (
    <section className="bg-brown-100 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 ref={titleRef} className="split-text text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brown-900 leading-tight mb-4">
              Eleva Tu Experiencia de Trabajo
            </h1>
            <p className="text-brown-700 mb-6 max-w-md font-body text-lg opacity-0 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              Descubre una selección cuidada de accesorios ergonómicos y elegantes diseñados para tus necesidades de
              trabajo remoto.
            </p>
            <div className="opacity-0 animate-fade-in-up" style={{animationDelay: '1s'}}>
              <Link
                to="/coleccion"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
              >
                Explora Nuestra Colección
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 relative opacity-0 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Espacio de trabajo ergonómico"
                className="w-full h-auto rounded-lg"
                style={{ maxWidth: '600px', maxHeight: '400px' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white/30 backdrop-blur-sm p-4 rounded-full hover:bg-white/50 transition-colors">
                  <Play className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
