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
import { StartFormDialog } from "@/components/StartFormDialog/StartFormDialog";
import { useToast } from "@/hooks/use-toast";
import { useProfileFilterStatus } from "@/hooks/use-profile-filter-status";
import BoardSkeleton from "./Skeleton";
import { useParams } from "next/navigation";
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
import { selectNotificationsState } from "@/lib/store/features/notifications/notifications";
import { useAppSelector } from "@/lib/store/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { useBoardFilters } from "@/hooks/use-board-filters";
import { useBoardActions } from "@/hooks/use-board-actions";
import { STATUS_OPTIONS, MATCH_OPTIONS, SOURCE_OPTIONS } from "@/constants";
import { MovePhaseDialog } from "./MovePhaseDialog";
import { MissingFieldsDialog } from "./MissingFieldsDialog";
type BoardProps = {
  dictionary: Dictionary;
};
export const Board: React.FC<BoardProps> = ({ dictionary }) => {
  const quickFilters = [
    "Revisión inicial",
    "Primer entrevista",
    "Habilidades blandas",
  ];

  const notificationsState = useAppSelector(selectNotificationsState);
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
  const { rootBusiness } = useBusinesses();
  const { currentUser } = useCurrentUser();

  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });
  const localUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email);
  }, [users, currentUser]);
  const { positions } = useOpenPositions({
    userId: localUser?._id,
    businessId: rootBusiness?._id,
  });
  const selectedPosition = useMemo(() => {
    return positions.find((position) => position._id === id);
  }, [positions, id]);
  console.log(
    "%c[Debug] selectedPosition",
    "background-color: teal; font-size: 20px; color: white",
    selectedPosition,
  );

  const { toast } = useToast();

  const {
    data,
    isLoading: loadingPipe,
    isPending: pendingPipes,
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
    statusFilter,
    handleMatchChange,
    handleSourceChange,
    handleStatusChange,
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
  } = useBoardActions({ board, setBoard });

  useEffect(() => {
    const { showCandidateDetails } = notificationsState;
    if (showCandidateDetails && data?.pipe) {
      setTimeout(() => {
        console.log(
          "query",
          `#details-${showCandidateDetails.phaseId}-${showCandidateDetails.cardId}`,
        );
        const element = document.querySelector(
          `#details-${showCandidateDetails.phaseId}-${showCandidateDetails.cardId}`,
        ) as HTMLElement;

        console.log(
          "%c[Debug] element",
          "background-color: teal; font-size: 20px; color: white",
          element,
        );
        if (element) {
          element.click();
        }
      }, 200);
    }
  }, [notificationsState, data]);

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
    navigator.clipboard.writeText("https://copy");
    toast({
      title: "Link de la vacante copiado",
    });
  };
  return (
    <div className="flex w-full flex-col">
      <div className="mb-8 flex justify-between border-b pb-8">
        <div className="flex flex-col items-start gap-2">
          <Link href={`/${lang}/dashboard/positions`} replace>
            <Button variant="ghost" className="-mx-8 text-sm">
              <ChevronLeft className="h-4 w-4" />
              {i18n.goBack}
            </Button>
          </Link>

          <div className="flex items-center justify-center gap-1">
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
            <Badge variant="secondary" className="rounded-md text-[#34C759]">
              {selectedPosition?.status}
            </Badge>
            <Badge variant="secondary" className="rounded-md text-[#FF3B30]">
              {getPriority(selectedPosition?.hiring_priority, i18n)}
            </Badge>
            <Notifications label={i18n.notifications} />
          </div>
        </div>
        <Button
          className="place-self-center"
          variant="outline"
          onClick={onCopyLink}
        >
          <Share2 />
          Compartir vacante
        </Button>
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

                <Separator />

                <div className="grid gap-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">
                      {dictionary.userCard.candidateSource}
                    </h4>
                  </div>

                  {STATUS_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={statusFilter === option}
                        onCheckedChange={() => handleStatusChange(option)}
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

          <StartFormDialog publicFormUrl={board?.pipe.publicForm.url} />
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
      <div className="relative flex gap-4">
        {!loadingPipe &&
          !loadingProfiles &&
          filterStatus?.body.status !== "completed" && (
            <div className="absolute left-0 top-0 z-20 flex h-[687px] w-full flex-col items-center justify-center gap-2 bg-[#D6D6D6]">
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
          )}
      </div>
      {filterStatus?.body.status !== "in_progress" &&
        (loadingPipe || loadingProfiles || pendingPipes || pendingProfiles) && (
          <div className="flex gap-4">
            <BoardSkeleton />
          </div>
        )}

      <div className="flex max-h-[calc(100vh-400px)] gap-4 hover:overflow-x-auto">
        {board &&
          filteredBoard?.map((column) => (
            <BoardColumn
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
