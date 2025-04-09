import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function BackButton({ label = 'Volver', className = '', toPath }) {
  const navigate = useNavigate();

  const goBack = () => {
    if (toPath) {
      navigate(toPath); // Navega a la ruta especificada
    } else {
      navigate(-1); // Navega a la página anterior
    }
  };

  return (
    <button 
      onClick={goBack}
      className={`flex items-center text-brown-700 hover:text-brown-900 transition-colors ${className}`}
      aria-label="Volver a la página anterior"
    >
      <ArrowLeft className="h-5 w-5 mr-1" />
      {label}
    </button>
  );
}
