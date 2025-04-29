"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import { BrainCog, ChevronLeft, Copy, Pencil } from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { OptionCard } from "../OptionCard/OptionCard";
import { useCreatePositionConfiguration } from "@/hooks/use-create-position-configuration";
import { PositionConfigurationTypes } from "@/types";

type CreatePositionProps = {
  dictionary: Dictionary;
};

export const CreatePosition: FC<Readonly<CreatePositionProps>> = ({
  dictionary,
}) => {
  const router = useRouter();
  const params = useParams<{ lang: Locale; id: string }>();
  const { lang, id: businessId } = params;
  const { createPositionPage: i18n } = dictionary;
  const [selectedOption, setSelectedOption] = useState<
    "AI" | "MANUALLY" | "COPY" | null
  >(null);
  const { mutate, isPending } = useCreatePositionConfiguration({
    onSuccess(data) {
      const { body } = data;
      const { data: positionData } = body;
      router.push(
        `/${lang}/dashboard/companies/${businessId}/positions/${[positionData._id]}`,
      );
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });

  const onCreatePosition = async (type: PositionConfigurationTypes) => {
    mutate({
      type,
      business_id: businessId,
    });
  };

  return (
    <div className="flex w-full flex-col px-8 py-6">
      <div className="relative flex flex-col gap-2">
        <Link href={`/${lang}/dashboard/positions`} replace>
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.goBack}
          </Button>
        </Link>
        <Heading className="text-2xl" level={1}>
          {i18n.pageTitle}
        </Heading>
        <Text className="max-w-[49rem] text-sm text-muted-foreground" type="p">
          {i18n.pageDescription}
        </Text>
        <div className="mt-8 h-[1px] w-full bg-gray-200"></div>
      </div>

      <div className="mt-14 flex justify-center gap-8">
        <OptionCard
          loading={isPending && selectedOption === "AI"}
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.createWithAi}
          description={i18n.createWithAiDescription}
          details={i18n.createWithAiDetails}
          onClick={() => {
            setSelectedOption("AI");
            onCreatePosition(PositionConfigurationTypes.AI_TEMPLATE);
          }}
          icon={<BrainCog className="h-10 w-10" />}
        />

        <OptionCard
          loading={isPending && selectedOption === "MANUALLY"}
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.createManually}
          description={i18n.createManuallyDescription}
          details={i18n.createManuallyDetails}
          onClick={() => {
            setSelectedOption("MANUALLY");
            onCreatePosition(PositionConfigurationTypes.CUSTOM);
          }}
          icon={<Pencil className="h-10 w-10" />}
        />

        <OptionCard
          loading={isPending && selectedOption === "COPY"}
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.copyPrevious}
          description={i18n.copyPreviousDescription}
          details={i18n.copyPreviousDetails}
          onClick={() => {
            setSelectedOption("COPY");
            onCreatePosition(
              PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE,
            );
          }}
          icon={<Copy className="h-10 w-10" />}
        />
      </div>
    </div>
  );
};
