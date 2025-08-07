import React from "react";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Términos y Condiciones</h1>
      <p className="mb-6 text-sm text-gray-600">
        Fecha de entrada en vigencia: 1 de junio de 2025
      </p>

      <section className="space-y-6 text-gray-700">
        <p>
          Bienvenido a Techco S.A.C. ("Techco", "nosotros", "nuestro" o "la
          Plataforma"), una plataforma SaaS que permite a empresas gestionar sus
          procesos de contratación, y a los candidatos, participar en ellos. Al
          acceder, registrarse o utilizar nuestros servicios, usted acepta estar
          sujeto a los siguientes Términos y Condiciones.
        </p>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            1. Aceptación de los Términos
          </h2>
          <p>
            Al acceder o utilizar la plataforma, usted acepta haber leído,
            entendido y estar de acuerdo con estos Términos y Condiciones. Si no
            está de acuerdo, por favor absténgase de utilizar los servicios.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            2. Usuarios y Registro
          </h2>

          <h3 className="mt-4 text-lg font-medium">2.1. Empresas Cliente</h3>
          <p>
            Las empresas registradas pueden crear y administrar procesos de
            selección, incluyendo la publicación de vacantes, criterios de
            evaluación, pruebas, entrevistas y gestión de candidatos. El
            registro se realiza mediante verificación OTP y requiere
            proporcionar información de contacto y corporativa.
          </p>

          <h3 className="mt-4 text-lg font-medium">2.2. Candidatos</h3>
          <p>
            Los usuarios que aplican a procesos de selección deben proporcionar
            información personal como nombre, correo electrónico, teléfono,
            currículum, perfil de LinkedIn, y demás datos relevantes para el
            proceso. Al enviar su información, el candidato autoriza a la
            empresa cliente y a Techco a almacenarla y procesarla exclusivamente
            para fines de reclutamiento.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            3. Uso del Servicio
          </h2>
          <p>Usted se compromete a:</p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>
              Utilizar la plataforma conforme a la ley y a estos Términos.
            </li>
            <li>Proporcionar información veraz y actualizada.</li>
            <li>
              No realizar ingeniería inversa, vulnerar, manipular o dañar el
              sistema de Techco.
            </li>
          </ul>
          <p className="mt-2">
            Las empresas son responsables del uso que sus usuarios internos
            hagan de la plataforma. Los candidatos son responsables de la
            veracidad de la información que suministran.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            4. Privacidad y Protección de Datos
          </h2>
          <p>
            Techco recopila y trata datos personales conforme a su Política de
            Privacidad. La información proporcionada por los candidatos será
            utilizada exclusivamente para fines relacionados con procesos de
            selección, y podrá ser compartida con una o más empresas que
            utilicen la plataforma y se encuentren activamente en búsqueda de
            talento, siempre bajo estrictos estándares de confidencialidad y
            conforme a la normativa vigente.
          </p>
          <p className="mt-2">
            Techco no comercializa ni utiliza esta información para fines
            distintos a los aquí descritos. Nos comprometemos a proteger los
            datos personales en conformidad con las leyes locales de protección
            de datos aplicables en Perú, Colombia, México, Chile y Ecuador.
          </p>
          <p className="mt-2">
            Si tienes dudas o deseas ejercer tus derechos como titular de datos,
            puedes comunicarte con nosotros a través del correo electrónico
            info@talentconnect.tech.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">5. Pagos</h2>
          <p>
            Actualmente, el servicio no implica pagos por parte de candidatos.
            Las empresas podrán acceder a planes de pago por suscripción
            gestionados a través de Stripe. Techco no almacena información de
            tarjetas de crédito ni información financiera sensible.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            6. Contenido del Usuario
          </h2>
          <p>
            Empresas y candidatos pueden generar contenido en la plataforma
            (vacantes, respuestas, pruebas, evaluaciones, etc.). Usted garantiza
            que dicho contenido no infringe derechos de terceros. Techco se
            reserva el derecho a suspender contenido que considere inapropiado o
            ilícito.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            7. Limitación de Responsabilidad
          </h2>
          <p>
            Techco no se hace responsable por interrupciones del servicio,
            pérdidas de datos no imputables a su actuación, ni por decisiones de
            contratación tomadas por las empresas a partir de la información
            procesada en la plataforma.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            8. Jurisdicción y Legislación Aplicable
          </h2>
          <p>
            Estos Términos se rigen por la legislación de la República del Perú.
            Cualquier disputa será resuelta ante los tribunales competentes de
            Lima, Perú, renunciando las partes a cualquier otro fuero que
            pudiera corresponderles.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">9. Contacto</h2>
          <p>Para preguntas o reclamos, puedes escribirnos a:</p>
          <p className="mt-1">Correo: info@talentconnect.tech</p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            10. Disponibilidad Global
          </h2>
          <p>
            Si bien Techco está diseñada principalmente para empresas de Perú,
            Colombia, Ecuador, Chile y México, cualquier usuario del mundo puede
            utilizar la plataforma conforme a estos Términos y Condiciones.
          </p>
        </div>

        <div>
          <h2 className="mb-2 mt-8 text-xl font-semibold">
            11. Modificaciones a los Términos y Condiciones
          </h2>
          <p>
            Nos reservamos el derecho de actualizar o modificar estos Términos y
            Condiciones en cualquier momento, ya sea por cambios normativos,
            mejoras en nuestros servicios o la incorporación de nuevas
            funcionalidades a la plataforma. Cualquier cambio relevante será
            notificado a través de nuestros canales oficiales, incluyendo la
            plataforma y/o correo electrónico.
          </p>
          <p className="mt-2">
            El uso continuo de la plataforma después de cualquier modificación
            constituye una aceptación expresa de los nuevos términos.
          </p>
        </div>
      </section>
    </main>
  );
}
