import { Navbar } from "../../shared/navigation/Navbar";
import { Footer } from "../../shared/navigation/Footer";

export function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brown-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-brown-900 mb-6 text-center">Política de Privacidad</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <p className="text-brown-700 mb-4">
            Última actualización: 25 de marzo, 2025
          </p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">1. Introducción</h2>
            <p className="text-brown-700 mb-3">
              En WorkBuddy, valoramos y respetamos su privacidad. Esta Política de Privacidad explica cómo recopilamos, 
              usamos y protegemos su información personal cuando utiliza nuestro sitio web y servicios.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">2. Información que recopilamos</h2>
            <p className="text-brown-700 mb-3">
              Podemos recopilar los siguientes tipos de información:
            </p>
            <ul className="list-disc pl-6 text-brown-700 space-y-2">
              <li>Información de identificación personal (nombre, dirección de correo electrónico, dirección postal, número de teléfono)</li>
              <li>Información de pago (detalles de tarjeta de crédito, dirección de facturación)</li>
              <li>Información del dispositivo y navegador</li>
              <li>Datos de uso y preferencias</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">3. Cómo utilizamos su información</h2>
            <p className="text-brown-700 mb-3">
              Utilizamos su información para:
            </p>
            <ul className="list-disc pl-6 text-brown-700 space-y-2">
              <li>Procesar y gestionar sus pedidos</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Personalizar su experiencia de compra</li>
              <li>Comunicarnos con usted sobre pedidos, productos, servicios y ofertas promocionales</li>
              <li>Prevenir actividades fraudulentas</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">4. Cookies y tecnologías similares</h2>
            <p className="text-brown-700 mb-3">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web, analizar el tráfico
              y personalizar el contenido. Puede gestionar sus preferencias de cookies a través de la configuración de su navegador.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">5. Compartir su información</h2>
            <p className="text-brown-700 mb-3">
              No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información con:
            </p>
            <ul className="list-disc pl-6 text-brown-700 space-y-2">
              <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
              <li>Socios de envío para entregar sus pedidos</li>
              <li>Autoridades legales cuando sea requerido por la ley</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">6. Sus derechos</h2>
            <p className="text-brown-700 mb-3">
              Dependiendo de su ubicación, puede tener los siguientes derechos:
            </p>
            <ul className="list-disc pl-6 text-brown-700 space-y-2">
              <li>Acceder a la información personal que tenemos sobre usted</li>
              <li>Corregir información inexacta</li>
              <li>Eliminar su información personal</li>
              <li>Oponerse o restringir el procesamiento de sus datos</li>
              <li>Solicitar la portabilidad de sus datos</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">7. Seguridad</h2>
            <p className="text-brown-700 mb-3">
              Implementamos medidas de seguridad para proteger su información personal contra acceso, divulgación, 
              alteración o destrucción no autorizados.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">8. Cambios a esta política</h2>
            <p className="text-brown-700 mb-3">
              Podemos actualizar esta política periódicamente. Le notificaremos sobre cambios significativos publicando 
              la nueva política en esta página y actualizando la fecha de "última actualización".
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-brown-900 mb-3">9. Contacto</h2>
            <p className="text-brown-700">
              Si tiene preguntas sobre esta Política de Privacidad, contáctenos en:
              <br />
              <a href="mailto:privacy@workbuddy.com" className="text-green-600 hover:underline">privacy@workbuddy.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
