"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Dictionary } from "@/types/i18n";
import { FC } from "react";

type BackButtonPropps = {
  dictionary: Dictionary;
};

export const BackButton: FC<Readonly<BackButtonPropps>> = ({ dictionary }) => {
  const router = useRouter();
  return (
    <Button
      variant="link"
      className="flex w-fit items-center hover:underline"
      onClick={() => router.back()}
    >
      <ChevronLeft />
      {dictionary.companiesPage.goBack}
    </Button>
  );
};
