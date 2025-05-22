"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MODE_SELECTION_ONBOARDING_HIDE_KEY,
  OnboardingStepper,
} from "./OnboardingStepper";
import { Button } from "@/components/ui/button";
import { OnboardingMessage } from "./OnboardingMessage";
import { PositionConfigurationPhaseTypes, User } from "@/types";
import { Dictionary } from "@/types/i18n";

const onboardingContentByPhase: Record<
  PositionConfigurationPhaseTypes | "first_time_onboarding",
  { slides: { title: string; text: string }[]; images: string[] }
> = {
  [PositionConfigurationPhaseTypes.DESCRIPTION]: {
    slides: [
      {
        title: "Crea una vacante clara, atractiva y alineada con tu empresa",
        text: "<p style='text-align: justify;'>Vamos a ayudarte a construir una vacante que realmente conecte con las personas.</p> <p style='text-align: justify;'> No necesitas escribir desde cero: nuestra inteligencia artificial Tici está aquí para acompañarte en todo momento.</p><br/> <p style='text-align: justify;'>Solo conversa con ella como lo harías con un amigo o compañero. Cuanto más nos cuentes, mejor será el resultado.</p>",
      },
      {
        title: "Cuéntanos sobre la vacante",
        text: "<p style='text-align: justify;'>Nuestro asistente de IA necesita entender qué estás buscando. Habla de forma natural: qué hace esta persona, qué necesitas del rol, cómo se trabaja en tu equipo. </p> <br/> <p style='text-align: justify;'> La IA irá haciendo preguntas para ayudarte a pensar en todos los detalles. </p>",
      },
      {
        title: "Reflejamos tu cultura",
        text: "<p style='text-align: justify;'>La IA Tici adaptará la vacante al tono y estilo de tu empresa. Si ya llenaste el “la descripción de la empresa” o has trabajado antes en esta plataforma, ¡tomaremos eso como base!</p> <br /> <p style='text-align: justify;'> Podrás revisar y ajustar el texto en cualquier momento. Aquí mandas tú.</p>",
      },
      {
        title: "Tu vacante, lista en minutos",
        text: "<p>Cuando termines, tendrás una descripción completa, clara y pensada para atraer al perfil correcto. </p> <p>Y si algo no te convence, puedes editarlo fácilmente.</p>",
      },
    ],
    images: [
      "/assets/description_onboarding_1.png",
      "/assets/description_onboarding_2.png",
      "/assets/description_onboarding_3.png",
      "/assets/description_onboarding_4.png",
    ],
  },
  [PositionConfigurationPhaseTypes.READY_TO_PUBLISH]: {
    slides: [
      {
        title: "Listo para publicar",
        text: "Revisa toda la información antes de publicar la vacante.",
      },
      {
        title: "Publicación",
        text: "Haz clic en publicar para que la vacante sea visible a los candidatos.",
      },
    ],
    images: ["/assets/publish_1.png", "/assets/publish_2.png"],
  },
  [PositionConfigurationPhaseTypes.FINAL_INTERVIEW]: {
    slides: [
      {
        title: "Entrevista final",
        text: "Prepárate para la última etapa del proceso de selección.",
      },
      {
        title: "Consejos para la entrevista",
        text: "Evalúa habilidades técnicas y blandas en esta fase.",
      },
    ],
    images: ["/assets/interview_1.png", "/assets/interview_2.png"],
  },
  [PositionConfigurationPhaseTypes.TECHNICAL_TEST]: {
    slides: [
      {
        title: "¿Cómo quieres construir tu prueba técnica?",
        text: "Puedes elegir entre dos caminos. Ambos te ayudarán a evaluar mejor a tus candidatos, pero tú eliges cuál se ajusta más a tu vacante..",
      },
      {
        title: "Opción 1: Crea tu prueba con ayuda de IA Tici",
        text: `<p>Con nuestra inteligencia artificial, crear una prueba técnica es tan fácil como hacer clic.</p> <p>Ya tenemos todo lo que necesitamos: la información del cargo, la cultura de tu empresa y el contenido del test de habilidades blandas.</p> <br/> <p> Nosotros conectamos los puntos por ti.</p> <ul style='list-style-type: disc; display:flex; justify-content:center; flex-direction: column; align-items: flex-start;'> <li>Te armamos una prueba lista para usar, adaptada al perfil.</li> <li>Ajustada al estilo de tu empresa.</li> <li>Diseñada en minutos, sin que tengas que escribir nada.</li> </ul> <br> <p>Ideal para cargos junior, semi-senior o de alta rotación.</p>`,
      },
      {
        title: "Opción 2: Sube tu propia prueba técnica",
        text: "<p>¿Ya tienes una prueba técnica armada? Puedes usarla.</p> <p>Solo asegúrate de incluir estos elementos clave:</p> <br/> <ul style='list-style-type: disc; display:flex; justify-content:center; flex-direction: column; align-items: flex-start;'> <li>Objetivo: qué quieres evaluar.</li> <li>Instrucciones claras para el candidato.</li> <li>Reto técnico: la tarea o desafío.</li> <li>Misión: qué debe lograr o resolver.</li> <li>Criterios de evaluación: cómo vas a calificar.</li> </ul> <br> <p>Esta opción es perfecta para cargos muy técnicos, estratégicos o de alto nivel, donde necesitas personalizar todo al detalle.</p>",
      },
      {
        title: " ¿Listo para empezar?",
        text: "<p>Selecciona la opción que más te funcione.</p> <p>Estamos aquí para ayudarte a construir una prueba técnica clara, justa y alineada con lo que tu equipo realmente necesita.</p>",
      },
    ],
    images: [
      "/assets/tech_skills_onboarding_1.png",
      "/assets/tech_skills_onboarding_2.png",
      "/assets/tech_skills_onboarding_3.png",
      "/assets/tech_skills_onboarding_4.png",
    ],
  },
  [PositionConfigurationPhaseTypes.SOFT_SKILLS]: {
    slides: [
      {
        title: "Crea un test alineado con tu cultura",
        text: "Nuestra asiste de IA te ayuda a diseñar un test de habilidades blandas en minutos, 100 % adaptado a tu vacante y forma de trabajar.",
      },
      {
        title: "Todo comienza con una conversación",
        text: "Desde la vacante, abre el chat con nuestra IA. Te guiará paso a paso, como si tuvieras un experto en selección a tu lado.",
      },
      {
        title: "Define los comportamientos clave",
        text: "Escribe lo que quieres evaluar (como liderazgo o adaptabilidad), o deja que la IA te sugiera según el perfil del cargo.",
      },
      {
        title: "Ajústalo a tu estilo",
        text: "Cada comportamiento tiene una definición editable. Asegúrate de que refleje cómo se vive en tu empresa.",
      },
      {
        title: "Test generado al instante",
        text: "Una vez definidos los comportamientos, la IA crea un test listo para compartir. No necesitas hacer nada más.",
      },
    ],
    images: [
      "/assets/soft_skills_onboarding_1.png",
      "/assets/onboarding.svg",
      "/assets/onboarding.svg",
      "/assets/onboarding.svg",
      "/assets/onboarding.svg",
    ],
  },
  first_time_onboarding: {
    slides: [
      {
        title: " ¡Bienvenido a bordo!",
        text: "<p style='text-align: justify;'> Gracias por unirte. <strong>Aquí vas a encontrar todo lo que necesitas para crear procesos de selección más fáciles, rápidos y ajustados a lo que tu empresa realmente necesita.</strong> Y lo mejor: no estarás solo, te vamos a acompañar paso a paso.</p>",
      },
      {
        title: "Tu nuevo aliado: la inteligencia artificial Tici",
        text: "<p style='text-align: justify;'>Vamos a ayudarte a crear:</p> <ul style='list-style-type: disc; display:flex; justify-content:center; flex-direction: column; align-items: flex-start;'> <li>Descripciones de vacantes atractivas.</li> <li>Pruebas técnicas alineadas al rol.</li> <li>Evaluaciones de fit cultural personalizadas.</li> </ul>. <p style='text-align: justify;'> Todo adaptado al estilo y las necesidades de tu empresa. <strong> Tú nos cuentas, la IA te ayuda a construir.</strong> </p>",
      },
      {
        title: "Todo el proceso, en un solo lugar",
        text: "<p style='text-align: justify;'>Tendrás un tablero visual donde podrás ver en qué etapa está cada candidato.</p> <p style='text-align: justify;'> Muchas tareas estarán automatizadas, así que podrás gestionar sin complicarte.</p>",
      },
      {
        title: "¿Manejas varias empresas o ciudades?",
        text: "<p style='text-align: justify;'>Desde aquí puedes crear diferentes empresas o sedes según tu operación.</p> <p style='text-align: justify;'>Esto te dará más control y orden para organizar todos tus procesos de selección</p>",
      },
      {
        title: "Mantente al tanto de todo",
        text: "<p style='text-align: justify;'>Tendrás un centro de notificaciones donde podrás ver todo lo que pasa:</p> <ul style='list-style-type: disc; display:flex; justify-content:center; flex-direction: column; align-items: flex-start;'> <li>Cambios en procesos</li> <li>Acciones que requieren tu respuesta</li> <li>Menciones de otros miembros de tu equipo.</li> </ul>",
      },
    ],
    images: [
      "/assets/first_onboarding_1.png",
      "/assets/first_onboarding_2.png",
      "/assets/first_onboarding_3.png",
      "/assets/first_onboarding_4.png",
      "/assets/first_onboarding_5.png",
    ],
  },
};

