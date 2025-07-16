"use client";
import type React from "react";
import { useMemo } from "react";
import { UserCard } from "../UserCard/UserCard";
import type { PipefyPhase, PipefyNode, PipefyPipe } from "@/types/pipefy";
import { cn } from "@/lib/utils";
import { Dictionary } from "@/types/i18n";
import { HiringPositionData, PositionFlow } from "@/types";

interface ColumnProps {
  dictionary: Dictionary;
  pipe: PipefyPipe;
  position?: HiringPositionData;
  positionFlow?: PositionFlow;
  draggedCard: {
    id: string;
    node: PipefyNode;
    sourceColumn: PipefyPhase;
  } | null;
  setDraggedCard: (
    card: { id: string; node: PipefyNode; sourceColumn: PipefyPhase } | null,
  ) => void;
  column: PipefyPhase;
  onDrop: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newPosition: number,
  ) => void;
  onCardMove: (columnId: string, draggedId: string, targetId: string) => void;
}

export const BoardColumn: React.FC<ColumnProps> = ({
  positionFlow,
  position,
  pipe,
  column,
  onDrop,
  onCardMove,
  draggedCard,
  setDraggedCard,
  dictionary,
}) => {
  const canDrop = useMemo(() => {
    if (!draggedCard) return false;
    if (draggedCard.sourceColumn.id === column.id) return true;
    const isAllowed =
      draggedCard.sourceColumn.cards_can_be_moved_to_phases.some(
        (phase) => phase.id === column.id,
      );
    if (!isAllowed) return false;
    return true;
  }, [draggedCard, column.id]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDragLeave = () => {};

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!draggedCard) return;

    const cardData = e.dataTransfer.getData("text/plain");
    const card: PipefyNode & { columnId: string } = JSON.parse(cardData);
    if (canDrop) {
      onDrop(card.id, card.columnId, column.id, column.cards.nodes.length);
    }
    setDraggedCard(null);
  };

  const handleCardMove = (draggedId: string, targetId: string) => {
    onCardMove(column.id, draggedId, targetId);
  };

  const getColumnTitle = (columnName: string) => {
    switch (columnName) {
      case "Oferta enviada":
        return "Candidatos interesados";
      case "Candidatos sugeridos":
        return "Coincidencias iniciales";
      case "Filtro inicial":
        return "No match ADN del talento";
      case "Assessment fit Cultural":
        return "¡Match en ADN del talento! (Esperando prueba de Retos y Comportamientos)";
      case "Resultado Fit Cultural":
        return "Resultado Retos y Comportamientos";
      case "Assessment técnico":
        return "¡Match en Retos y Comportamientos! (Esperando Caso de negocio)";
      case "Resultado Assessment técnico":
        return "Resultado Caso de Negocio";
      default:
        return columnName;
    }
  };

  const getColumnBorder = (columnName: string) => {
    switch (columnName) {
      case "Resultado Fit Cultural":
      case "Primera entrevista programada":
      case "Resultado primer entrevista":
      case "Resultado Assessment técnico":
      case "Entrevista final programada":
      case "Resultado entrevista final":
      case "Finalistas":
        return "border border-t-8 border-[#f9c00733]";

      default:
        return "border border-t-8 border-[#17594738]";
    }
  };

  return (
    <div
      className={cn(
        "flex h-full w-[21.5rem] min-w-[21.5rem] flex-col overflow-hidden rounded-lg bg-white shadow-md",
        {
          [getColumnBorder(column.name)]: true,
        },
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {/* Fixed header */}
      <div className="flex-shrink-0 p-4 pb-0">
        <h2 className="mb-4 text-lg font-semibold">
          {getColumnTitle(column.name)} ({column.cards_count})
        </h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-hidden p-4 pt-0 hover:overflow-y-auto">
        <div className="space-y-6">
          {column.cards.nodes.map((card) => (
            <UserCard
              position={position}
              positionFlow={positionFlow}
              dictionary={dictionary}
              pipe={pipe}
              key={card.id}
              card={card}
              column={column}
              onCardMove={handleCardMove}
              setDraggedCard={setDraggedCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
