import { Navbar } from "../../shared/navigation/Navbar";
import { Footer } from "../../shared/navigation/Footer";

export function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-brown-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-brown-900 mb-6 text-center">Términos de Servicio</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <p className="text-brown-700 mb-4">
            Última actualización: 25 de marzo, 2025
          </p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">1. Aceptación de los Términos</h2>
            <p className="text-brown-700 mb-3">
              Al acceder y utilizar el sitio web de WorkBuddy, usted acepta estar legalmente obligado por estos Términos de Servicio.
              Si no está de acuerdo con alguno de estos términos, no utilice nuestro sitio web ni nuestros servicios.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">2. Uso del Sitio</h2>
            <p className="text-brown-700 mb-3">
              Usted acepta utilizar nuestro sitio web solo para fines legales y de acuerdo con estos Términos. Queda prohibido:
            </p>
            <ul className="list-disc pl-6 text-brown-700 space-y-2">
              <li>Utilizar el sitio de manera fraudulenta o en relación con cualquier actividad ilegal</li>
              <li>Violar cualquier ley, reglamento o derechos de terceros</li>
              <li>Interferir con el funcionamiento normal del sitio</li>
              <li>Intentar acceder a áreas restringidas sin autorización</li>
              <li>Recopilar información personal de otros usuarios sin su consentimiento</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">3. Cuentas de Usuario</h2>
            <p className="text-brown-700 mb-3">
              Al crear una cuenta en nuestro sitio, usted es responsable de:
            </p>
            <ul className="list-disc pl-6 text-brown-700 space-y-2">
              <li>Mantener la confidencialidad de su contraseña</li>
              <li>Restringir el acceso a su dispositivo y cuenta</li>
              <li>Asumir la responsabilidad de todas las actividades realizadas bajo su cuenta</li>
              <li>Proporcionar información precisa y actualizada</li>
            </ul>
            <p className="text-brown-700 mt-3">
              Nos reservamos el derecho de suspender o terminar cuentas que violen nuestros términos.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">4. Productos y Compras</h2>
            <p className="text-brown-700 mb-3">
              Los productos y servicios están sujetos a disponibilidad. Nos reservamos el derecho de limitar cantidades, 
              rechazar pedidos y discontinuar productos sin previo aviso.
            </p>
            <p className="text-brown-700 mb-3">
              Los precios están sujetos a cambios sin notificación previa. Los cargos por envío y manejo se 
              añadirán a su compra total y se mostrarán durante el proceso de pago.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">5. Política de Devoluciones</h2>
            <p className="text-brown-700 mb-3">
              Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que los productos estén en su 
              estado original, sin usar y con todas las etiquetas y embalajes intactos.
            </p>
            <p className="text-brown-700 mb-3">
              Para iniciar una devolución, póngase en contacto con nuestro servicio de atención al cliente. 
              Los gastos de envío para las devoluciones corren por cuenta del cliente, a menos que el producto 
              sea defectuoso o se haya enviado por error.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">6. Propiedad Intelectual</h2>
            <p className="text-brown-700 mb-3">
              Todo el contenido del sitio web, incluyendo texto, gráficos, logotipos, imágenes y software, 
              es propiedad de WorkBuddy o de nuestros proveedores de contenido y está protegido por leyes de 
              propiedad intelectual. Está prohibida la reproducción, distribución o uso no autorizado de dicho material.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">7. Limitación de Responsabilidad</h2>
            <p className="text-brown-700 mb-3">
              WorkBuddy no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes 
              que resulten del uso o la imposibilidad de usar nuestros productos o servicios.
            </p>
            <p className="text-brown-700 mb-3">
              Nuestro sitio y productos se proporcionan "tal cual" y "según disponibilidad" sin garantías de ningún tipo.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">8. Indemnización</h2>
            <p className="text-brown-700 mb-3">
              Usted acepta indemnizar y mantener indemne a WorkBuddy y a sus afiliados, directores, empleados y agentes 
              de cualquier reclamación, demanda, daño o gasto, incluidos honorarios razonables de abogados, que surjan 
              de su incumplimiento de estos Términos o del uso indebido del sitio.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-brown-900 mb-3">9. Modificaciones</h2>
            <p className="text-brown-700 mb-3">
              Nos reservamos el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor 
              inmediatamente después de su publicación en el sitio. Su uso continuado del sitio después de los cambios 
              constituye su aceptación de los Términos modificados.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-brown-900 mb-3">10. Contacto</h2>
            <p className="text-brown-700">
              Si tiene preguntas sobre estos Términos de Servicio, contáctenos en:
              <br />
              <a href="mailto:legal@workbuddy.com" className="text-green-600 hover:underline">legal@workbuddy.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
