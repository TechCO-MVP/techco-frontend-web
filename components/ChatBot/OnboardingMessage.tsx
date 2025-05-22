"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { Dictionary } from "@/types/i18n";

export const CREATE_POSITION_ONBOARDING_HIDE_KEY =
  "create-position-onboarding-hide";

export function OnboardingMessage({
  onFinish,
  localUser,
  dictionary,
}: {
  onFinish: () => void;
  localUser?: User;
  dictionary: Dictionary;
}) {
  const handleFinish = () => {
    localStorage.setItem(CREATE_POSITION_ONBOARDING_HIDE_KEY, "true");

    onFinish();
  };
  const { onboardingMessage: i18n } = dictionary;
  // Get first name safely
  const firstName = localUser?.full_name?.split(" ")[0] || "";

  return (
    <div className="mx-auto flex h-[675px] w-[579px] flex-col items-center gap-[18px] border-b-[5px] border-b-talent-orange-500 bg-white shadow-lg">
      <div className="flex w-full flex-col gap-4">
        <Image
          src="/assets/onboarding_1.png"
          className="h-[327px] w-[579px] object-cover"
          alt="Decorative vector"
          width={577}
          height={327}
          priority
        />
      </div>
      {/* Slide content */}
      <div className="flex w-full flex-col gap-2 px-16">
        <h2 className="text-sm font-semibold text-black">
          {i18n.greeting.replace("{name}", firstName)}
        </h2>
        <p className="text-sm">
          <b>{i18n.intro}</b>
          <br />
          <span dangerouslySetInnerHTML={{ __html: i18n.helpText }} />
          <br />
        </p>
        <p className="text-sm">{i18n.helpListIntro}</p>
        <ul className="text-sm">
          {i18n.helpList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
        <p className="text-sm">
          <span dangerouslySetInnerHTML={{ __html: i18n.noExpert }} />
        </p>
      </div>
      {/* Navigation buttons */}
      <div className="flex w-full flex-row justify-center gap-4 pb-6">
        <Button
          variant="default"
          className="h-8 min-w-[100px] bg-talent-green-500 text-white hover:bg-green-800"
          onClick={handleFinish}
          aria-label={i18n.startNow}
        >
          {i18n.startNow}
        </Button>
      </div>
    </div>
  );
}
