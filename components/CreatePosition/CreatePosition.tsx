"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { useCreatePositionConfiguration } from "@/hooks/use-create-position-configuration";
import { PositionConfigurationFlowTypes } from "@/types";
import TemplateSelectionTable from "../TemplateSelectionTable/TemplateSelectionTable";
import AnimatedModal from "../ChatBot/AnimatedModal";
import { CREATE_POSITION_ONBOARDING_HIDE_KEY } from "../ChatBot/OnboardingMessage";
import { useBusinesses } from "@/hooks/use-businesses";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";
import { QUERIES } from "@/constants/queries";
import { useQueryClient } from "@tanstack/react-query";

type CreatePositionProps = {
  dictionary: Dictionary;
};

export const CreatePosition: FC<Readonly<CreatePositionProps>> = ({
  dictionary,
}) => {
  const showOnboarding = !localStorage.getItem(
    CREATE_POSITION_ONBOARDING_HIDE_KEY,
  );
  const { rootBusiness } = useBusinesses();
  const queryClient = useQueryClient();

  const { currentUser } = useCurrentUser();

  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });

  const localUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email);
  }, [users, currentUser]);

  const router = useRouter();
  const params = useParams<{ lang: Locale; id: string }>();
  const { lang, id: businessId } = params;
  const { createPositionPage: i18n } = dictionary;

  const { mutate, isPending } = useCreatePositionConfiguration({
    onSuccess(data) {
      const { body } = data;
      const { data: positionData } = body;
      queryClient.invalidateQueries({
        queryKey: [QUERIES.POSITION_CONFIG_LIST(businessId, undefined)],
      });
      router.push(
        `/${lang}/dashboard/companies/${businessId}/position-configuration/${positionData._id}`,
      );
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });

  const handleTemplateSelection = (
    flowType: PositionConfigurationFlowTypes,
  ) => {
    mutate({
      flow_type: flowType,
      business_id: businessId,
    });
  };

  return (
    <div className="flex w-full flex-col px-8 py-2">
      <div className="relative flex flex-col gap-2">
        <Link href={`/${lang}/dashboard/positions`} replace>
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.goBack}
          </Button>
        </Link>
        <Heading className="text-2xl" level={1}>
          {i18n.selectTemplateTitle}
        </Heading>
        <Text className="max-w-[49rem] text-sm text-muted-foreground" type="p">
          {i18n.selectTemplateDescription}
        </Text>
        <div className="mt-8 h-[1px] w-full bg-gray-200"></div>
      </div>
      <TemplateSelectionTable
        isPending={isPending}
        onTemplateSelect={handleTemplateSelection}
        dictionary={dictionary}
      />
      <AnimatedModal
        dictionary={dictionary}
        defaultOpen={showOnboarding}
        mode="message"
        localUser={localUser}
      />
    </div>
  );
};
