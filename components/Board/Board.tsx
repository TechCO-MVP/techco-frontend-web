"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { BoardColumn } from "../BoardColumn/BoardColumn";
import {
  PipefyFieldValues,
  PipefyNode,
  PipefyPhase,
  type BoardState,
} from "@/types/pipefy";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";
import { StartFormDialog } from "@/components/StartFormDialog/StartFormDialog";
import { useToast } from "@/hooks/use-toast";
import { useProfileFilterStatus } from "@/hooks/use-profile-filter-status";
import BoardSkeleton from "./Skeleton";
import { useParams } from "next/navigation";
import { countryLabelLookup, timeAgo } from "@/lib/utils";
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

type BoardProps = {
  dictionary: Dictionary;
};
export const Board: React.FC<BoardProps> = ({ dictionary }) => {
  const [matchFilter, setMatchFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const matchOptions = ["Alta", "Media - Alta", "Media", "Baja"];
  const sourceOptions = [
    "Talent Connect",
    "URL de la oferta",
    "Ingreso manual",
  ];
  const statusOptions = ["Activo", "Descartado", "Desistió del proceso"];

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

  const { toast } = useToast();
  const { mutate } = useMoveCardToPhase({
    onSuccess: (data, variables) => {
      if (!pendingMove) return;
      toast({
        title: "Cambio de Fase Correcto",
        description: "El candidato ha sido movido a la siguiente fase.",
      });
      const { cardId, sourceColumnId, targetColumnId, newPosition } =
        pendingMove;

      setBoard((prevBoard) => {
        if (!prevBoard) return;

        const updatedColumns = prevBoard.columns.map((column) => {
          if (column.id === sourceColumnId) {
            // Remove the card from the source column
            const filteredCards = column.cards.nodes.filter(
              (card) => card.id !== cardId,
            );
            return {
              ...column,
              cards: {
                nodes: filteredCards.map((card, index) => ({
                  ...card,
                  position: index,
                })),
              },
            };
          }

          if (column.id === targetColumnId) {
            const sourceColumn = prevBoard.columns.find(
              (col) => col.id === sourceColumnId,
            );
            if (!sourceColumn) return column;

            const movedCard = sourceColumn.cards.nodes.find(
              (card) => card.id === cardId,
            );
            if (!movedCard) return column;

            const updatedCards = [
              ...column.cards.nodes.slice(0, newPosition),
              { ...movedCard, position: newPosition },
              ...column.cards.nodes.slice(newPosition),
            ].map((card, index) => ({ ...card, position: index }));

            return {
              ...column,
              cards: { nodes: updatedCards },
            };
          }

          return column;
        });

        return { ...prevBoard, columns: updatedColumns };
      });

      setIsAlertOpen(false);
      setPendingMove(null);
      console.log("Card moved successfully:", data.moveCardToPhase.card);
      console.log(
        "Moved from:",
        variables.cardId,
        "➡",
        "To:",
        variables.destinationPhaseId,
      );
    },
    onError: (error, variables) => {
      setShowPendingFieldsModal(true);
      setIsAlertOpen(false);

      console.error(" Move failed:", error);
      console.error(
        "Failed to move from:",
        variables.cardId,
        "➡",
        "To:",
        variables.destinationPhaseId,
      );
    },
    onSettled: (data, error) => {
      console.log(" Mutation Settled. Success:", !!data, "Error:", !!error);
    },
  });
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showPendingFieldsModal, setShowPendingFieldsModal] = useState(false);
  const [draggedCard, setDraggedCard] = useState<{
    id: string;
    node: PipefyNode;
    sourceColumn: PipefyPhase;
  } | null>(null);

  const [pendingMove, setPendingMove] = useState<{
    cardId: string;
    sourceColumnId: string;
    targetColumnId: string;
    newPosition: number;
  } | null>(null);

  const onDrop = (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newPosition: number,
  ) => {
    if (sourceColumnId === targetColumnId) return;
    if (!board) return;

    const sourceColumn = board.columns.find((col) => col.id === sourceColumnId);
    const targetColumn = board.columns.find((col) => col.id === targetColumnId);

    if (!sourceColumn || !targetColumn) return;

    const card = sourceColumn.cards.nodes.find((c) => c.id === cardId);
    if (!card) return;

    setPendingMove({ cardId, sourceColumnId, targetColumnId, newPosition });

    setIsAlertOpen(true);
  };

  const confirmMove = () => {
    if (!pendingMove) return;

    const { cardId, targetColumnId } = pendingMove;
    mutate({
      cardId,
      destinationPhaseId: targetColumnId,
    });
  };

  const cancelMove = () => {
    setIsAlertOpen(false);
    setShowPendingFieldsModal(false);
    setDraggedCard(null);
    setPendingMove(null);
  };

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

  const onCardMove = (
    columnId: string,
    draggedId: string,
    targetId: string,
  ) => {
    setBoard((prevBoard) => {
      if (!prevBoard) return;

      const updatedColumns = prevBoard.columns.map((column) => {
        if (column.id === columnId) {
          const cards = [...column.cards.nodes];
          const draggedIndex = cards.findIndex((card) => card.id === draggedId);
          const targetIndex = cards.findIndex((card) => card.id === targetId);

          if (draggedIndex === -1 || targetIndex === -1) return column;

          const [draggedCard] = cards.splice(draggedIndex, 1);
          cards.splice(targetIndex, 0, draggedCard);

          return {
            ...column,
            cards: {
              nodes: cards.map((card, index) => ({ ...card, position: index })),
            },
          };
        }
        return column;
      });

      return { ...prevBoard, columns: updatedColumns };
    });
  };
  useEffect(() => {
    setBoard(data);
  }, [data]);

  useEffect(() => {
    console.log("/profile/filter response", filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    console.log("get pipe response", data);
  }, [data]);

  const handleMatchChange = (value: string) => {
    setMatchFilter((prev) => (prev === value ? null : value));
  };

  const handleSourceChange = (value: string) => {
    setSourceFilter((prev) => (prev === value ? null : value));
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter((prev) => (prev === value ? null : value));
  };

  const { filteredBoard, resultCount } = useMemo(() => {
    let count = 0;

    const filtered = board?.pipe.phases.map((column) => {
      const filteredNodes = column.cards.nodes.filter((node) => {
        const fieldMap = Object.fromEntries(
          node.fields.map((field) => [field.indexName, field.value]),
        );

        const matchesSearch =
          !searchTerm ||
          String(fieldMap[PipefyFieldValues.CandidateName] || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesMatch =
          !matchFilter ||
          String(
            fieldMap[PipefyFieldValues.RoleAlignment] || "",
          ).toLowerCase() === matchFilter.toLowerCase();

        const matchesSource =
          !sourceFilter ||
          String(
            fieldMap[PipefyFieldValues.CandidateSource] || "",
          ).toLowerCase() === sourceFilter.toLowerCase();

        const matchesStatus =
          !statusFilter ||
          String(
            fieldMap[PipefyFieldValues.CandidateStatus] || "",
          ).toLowerCase() === statusFilter.toLowerCase();

        const isMatch =
          matchesSearch && matchesMatch && matchesSource && matchesStatus;

        if (isMatch) count += 1;

        return isMatch;
      });

      return {
        ...column,
        cards: {
          ...column.cards,
          nodes: filteredNodes,
        },
      };
    });

    return { filteredBoard: filtered, resultCount: count };
  }, [searchTerm, board, matchFilter, sourceFilter, statusFilter]);

  const getPriority = () => {
    if (!selectedPosition?.hiring_priority) return "";
    switch (selectedPosition.hiring_priority) {
      case "high":
        return `${i18n.highPriority} 🔥🔥`;
      case "medium":
        return `${i18n.mediumPriority} 🔥`;
      case "low":
        return `${i18n.lowPriority}`;
      default:
        return "";
    }
  };

  const calculateTime = (dateString: string | undefined) => {
    if (!dateString) return null;
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    const diffInMs = currentDate.getTime() - givenDate.getTime();

    return timeAgo(diffInMs, dictionary);
  };

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
          <Badge variant="secondary" className="rounded-md">
            {countryLabelLookup(
              filterStatus?.body.process_filters.country_code || "",
            )}
          </Badge>
          <div className="flex items-center justify-center gap-2">
            <Heading className="text-xl" level={1}>
              {filterStatus?.body.process_filters.role}
            </Heading>
            <Badge variant="secondary" className="rounded-md text-[#34C759]">
              {selectedPosition?.status}
            </Badge>
            <Badge variant="secondary" className="rounded-md text-[#FF3B30]">
              {getPriority()}
            </Badge>
          </div>
          <div className="text-muted-foreground">
            {i18n.trackingLabel} {calculateTime(filterStatus?.body.created_at)}
          </div>
          <Notifications label={i18n.notifications} />
        </div>
        <Button
          className="place-self-end"
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

                  {matchOptions.map((option) => (
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

                  {sourceOptions.map((option) => (
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

                  {statusOptions.map((option) => (
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

      <div className="flex max-h-screen min-h-[32rem] gap-4 hover:overflow-x-auto">
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
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="max-w-[26rem] p-12">
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-normal">
              {i18n.moveToPhaseDialogTitle}
            </DialogTitle>
            <DialogDescription>{i18n.moveToPhaseDialogInfo}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-10 flex flex-col gap-8 sm:flex-col">
            <Button variant="default" onClick={confirmMove}>
              {i18n.confirmMove}
            </Button>
            <Button variant="ghost" onClick={cancelMove}>
              {i18n.cancelMove}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showPendingFieldsModal}
        onOpenChange={setShowPendingFieldsModal}
      >
        <DialogContent className="max-w-[26rem] p-12">
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-normal">
              {i18n.missingFieldsDialogTitle}
            </DialogTitle>
            <DialogDescription>
              {i18n.missingFieldsDialogInfo}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-10 flex flex-col gap-8 sm:flex-col">
            <Button
              onClick={() => {
                const element = document.querySelector(
                  `#details-${pendingMove?.sourceColumnId}-${pendingMove?.cardId}`,
                ) as HTMLElement;

                if (element) {
                  element.click();
                  cancelMove();
                }
              }}
              variant="default"
            >
              {i18n.completeMissingFieldsLabel}
            </Button>
            <Button variant="ghost" onClick={cancelMove}>
              {i18n.cancelMove}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
