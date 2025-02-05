"use client";
import type React from "react";
import { UserCard } from "../UserCard/UserCard";
import type { Column as ColumnType, Card as CardType } from "@/types";

interface ColumnProps {
  column: ColumnType;
  onDrop: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newPosition: number,
  ) => void;
  onCardMove: (columnId: string, draggedId: string, targetId: string) => void;
}

export const BoardColumn: React.FC<ColumnProps> = ({
  column,
  onDrop,
  onCardMove,
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardData = e.dataTransfer.getData("text/plain");
    const card: CardType & { columnId: string } = JSON.parse(cardData);
    onDrop(card.id, card.columnId, column.id, column.cards.length);
  };

  const handleCardMove = (draggedId: string, targetId: string) => {
    onCardMove(column.id, draggedId, targetId);
  };

  return (
    <div
      className="w-[21.5rem] rounded-lg bg-gray-100 p-4 shadow-md"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="mb-4 text-lg font-semibold">{column.title}</h2>
      <div className="min-h-[100px] space-y-6">
        {column.cards.map((card) => (
          <UserCard
            key={card.id}
            card={card}
            columnId={column.id}
            onCardMove={handleCardMove}
          />
        ))}
      </div>
    </div>
  );
};
