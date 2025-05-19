"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Dictionary } from "@/types/i18n";
import { FC } from "react";
import { Locale } from "@/i18n-config";

type BackButtonPropps = {
  dictionary: Dictionary;
};

export const BackButton: FC<Readonly<BackButtonPropps>> = ({ dictionary }) => {
  const router = useRouter();
  const params = useParams<{ lang: Locale; id: string }>();
  const { lang, id } = params;
  return (
    <Button
      variant="link"
      className="flex w-fit items-center hover:underline"
      onClick={() => {
        if (id) {
          router.push(`/${lang}/dashboard/positions?business_id=${id}`);
        } else {
          router.back();
        }
      }}
    >
      <ChevronLeft />
      {dictionary.companiesPage.goBack}
    </Button>
  );
};
