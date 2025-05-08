"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Slide content for onboarding
const slides = [
  {
    title: "Todo comienza con una conversación",
    text: "Desde la vacante, abre el chat con nuestra IA. Te guiará paso a paso, como si tuvieras un experto en selección a tu lado.",
  },
  {
    title: "Define los comportamientos clave.",
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
];

const ONBOARDING_HIDE_KEY = "onboarding-hide";

export function ChatOnboarding({ onFinish }: { onFinish: () => void }) {
  const [current, setCurrent] = useState(0);
  const [hideOnboarding, setHideOnboarding] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const isFirst = current === 0;
  const isLast = current === slides.length - 1;

  // On mount, check localStorage for onboarding preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hide = localStorage.getItem(ONBOARDING_HIDE_KEY);
      if (hide === "true") setShouldShow(false);
    }
  }, []);

  // Handler for checkbox toggle
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHideOnboarding(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem(ONBOARDING_HIDE_KEY, "true");
    } else {
      localStorage.removeItem(ONBOARDING_HIDE_KEY);
    }
  };

  // Handlers for navigation
  const handleNext = () => {
    if (!isLast) setCurrent((c) => c + 1);
  };
  const handleBack = () => {
    if (!isFirst) setCurrent((c) => c - 1);
  };
  const handleFinish = () => {
    onFinish();
  };

  if (!shouldShow) return null;

  return (
    <div className="mx-auto flex w-[577px] flex-col items-center gap-6 border-b-[5px] border-b-talent-orange-500 bg-white shadow-lg">
      <div className="flex w-full flex-col gap-4">
        <Image
          src="/assets/onboarding.svg"
          alt="Decorative vector"
          width={577}
          height={327}
          priority
        />
      </div>
      {/* Slide content */}
      <div className="flex w-full flex-col items-center gap-2 px-6">
        {/* Slide indicators for accessibility and context */}
        <div
          className="flex flex-row gap-2"
          aria-label="Progreso de onboarding"
        >
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={
                idx === current
                  ? "h-2 w-2 rounded-full bg-talent-green-500 transition-all"
                  : "h-2 w-2 rounded-full bg-talent-green-300 transition-all"
              }
              aria-current={idx === current ? "step" : undefined}
            />
          ))}
        </div>
        <h2 className="text-center text-base font-semibold text-black">
          {slides[current].title}
        </h2>
        <span className="text-center text-sm text-gray-500">
          {slides[current].text}
        </span>
        {/* Checkbox only on last slide */}
        {isLast && (
          <label className="mt-4 flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={hideOnboarding}
              onChange={handleCheckbox}
              className="h-4 w-4 rounded border-gray-300 accent-talent-green-500 focus:ring-2 focus:ring-talent-green-500"
              aria-checked={hideOnboarding}
            />
            No volver a mostrar
          </label>
        )}
      </div>
      {/* Navigation buttons */}
      <div className="flex w-full flex-row justify-center gap-4 pb-6">
        <Button
          variant="outline"
          className="h-8 min-w-[100px] border-green-700 text-green-700 hover:bg-green-50"
          onClick={handleBack}
          disabled={isFirst}
          aria-label="Atrás"
        >
          Atrás
        </Button>
        {!isLast ? (
          <Button
            variant="default"
            className="h-8 min-w-[100px] bg-green-700 text-white hover:bg-green-800"
            onClick={handleNext}
            aria-label="Siguiente"
          >
            Siguiente
          </Button>
        ) : (
          <Button
            variant="default"
            className="h-8 min-w-[100px] bg-green-700 text-white hover:bg-green-800"
            onClick={handleFinish}
            aria-label="Finalizar"
          >
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
}

export default ChatOnboarding;
