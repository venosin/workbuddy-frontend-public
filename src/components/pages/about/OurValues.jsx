import React from 'react';

export const OurValues = () => {
  const values = [
    {
      icon: "🤝",
      title: "Compromiso",
      description: "Nos comprometemos a ofrecer un servicio excepcional y una experiencia inmobiliaria sin complicaciones."
    },
    {
      icon: "💡",
      title: "Innovación",
      description: "Buscamos constantemente nuevas formas de mejorar nuestra plataforma y los servicios que ofrecemos."
    },
    {
      icon: "🔒",
      title: "Confianza",
      description: "Construimos relaciones sólidas basadas en la honestidad, la transparencia y la confiabilidad."
    },
    {
      icon: "✨",
      title: "Excelencia",
      description: "Nos esforzamos por superar las expectativas en todo lo que hacemos, desde el diseño hasta el servicio al cliente."
    }
  ];

  return (
    <section className="py-16 bg-primary px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="animated-heading text-contrast shine-effect font-sans">Nuestros Valores</h2>
          <div className="animated-divider bg-accent mx-auto"></div>
          <p className="text-contrast/80 max-w-2xl mx-auto font-sans opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Estos son los principios que guían cada decisión que tomamos y cada interacción con nuestros clientes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-secondary rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.2}s` }}
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-sans font-bold text-contrast mb-3">{value.title}</h3>
              <p className="text-contrast/80 font-sans">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
