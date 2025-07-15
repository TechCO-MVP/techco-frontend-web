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
import {
  Assessment,
  DraftPositionData,
  PositionConfigurationPhaseTypes,
  PositionConfigurationTypes,
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
import { SoftSkillsSheet } from "./SoftSkillsSheet";
import { Input } from "../ui/input";
import { useNextPhase } from "@/hooks/use-next-phase";
import React from "react";
import { usePositionsByBusiness } from "@/hooks/use-position-by-business";

type CopySoftSkillsProps = {
  dictionary: Dictionary;
};

export const CopySoftSkills: FC<Readonly<CopySoftSkillsProps>> = ({
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: positionConfiguration } = usePositionsByBusiness({
    id,
  });

  const { mutate: nextPhase, isPending: isNextPhasePending } = useNextPhase({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
      router.push(
        `/${lang}/dashboard/companies/${id}/position-configuration/${position_id}/soft-skills/preview`,
      );
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });

  const { mutate: saveDraft, isPending } = useUpdatePositionConfiguration({
    onSuccess: (data) => {
      console.info("Save Draft success", data);
      nextPhase({
        position_configuration_id: position_id,
        configuration_type:
          PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE,
      });
      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
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

  const completedSoftSkills = useMemo(() => {
    return positionConfiguration?.body?.data?.filter((position) =>
      position.phases?.some(
        (phase) =>
          phase.type === PositionConfigurationPhaseTypes.SOFT_SKILLS &&
          phase.status === "COMPLETED",
      ),
    );
  }, [positionConfiguration]);
  console.log(
    "%c[Debug] completedSoftSkills",
    "background-color: teal; font-size: 20px; color: white",
    completedSoftSkills,
  );
  const filteredSoftSkills = useMemo(() => {
    if (!searchQuery.trim()) return completedSoftSkills;
    return completedSoftSkills?.filter((position) => {
      const role = (position?.phases[0]?.data as DraftPositionData)?.role || "";
      return role.toLowerCase().includes(searchQuery.trim().toLowerCase());
    });
  }, [completedSoftSkills, searchQuery]);

  const paginatedSoftSkills = useMemo(() => {
    if (!filteredSoftSkills) return [];
    const start = (page - 1) * pageSize;
    return filteredSoftSkills.slice(start, start + pageSize);
  }, [filteredSoftSkills, page, pageSize]);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, filteredSoftSkills?.length]);

  console.log(
    "%c[Debug] completedSoftSkills",
    "background-color: teal; font-size: 20px; color: white",
    completedSoftSkills,
  );
  return (
    <div className="flex w-full flex-col px-8 py-2">
      <div className="relative flex flex-col gap-2">
        <Link
          href={`/${lang}/dashboard/companies/${id}/position-configuration/${position_id}`}
          replace
        >
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.goBack}
          </Button>
        </Link>
        <Heading className="text-2xl" level={1}>
          {i18n.copySoftSkillsPageTitle}
        </Heading>
        <Text className="max-w-[49rem] text-sm text-muted-foreground" type="p">
          {i18n.copySoftSkillsPageDescription}
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
            {paginatedSoftSkills?.map((position) => (
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
                  <SoftSkillsSheet
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
                          PositionConfigurationPhaseTypes.SOFT_SKILLS,
                      )?.data as Assessment
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
                            PositionConfigurationPhaseTypes.SOFT_SKILLS
                              ? {
                                  ...phase,
                                  status: "IN_PROGRESS",
                                  data:
                                    (position.phases.find(
                                      (pos) =>
                                        pos.type ===
                                        PositionConfigurationPhaseTypes.SOFT_SKILLS,
                                    )?.data as Assessment) || [],
                                }
                              : phase,
                          ) ?? [],
                      });
                    }}
                    variant="link"
                    className="flex items-center justify-center gap-2 underline"
                  >
                    {(isPending || isNextPhasePending) &&
                    selectedPosition === position._id ? (
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
        <div className="mt-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm font-medium">
              Por página
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded border px-2 py-1"
              aria-label="Tamaño de página"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Anterior"
            >
              Anterior
            </Button>
            <span>
              Página {page} de{" "}
              {Math.ceil((filteredSoftSkills?.length ?? 0) / pageSize)}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setPage((p) =>
                  Math.min(
                    Math.ceil((filteredSoftSkills?.length ?? 0) / pageSize),
                    p + 1,
                  ),
                )
              }
              disabled={
                page === Math.ceil((filteredSoftSkills?.length ?? 0) / pageSize)
              }
              aria-label="Siguiente"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
