import React, { useEffect, useRef, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Box, X } from "lucide-react";
import { DeskModelViewer } from '../../../shared/3d/DeskModel';

// Componente para mostrar imagen estática con opción de 3D
function HeroImageWithOptional3D() {
  const [show3D, setShow3D] = useState(false);
  
  return (
    <>
      {!show3D ? (
        // Imagen estática (modo por defecto)
        <div className="rounded-lg relative" style={{ height: '400px', maxWidth: '600px' }}>
          <img
            src="/images/muebledashboard.jpg"
            alt="Escritorio ergonómico"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-3 right-3">
            <button 
              onClick={() => setShow3D(true)}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors text-xs font-sans flex items-center"
            >
              <span className="mr-1">Ver en 3D</span>
              <Box className="h-4 w-4 text-brown-900" />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 bg-white/70 backdrop-blur-sm p-2 rounded text-xs font-sans text-brown-800">
            <p>Modelo de escritorio ergonómico WorkBuddy Pro</p>
          </div>
        </div>
      ) : (
        // Modelo 3D (activado por el usuario)
        <div className="rounded-lg" style={{ height: '400px', maxWidth: '600px' }}>
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center bg-brown-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          }>
            <DeskModelViewer height="400px" autoRotate={true} />                
          </Suspense>
          <div className="absolute top-3 right-3">
            <button 
              onClick={() => setShow3D(false)}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white/90 transition-colors text-xs font-sans flex items-center"
            >
              <span className="mr-1">Ver imagen</span>
              <X className="h-4 w-4 text-brown-900" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function Hero() {
  const titleRef = useRef(null);
  
  useEffect(() => {
    if (titleRef.current) {
      const titleElement = titleRef.current;
      const firstLine = "Transforma Tu";
      const secondLine = "Oficina";
      
      titleElement.innerHTML = '';
      
      // Crear contenedor para las líneas
      const linesContainer = document.createElement('div');
      linesContainer.className = 'flex flex-col';
      
      // Primera línea
      const firstLineContainer = document.createElement('div');
      const firstLineWords = firstLine.split(' ');
      
      firstLineWords.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word inline-block';
        
        [...word].forEach((char, charIndex) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'char inline-block';
          charSpan.textContent = char;
          charSpan.style.animationDelay = `${0.05 * (wordIndex * 3 + charIndex)}s`;
          charSpan.style.marginRight = '0.01em';
          wordSpan.appendChild(charSpan);
        });
        
        firstLineContainer.appendChild(wordSpan);
        
        if (wordIndex < firstLineWords.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'inline-block';
          spaceSpan.innerHTML = '&nbsp;';
          spaceSpan.style.marginRight = '0.25em';
          firstLineContainer.appendChild(spaceSpan);
        }
      });
      
      // Segunda línea
      const secondLineContainer = document.createElement('div');
      const secondLineWords = secondLine.split(' ');
      
      secondLineWords.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word inline-block';
        
        [...word].forEach((char, charIndex) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'char inline-block';
          charSpan.textContent = char;
          // Continuar con la secuencia de retraso después de la primera línea
          const totalFirstLineChars = firstLine.replace(/\s+/g, '').length;
          charSpan.style.animationDelay = `${0.05 * (totalFirstLineChars + wordIndex * 3 + charIndex)}s`;
          charSpan.style.marginRight = '0.01em';
          wordSpan.appendChild(charSpan);
        });
        
        secondLineContainer.appendChild(wordSpan);
        
        if (wordIndex < secondLineWords.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'inline-block';
          spaceSpan.innerHTML = '&nbsp;';
          spaceSpan.style.marginRight = '0.25em';
          secondLineContainer.appendChild(spaceSpan);
        }
      });
      
      linesContainer.appendChild(firstLineContainer);
      linesContainer.appendChild(secondLineContainer);
      titleElement.appendChild(linesContainer);
    }
  }, []);

  return (
    <section className="bg-brown-100 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 ref={titleRef} className="split-text text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-brown-900 leading-tight mb-4">
              Transforma Tu
              <br/>
              Oficina
            </h1>
            <p className="text-brown-700 mb-6 max-w-md font-sans text-lg opacity-0 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              Descubre nuestra selección de elementos de oficina ergonómicos y elegantes para trabajo remoto.
            </p>
            <div className="opacity-0 animate-fade-in-up" style={{animationDelay: '1s'}}>
              <Link
                to="/coleccion"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-sans"
              >
                Ver Nuestra Colección
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 relative opacity-0 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="relative rounded-lg overflow-hidden shadow-lg bg-brown-50/50 backdrop-blur-sm">
              <HeroImageWithOptional3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
