"use client";
import type React from "react";
import { useMemo } from "react";
import { UserCard } from "../UserCard/UserCard";
import type { PipefyPhase, PipefyNode, PipefyPipe } from "@/types/pipefy";
import { cn } from "@/lib/utils";
import { Dictionary } from "@/types/i18n";

interface ColumnProps {
  dictionary: Dictionary;
  pipe: PipefyPipe;
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

  return (
    <div
      className={cn(
        "max-h-screen w-[21.5rem] min-w-[21.5rem] overflow-hidden rounded-lg bg-gray-100 p-4 shadow-md hover:overflow-y-auto",
        {
          "border border-green-200 bg-green-200": draggedCard && canDrop,
          "border border-red-500 bg-red-200": draggedCard && !canDrop,
        },
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <h2 className="mb-4 text-lg font-semibold">
        {column.name} ({column.cards_count})
      </h2>
      <div className="space-y-6">
        {column.cards.nodes.map((card) => (
          <UserCard
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
  );
};