export default function AnimatedModal({
  defaultOpen,
  mode,
  localUser,
  dictionary,
  type,
}: {
  defaultOpen: boolean;
  mode: "stepper" | "message";
  localUser?: User;
  dictionary: Dictionary;
  type?: PositionConfigurationPhaseTypes | "first_time_onboarding";
}) {
  const { createPositionPage: i18n } = dictionary;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [buttonPosition, setButtonPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Update button position on mount and resize
  useEffect(() => {
    const updateButtonPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateButtonPosition();
    window.addEventListener("resize", updateButtonPosition);

    return () => window.removeEventListener("resize", updateButtonPosition);
  }, []);

  // Handle modal open
  const openModal = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
    setIsAnimating(true);
    setIsOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setIsAnimating(true);
    setIsOpen(false);
    setAnimateButton(true);
  };

  // Handle animation end
  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  useEffect(() => {
    if (animateButton && buttonRef.current) {
      buttonRef.current.classList.add("animate-custom-pulse");
      const timeout = setTimeout(() => {
        buttonRef.current?.classList.remove("animate-custom-pulse");
        setAnimateButton(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [animateButton]);

  useEffect(() => {
    if (type) {
      const hideKey = `${MODE_SELECTION_ONBOARDING_HIDE_KEY}-${type}`;
      const wasHidden = localStorage.getItem(hideKey);
      if (!wasHidden) {
        setIsOpen(true);
      }
    }
  }, [type]);
  return (
    <>
      {mode === "stepper" && (
        <Button
          ref={buttonRef}
          onClick={openModal}
          className="bg-[#FCFCFC] text-[#007AFF] hover:bg-[#FCFCFC]"
          disabled={isAnimating}
        >
          {type === "first_time_onboarding"
            ? i18n.startOnboarding
            : i18n.seeHowItWorks}
        </Button>
      )}

      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5, transition: { duration: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              ref={modalRef}
              className="fixed z-50"
              style={{
                top: "50%",
                left: "50%",
                translateX: "-50%",
                translateY: "-50%",
                transformOrigin: "center center",
              }}
              initial={{
                opacity: 0,
                scale: 0.01,
                x:
                  buttonPosition.x +
                  buttonPosition.width / 2 -
                  window.innerWidth / 2,
                y:
                  buttonPosition.y +
                  buttonPosition.height / 2 -
                  window.innerHeight / 2,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 200, // Lower stiffness for slower animation
                  damping: 25,
                  mass: 1.2, // Higher mass makes it move slower
                  duration: 0.7, // Explicitly set longer duration
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.01,
                x:
                  buttonPosition.x +
                  buttonPosition.width / 2 -
                  window.innerWidth / 2,
                y:
                  buttonPosition.y +
                  buttonPosition.height / 2 -
                  window.innerHeight / 2,
                transition: {
                  type: "spring",
                  stiffness: 200, // Lower stiffness for slower animation
                  damping: 25,
                  mass: 1.2, // Higher mass makes it move slower
                  duration: 0.7, // Explicitly set longer duration
                },
              }}
              onAnimationComplete={handleAnimationComplete}
            >
              {mode === "message" ? (
                <OnboardingMessage
                  localUser={localUser}
                  onFinish={closeModal}
                  dictionary={dictionary}
                />
              ) : (
                <OnboardingStepper
                  type={type}
                  slides={
                    type && onboardingContentByPhase[type]
                      ? onboardingContentByPhase[type].slides
                      : []
                  }
                  images={
                    type && onboardingContentByPhase[type]
                      ? onboardingContentByPhase[type].images
                      : []
                  }
                  onFinish={closeModal}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
