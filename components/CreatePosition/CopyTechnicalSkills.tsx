"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";

import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import {
  DraftPositionData,
  PositionConfigurationPhaseTypes,
  TechnicalAssessment,
} from "@/types";
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
import { useUpdatePositionConfiguration } from "@/hooks/use-update-position-configuration";

import { TechnicalSkillsSheet } from "./TechnicalSkillsSheet";
import { Input } from "../ui/input";

type CopyTechnicalSkillsProps = {
  dictionary: Dictionary;
};

export const CopyTechnicalSkills: FC<Readonly<CopyTechnicalSkillsProps>> = ({
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
  const [selectedPosition, setSelectedPosition] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: positionConfiguration } = usePositionConfigurations({
    all: true,
    businessId: id,
  });

  const { mutate: saveDraft, isPending } = useUpdatePositionConfiguration({
    onSuccess: (data) => {
      console.info("Save Draft success", data);

      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
      router.push(
        `/${lang}/dashboard/companies/${id}/position-configuration/${position_id}/technical-test`,
      );
    },
    onError: (error) => {
      console.error("Save Draft error", error);
    },
  });
  const { rootBusiness } = useBusinesses();

  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });

  const currentPosition = useMemo(() => {
    return positionConfiguration?.body?.data?.find(
      (position) => position._id === position_id,
    );
  }, [positionConfiguration, position_id]);

  console.log(
    "%c[Debug] currentPosition",
    "background-color: teal; font-size: 20px; color: white",
    currentPosition,
  );

  const completedTechnicalSkills = useMemo(() => {
    return positionConfiguration?.body?.data?.filter((position) =>
      position.phases?.some(
        (phase) =>
          phase.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST &&
          phase.status === "COMPLETED",
      ),
    );
  }, [positionConfiguration]);

  const filteredTechnicalSkills = useMemo(() => {
    if (!searchQuery.trim()) return completedTechnicalSkills;
    return completedTechnicalSkills?.filter((position) => {
      const role = (position?.phases[0]?.data as DraftPositionData)?.role || "";
      return role.toLowerCase().includes(searchQuery.trim().toLowerCase());
    });
  }, [completedTechnicalSkills, searchQuery]);

  console.log(
    "%c[Debug] completedSoftSkills",
    "background-color: teal; font-size: 20px; color: white",
    completedTechnicalSkills,
  );
  return (
    <div className="flex w-full flex-col px-8 py-2">
      <div className="relative flex flex-col gap-2">
        <Link
          href={`/${lang}/dashboard/positions?tab=drafts&position_id=${position_id}&business_id=${id}`}
          replace
        >
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.goBack}
          </Button>
        </Link>
        <Heading className="text-2xl" level={1}>
          {i18n.copyTechnicalSkillsPageTitle}
        </Heading>
        <Text className="max-w-[49rem] text-sm text-muted-foreground" type="p">
          {i18n.copyTechnicalSkillsPageDescription}
        </Text>
        <div className="mt-8 h-[1px] w-full bg-gray-200"></div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="mb-4 flex items-center gap-2 pt-10">
          <Input
            type="text"
            placeholder="Buscar  vacante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-0"
            aria-label="Buscar por nombre de vacante"
          />
        </div>
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
            {filteredTechnicalSkills?.map((position) => (
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
                <TableCell>
                  <TechnicalSkillsSheet
                    role={
                      (currentPosition?.phases[0]?.data as DraftPositionData)
                        ?.role
                    }
                    customTrigger={
                      <Button variant="link" className="underline">
                        Pre visualizar
                      </Button>
                    }
                    dictionary={dictionary}
                    assessment={
                      position.phases.find(
                        (pos) =>
                          pos.type ===
                          PositionConfigurationPhaseTypes.TECHNICAL_TEST,
                      )?.data as TechnicalAssessment
                    }
                  />
                </TableCell>
                <TableCell className="flex items-center justify-center">
                  <Button
                    onClick={() => {
                      setSelectedPosition(position._id);
                      if (!currentPosition) return;
                      saveDraft({
                        ...currentPosition,
                        phases:
                          currentPosition?.phases.map((phase) =>
                            phase.type ===
                            PositionConfigurationPhaseTypes.TECHNICAL_TEST
                              ? {
                                  ...phase,
                                  status: "IN_PROGRESS",
                                  data:
                                    (position.phases.find(
                                      (pos) =>
                                        pos.type ===
                                        PositionConfigurationPhaseTypes.TECHNICAL_TEST,
                                    )?.data as TechnicalAssessment) || [],
                                }
                              : phase,
                          ) ?? [],
                      });
                    }}
                    variant="link"
                    className="flex items-center justify-center gap-2 underline"
                  >
                    {isPending && selectedPosition === position._id ? (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Crear una copia"
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
