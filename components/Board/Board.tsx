"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { BoardColumn } from "../BoardColumn/BoardColumn";
import { PipefyNode, PipefyPhase, type BoardState } from "@/types/pipefy";
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
import { ChevronLeft, SlidersHorizontal, SmilePlus } from "lucide-react";
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
import { countryLabelLookup } from "@/lib/utils";
import { useOpenPositions } from "@/hooks/use-open-positions";
export const Board: React.FC = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const {
    data: filterStatus,
    isLoading: loadingProfiles,
    isPending: pendingProfiles,
  } = useProfileFilterStatus({
    positionId: id,
  });

  const { positions } = useOpenPositions({
    businessId: "679077da2d6626a2b007f8f9",
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

  const getPriority = () => {
    if (!selectedPosition?.hiring_priority) return "";
    switch (selectedPosition.hiring_priority) {
      case "high":
        return "Prioridad alta 🔥🔥";
      case "medium":
        return "Prioridad media 🔥";
      case "low":
        return "Prioridad baja";
      default:
        return "";
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-12 flex flex-col items-start gap-2 border-b pb-8">
        <Link href="/dashboard/positions">
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            Atrás
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
          <span className="font-bold">Creado por:</span> Mao Molina | 17 Feb
          2023 (Traking 33 dias)
        </div>
      </div>
      <div className="mb-8 flex justify-between">
        <Input
          className="max-w-[18rem] shadow-sm"
          type="tex"
          placeholder="Buscar nombre del candidato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-6">
          <Button variant="ghost" className="border border-dashed shadow-sm">
            <SlidersHorizontal /> Filtro
          </Button>
          <StartFormDialog publicFormUrl={board?.pipe.publicForm.url} />
        </div>
      </div>
      <div className="relative flex gap-4">
        {!loadingPipe &&
          !loadingProfiles &&
          filterStatus?.body.status !== "completed" && (
            <div className="absolute left-0 top-0 flex h-[687px] w-full flex-col items-center justify-center gap-2 bg-[#D6D6D6]">
              <SmilePlus className="h-10 w-10 stroke-muted-foreground" />
              <Text type="p" className="text-lg font-semibold">
                🔄 Este proceso puede tardar hasta 10 minutos.{" "}
              </Text>
              <Text
                type="p"
                size="small"
                className="mb-4 max-w-[563px] text-center text-muted-foreground"
              >
                📡 Estamos consultando bases de datos para traer a los mejores
                candidatos para tu vacante. Este proceso toma un poco de tiempo
                para asegurarnos de ofrecerte perfiles que mejor se ajusten a tu
                empresa y a los requisitos del puesto.
              </Text>
              <Text
                type="p"
                size="small"
                className="max-w-[563px] text-center text-muted-foreground"
              >
                💡 Puedes quedarte aquí o continuar con otras tareas. No te
                preocupes, recibirás una notificación cuando los candidatos
                estén disponibles.
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

      <div className="flex gap-4">
        {board?.columns.map((column) => (
          <BoardColumn
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
              ¿Seguro que quieres mover al candidato a la siguiente fase?
            </DialogTitle>
            <DialogDescription>
              El candidato pasará de la fase actual a una nueva etapa del
              proceso. Puedes avanzar o retroceder cuando lo necesites.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-10 flex flex-col gap-8 sm:flex-col">
            <Button variant="default" onClick={confirmMove}>
              Confirmar Cambio
            </Button>
            <Button variant="ghost" onClick={cancelMove}>
              Cancelar
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
              Información incompleta.
            </DialogTitle>
            <DialogDescription>
              Aún tienes información pendiente para esta fase.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-10 flex flex-col gap-8 sm:flex-col">
            <Button
              onClick={() => {
                const element = document.querySelector(
                  `#details-${pendingMove?.sourceColumnId}`,
                ) as HTMLElement;

                if (element) {
                  element.click();
                  cancelMove();
                }
              }}
              variant="default"
            >
              Completar información
            </Button>
            <Button variant="ghost" onClick={cancelMove}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
