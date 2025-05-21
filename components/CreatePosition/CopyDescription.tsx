"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { PositionSheet } from "./PositionSheet";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { DraftPositionData, PositionConfigurationPhaseTypes } from "@/types";
import { useUsers } from "@/hooks/use-users";
import { useBusinesses } from "@/hooks/use-businesses";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { cn, formatDate } from "@/lib/utils";
import { TableCell } from "../ui/table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useCompletePhase } from "@/hooks/use-complete-phase";

type CopyDescriptionProps = {
  dictionary: Dictionary;
};

export const CopyDescription: FC<Readonly<CopyDescriptionProps>> = ({
  dictionary,
}) => {
  const params = useParams<{
    lang: Locale;
    id: string;
    position_id: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lang, position_id, id } = params;
  const { createPositionPage: i18n } = dictionary;
  const { data: positionConfiguration } = usePositionConfigurations({
    all: true,
    businessId: id,
  });

  const { mutate: completePhase, isPending: isCompletePhasePending } =
    useCompletePhase({
      onSuccess: (data) => {
        console.info("Complete Phase success", data);
        queryClient.invalidateQueries({
          queryKey: QUERIES.POSITION_CONFIG_LIST,
        });
        router.push(
          `/${lang}/dashboard/companies/${id}/position-configuration/${position_id}`,
        );
      },
      onError: (error) => {
        console.error("Complete Phase error", error);
      },
    });
  const { rootBusiness } = useBusinesses();

  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });
  console.log(
    "%c[Debug] positionConfiguration",
    "background-color: teal; font-size: 20px; color: white",
    positionConfiguration,
  );
  const completedDescriptions = useMemo(() => {
    return positionConfiguration?.body?.data?.filter(
      (position) =>
        position.current_phase &&
        position.current_phase !== PositionConfigurationPhaseTypes.DESCRIPTION,
    );
  }, [positionConfiguration]);

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
          {i18n.copyDescriptionPageTitle}
        </Heading>
        <Text className="max-w-[49rem] text-sm text-muted-foreground" type="p">
          {i18n.copyDescriptionPageDescription}
        </Text>
        <div className="mt-8 h-[1px] w-full bg-gray-200"></div>
      </div>
      <div className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-black">
                Nombre de la vacante
              </TableHead>
              <TableHead className="font-bold text-black">
                Fecha de creación
              </TableHead>
              <TableHead className="font-bold text-black">
                Ultima actualización
              </TableHead>
              <TableHead className="font-bold text-black">
                Responsable
              </TableHead>
              <TableHead className="font-bold text-black"></TableHead>
              <TableHead className="font-bold text-black"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedDescriptions?.map((position) => (
              <TableRow key={position._id} className={cn("cursor-pointer")}>
                <TableCell
                  title={(position?.phases[0]?.data as DraftPositionData)?.role}
                  className="max-w-[100px] truncate"
                >
                  {(position?.phases[0]?.data as DraftPositionData)?.role}
                </TableCell>
                <TableCell>
                  {formatDate(new Date(position.created_at).toString())}
                </TableCell>
                <TableCell>
                  {formatDate(new Date(position.updated_at).toString())}
                </TableCell>
                <TableCell>
                  {
                    users.find((user) => user._id === position.user_id)
                      ?.full_name
                  }
                </TableCell>
                <TableCell className="flex items-center justify-between gap-4">
                  <PositionSheet
                    customTrigger={
                      <Button variant="link" className="underline">
                        Pre visualizar
                      </Button>
                    }
                    positionData={position.phases[0]?.data as DraftPositionData}
                    business={rootBusiness ? rootBusiness : undefined}
                    dictionary={dictionary}
                  />
                  <Button
                    onClick={() => {
                      completePhase({
                        position_configuration_id: position_id,
                        data: position.phases[0]?.data,
                      });
                    }}
                    variant="link"
                    className="underline"
                  >
                    Crear una copia
                    {isCompletePhasePending && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
