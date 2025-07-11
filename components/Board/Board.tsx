"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { BoardColumn } from "../BoardColumn/BoardColumn";
import { type BoardState } from "@/types/pipefy";
import { Text } from "@/components/Typography/Text";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Share2,
  SlidersHorizontal,
  SmilePlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/Typography/Heading";
import Link from "next/link";
import { usePipefyPipe } from "@/hooks/use-pipefy-pipe";
import { useToast } from "@/hooks/use-toast";
import { useProfileFilterStatus } from "@/hooks/use-profile-filter-status";
import BoardSkeleton from "./Skeleton";
import { useParams, useSearchParams } from "next/navigation";
import {
  calculateTime,
  cn,
  countryLabelLookup,
  getPriority,
} from "@/lib/utils";
import { useOpenPositions } from "@/hooks/use-open-positions";
import { Notifications } from "@/components/Notifications/Notifications";
import { Dictionary } from "@/types/i18n";
import { useBusinesses } from "@/hooks/use-businesses";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";
import { Locale } from "@/i18n-config";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { useBoardFilters } from "@/hooks/use-board-filters";
import { useBoardActions } from "@/hooks/use-board-actions";
import { MATCH_OPTIONS, SOURCE_OPTIONS } from "@/constants";
import { MovePhaseDialog } from "./MovePhaseDialog";
import { MissingFieldsDialog } from "./MissingFieldsDialog";
import { usePositionById } from "@/hooks/use-position-by-id";
import { PositionSheet } from "../CreatePosition/PositionSheet";
import { DraftPositionData, HiringPositionData } from "@/types";
type BoardProps = {
  dictionary: Dictionary;
};
export const Board: React.FC<BoardProps> = ({ dictionary }) => {
  const quickFilters = [
    "ADN del Talento",
    "Retos y Comportamientos",
    "Primer entrevista",
    "Caso de Negocio",
    "Entrevista final",
    "Talento sin sesgos",
    "Descartados",
  ];
  const searchParams = useSearchParams();
  const businessParam = searchParams.get("business_id");

  const { positionDetailsPage: i18n } = dictionary;
  const params = useParams<{ id: string; lang: Locale }>();
  const { id, lang } = params;
  const {
    data: filterStatus,
    isLoading: loadingProfiles,
    isPending: pendingProfiles,
  } = useProfileFilterStatus({
    positionId: id,
  });
  const { rootBusiness, businesses } = useBusinesses();
  const { currentUser } = useCurrentUser();
  const currentBusiness = useMemo(() => {
    return businesses.find((business) => business._id === businessParam);
  }, [businesses, businessParam]);
  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });
  const localUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email);
  }, [users, currentUser]);
  const { positions } = useOpenPositions({
    userId: localUser?._id,
    businessId: businessParam || rootBusiness?._id,
  });
  const selectedPosition = useMemo(() => {
    return positions.find((position) => position._id === id);
  }, [positions, id]);

  const { data: position, isLoading: isPositionLoading } = usePositionById({
    id,
  });

  const { toast } = useToast();

  const {
    data,
    isLoading: loadingPipe,
    isPending: pendingPipes,
    refetch: refetchPipe,
  } = usePipefyPipe({
    pipeId:
      filterStatus?.body.status === "completed"
        ? filterStatus?.body.pipe_id
        : undefined,
  });

  const [board, setBoard] = useState<BoardState | undefined>(data);

  const {
    searchTerm,
    setSearchTerm,
    matchFilter,
    sourceFilter,
    handleMatchChange,
    handleSourceChange,
    filteredBoard,
    resultCount,
    toggleQuickFilter,
    activeQuickFilters,
    quickFilterCounts,
    clearQuickFilters,
  } = useBoardFilters(board);

  const {
    draggedCard,
    setDraggedCard,
    pendingMove,
    isAlertOpen,
    setIsAlertOpen,
    showPendingFieldsModal,
    setShowPendingFieldsModal,
    onDrop,
    onCardMove,
    confirmMove,
    cancelMove,
  } = useBoardActions({ board, setBoard, refetchPipe });

  useEffect(() => {
    setBoard(data);
  }, [data]);

  useEffect(() => {
    console.log("/profile/filter response", filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    console.log("get pipe response", data);
  }, [data]);

  const onCopyLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/${lang}/application?positionId=${id}`,
    );
    toast({
      title: "Link de la vacante copiado",
    });
  };

  const showInProgress =
    !loadingPipe &&
    !loadingProfiles &&
    filterStatus?.body.status !== "completed";

  const showSkeleton =
    !showInProgress &&
    filterStatus?.body.status !== "in_progress" &&
    (isPositionLoading ||
      loadingPipe ||
      loadingProfiles ||
      pendingPipes ||
      pendingProfiles);

  const mapHiringToDraftPosition = (
    selectedPosition: HiringPositionData,
  ): DraftPositionData | null => {
    try {
      return {
        business_id: "",
        recruiter_user_id: selectedPosition.recruiter_user_id,
        owner_position_user_id: selectedPosition.owner_position_user_id,
        responsible_users: selectedPosition.responsible_users.map(
          (u) => u.user_id,
        ),
        role: selectedPosition.role,
        seniority: selectedPosition.seniority,
        country_code: selectedPosition.country_code,
        city: selectedPosition.city,
        description: selectedPosition.description,
        responsabilities: selectedPosition.responsabilities,
        education: selectedPosition.education,
        skills: selectedPosition.skills,
        languages: selectedPosition.languages,
        hiring_priority: selectedPosition.hiring_priority,
        work_mode: selectedPosition.work_mode,
        status: "DRAFT",
        benefits: selectedPosition.benefits,
        salary: selectedPosition.salary
          ? {
              currency: selectedPosition.salary.currency,
              salary: selectedPosition.salary.salary ?? null,
              salary_range: selectedPosition.salary.salary_range
                ? {
                    min: selectedPosition.salary.salary_range.min,
                    max: selectedPosition.salary.salary_range.max,
                  }
                : null,
            }
          : undefined,
      };
    } catch (error) {
      console.error("Error mapping hiring to draft position", error);
      return null;
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-8 flex justify-between border-b pb-8">
        <div className="flex w-full flex-col items-start gap-2">
          <Link
            href={`/${lang}/dashboard/positions?business_id=${businessParam || rootBusiness?._id}`}
            replace
          >
            <Button variant="ghost" className="-mx-8 text-sm">
              <ChevronLeft className="h-4 w-4" />
              {i18n.goBack}
            </Button>
          </Link>

          <div className="flex w-full items-center justify-between gap-1">
            <div className="flex items-center justify-center gap-1">
              <Badge
                variant="secondary"
                className="rounded-md border border-[#E4E4E7] bg-white text-[#34C759]"
              >
                {selectedPosition?.status}
              </Badge>
              <Badge variant="secondary" className="rounded-md">
                {countryLabelLookup(
                  filterStatus?.body.process_filters.country_code || "",
                )}
              </Badge>
              <Heading className="text-xl" level={1}>
                {filterStatus?.body.process_filters.role}
              </Heading>
              <div className="text-xs text-muted-foreground">
                <span className="font-bold">{i18n.createdBy}</span>:{" "}
                {selectedPosition?.recruiter_user_name} |
              </div>
              <div className="text-xs text-muted-foreground">
                {i18n.trackingLabel}{" "}
                {calculateTime(filterStatus?.body.created_at, dictionary)}
              </div>

              <Badge variant="secondary" className="rounded-md text-[#FF3B30]">
                {getPriority(selectedPosition?.hiring_priority, i18n)}
              </Badge>
            </div>

            <div className="flex items-center gap-8">
              <Notifications positions={positions} dictionary={dictionary} />

              {filterStatus?.body.status === "completed" && (
                <Button
                  className="place-self-center"
                  variant="outline"
                  onClick={onCopyLink}
                >
                  <Share2 />
                  Compartir vacante
                </Button>
              )}
              {selectedPosition && (
                <PositionSheet
                  business={currentBusiness}
                  positionData={mapHiringToDraftPosition(selectedPosition)}
                  dictionary={dictionary}
                  customTrigger={
                    <Button
                      variant="outline"
                      className="rounde-md border-talent-green-800 bg-transparent text-talent-green-800 hover:bg-talent-green-800 hover:text-white"
                    >
                      Ver detalles de la oferta
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 flex justify-between">
        <div className="flex items-center gap-2">
          <Input
            className="w-[250px] max-w-[18rem] shadow-sm focus-visible:ring-0"
            type="tex"
            placeholder={i18n.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <span className="text-sm">({resultCount})</span>}
        </div>
        <div className="flex gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="border border-dashed shadow-sm"
              >
                <SlidersHorizontal /> {i18n.filterLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="text-base font-bold">Filtrar</h4>
                </div>
                <Separator />

                <div className="grid gap-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">
                      {dictionary.userCard.roleAlignment}
                    </h4>
                  </div>

                  {MATCH_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={matchFilter === option}
                        onCheckedChange={() => handleMatchChange(option)}
                      />
                      <label
                        htmlFor={option}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid gap-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">
                      {dictionary.userCard.candidateSource}
                    </h4>
                  </div>

                  {SOURCE_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={sourceFilter === option}
                        onCheckedChange={() => handleSourceChange(option)}
                      />
                      <label
                        htmlFor={option}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mb-4 flex gap-4">
        {quickFilters.map((label) => (
          <Button
            key={label}
            onClick={() => toggleQuickFilter(label)}
            className={cn(
              "h-6 bg-talent-orange-500 hover:bg-talent-orange-600",
              !activeQuickFilters.includes(label) &&
                "bg-secondary text-black hover:bg-primary/20",
            )}
          >
            {label} ({quickFilterCounts[label] ?? 0})
          </Button>
        ))}
        <Button
          disabled={!activeQuickFilters.length}
          className="h-6 bg-secondary text-black hover:bg-primary/20"
          onClick={() => clearQuickFilters()}
        >
          Limpiar Selección
        </Button>
      </div>
      {showInProgress && (
        <div className="relative flex h-full gap-4">
          <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center gap-2 bg-[#D6D6D6]">
            <SmilePlus className="h-10 w-10 stroke-muted-foreground" />
            <Text type="p" className="text-lg font-semibold">
              🔄 {i18n.inProgressTitle}
            </Text>
            <Text
              type="p"
              size="small"
              className="mb-4 max-w-[563px] text-center text-muted-foreground"
            >
              📡 {i18n.inProgressDetails}
            </Text>
            <Text
              type="p"
              size="small"
              className="max-w-[563px] text-center text-muted-foreground"
            >
              💡 {i18n.inProgressMessage}
            </Text>
          </div>
        </div>
      )}
      {showSkeleton && (
        <div className="flex gap-4">
          <BoardSkeleton />
        </div>
      )}

      <div className="flex max-h-[calc(100vh-400px)] gap-4 overflow-x-auto">
        {board &&
          filteredBoard?.map((column) => (
            <BoardColumn
              positionFlow={position?.position_entity.position_flow}
              position={selectedPosition}
              dictionary={dictionary}
              pipe={board.pipe}
              key={column.id}
              column={column}
              onDrop={onDrop}
              onCardMove={onCardMove}
              draggedCard={draggedCard}
              setDraggedCard={setDraggedCard}
            />
          ))}
      </div>
      {/* Dialogs */}
      <MovePhaseDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={confirmMove}
        onCancel={cancelMove}
        i18n={i18n}
      />

      <MissingFieldsDialog
        open={showPendingFieldsModal}
        onOpenChange={setShowPendingFieldsModal}
        onCompleteFields={cancelMove}
        onCancel={cancelMove}
        pendingMove={pendingMove}
        i18n={i18n}
      />
    </div>
  );
};
