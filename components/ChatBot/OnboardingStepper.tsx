"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PositionConfigurationPhaseTypes } from "@/types";

export const MODE_SELECTION_ONBOARDING_HIDE_KEY =
  "mode-selection-onboarding-hide";

export function OnboardingStepper({
  onFinish,
  slides,
  type,
  images = [],
}: {
  onFinish: () => void;
  slides: { title: string; text: string }[];
  type?: PositionConfigurationPhaseTypes;
  images?: string[];
}) {
  const [current, setCurrent] = useState(0);
  const isFirst = current === 0;
  const isLast = current === slides.length - 1;

  // Handlers for navigation
  const handleNext = () => {
    if (!isLast) setCurrent((c) => c + 1);
  };
  const handleBack = () => {
    if (!isFirst) setCurrent((c) => c - 1);
  };
  const handleFinish = () => {
    localStorage.setItem(
      `${MODE_SELECTION_ONBOARDING_HIDE_KEY}-${type}`,
      "true",
    );

    onFinish();
  };

  return (
    <div className="mx-auto flex h-fit w-[579px] flex-col items-center gap-[18px] border-b-[5px] border-b-talent-orange-500 bg-white shadow-lg">
      <div className="flex w-full flex-col gap-4">
        <Image
          src={images[current] || "/assets/onboarding_1.png"}
          className="h-[327px] w-[579px] object-cover"
          alt="Decorative vector"
          width={577}
          height={327}
          priority
        />
      </div>
      {/* Slide content */}
      <div className="flex h-full w-full max-w-[451px] flex-col items-center justify-evenly gap-2 px-6">
        {/* Slide indicators for accessibility and context */}
        {slides.length > 1 && (
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
        )}
        <h2 className="text-center text-base font-semibold text-black">
          {slides[current].title}
        </h2>
        <span
          dangerouslySetInnerHTML={{ __html: slides[current].text }}
          className="text-center text-sm text-gray-500"
        />
        {/* Navigation buttons */}
        <div className="flex w-full flex-row justify-center gap-4 pb-6">
          {!isFirst && (
            <Button
              variant="outline"
              className="h-8 min-w-[100px] border-green-700 text-green-700 hover:bg-green-50"
              onClick={handleBack}
              disabled={isFirst}
              aria-label="Atrás"
            >
              Atrás
            </Button>
          )}
          {!isLast ? (
            <Button
              variant="default"
              className="h-8 min-w-[100px] bg-talent-green-500 text-white hover:bg-green-800"
              onClick={handleNext}
              aria-label="Siguiente"
            >
              {isFirst ? "Empezar ahora" : "Siguiente"}
            </Button>
          ) : (
            <Button
              variant="default"
              className="h-8 min-w-[100px] bg-talent-green-500 text-white hover:bg-green-800"
              onClick={handleFinish}
              aria-label="Finalizar"
            >
              Finalizar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingStepper;
