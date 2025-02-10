"use client";

import type React from "react";
import { useState } from "react";
import { BoardColumn } from "../BoardColumn/BoardColumn";
import { type BoardState } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Text } from "../Typography/Text";
import { Button } from "../ui/button";
import { ChevronLeft, Plus, SlidersHorizontal, SmilePlus } from "lucide-react";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Heading } from "../Typography/Heading";
import Link from "next/link";

const initialState: BoardState = {
  columns: [
    {
      id: "todo",
      title: "Etapa 1",
      cards: [
        { id: "task1", content: "Task 1", position: 0 },
        { id: "task2", content: "Task 2", position: 1 },
      ],
    },
    {
      id: "inprogress",
      title: "Etapa 2",
      cards: [{ id: "task3", content: "Task 3", position: 0 }],
    },
    {
      id: "done",
      title: "Etapa 3",
      cards: [{ id: "task4", content: "Task 4", position: 0 }],
    },
  ],
};

export const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmpty] = useState(false);
  const [isLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
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

    const sourceColumn = board.columns.find((col) => col.id === sourceColumnId);
    const targetColumn = board.columns.find((col) => col.id === targetColumnId);

    if (!sourceColumn || !targetColumn) return;

    const card = sourceColumn.cards.find((c) => c.id === cardId);
    if (!card) return;

    setPendingMove({ cardId, sourceColumnId, targetColumnId, newPosition });
    setIsAlertOpen(true);
  };

  const confirmMove = () => {
    if (!pendingMove) return;

    const { cardId, sourceColumnId, targetColumnId } = pendingMove;

    setBoard((prevBoard) => {
      const newColumns = prevBoard.columns.map((column) => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            cards: column.cards
              .filter((card) => card.id !== cardId)
              .map((card, index) => ({ ...card, position: index })),
          };
        }
        if (column.id === targetColumnId) {
          const [movedCard] = prevBoard.columns
            .find((col) => col.id === sourceColumnId)!
            .cards.filter((card) => card.id === cardId);

          const newCards = [
            ...column.cards,
            { ...movedCard, position: column.cards.length },
          ].map((card, index) => ({
            ...card,
            position: index,
          }));

          return {
            ...column,
            cards: newCards,
          };
        }
        return column;
      });

      return { ...prevBoard, columns: newColumns };
    });

    setIsAlertOpen(false);
    setPendingMove(null);
  };

  const cancelMove = () => {
    setIsAlertOpen(false);
    setPendingMove(null);
  };

  const onCardMove = (
    columnId: string,
    draggedId: string,
    targetId: string,
  ) => {
    setBoard((prevBoard) => {
      const newColumns = prevBoard.columns.map((column) => {
        if (column.id === columnId) {
          const cards = [...column.cards];
          const draggedIndex = cards.findIndex((card) => card.id === draggedId);
          const targetIndex = cards.findIndex((card) => card.id === targetId);
          const [draggedCard] = cards.splice(draggedIndex, 1);
          cards.splice(targetIndex, 0, draggedCard);

          return {
            ...column,
            cards: cards.map((card, index) => ({ ...card, position: index })),
          };
        }
        return column;
      });

      return { ...prevBoard, columns: newColumns };
    });
  };

  return (
    <div className="flex w-full flex-col px-8">
      <div className="mb-12 flex flex-col items-start gap-2 border-b pb-8">
        <Link href="openings">
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            Atrás
          </Button>
        </Link>
        <Badge variant="secondary" className="rounded-md">
          Mex 🇲🇽
        </Badge>
        <div className="flex items-center justify-center gap-2">
          <Heading className="text-xl" level={1}>
            Lead Arquitecto (0000000)
          </Heading>
          <Badge variant="secondary" className="rounded-md text-[#34C759]">
            Activa
          </Badge>
          <Badge variant="secondary" className="rounded-md text-[#FF3B30]">
            Prioridad alta 🔥🔥
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
          <Button variant="ghost" className="bg-secondary">
            <Plus /> Agregar Candidato
          </Button>
        </div>
      </div>
      <div className="relative flex gap-4">
        {board.columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            onDrop={onDrop}
            onCardMove={onCardMove}
          />
        ))}
        {isEmpty && (
          <div className="absolute bottom-0 left-4 flex h-[88%] w-[calc(100%-2rem)] flex-col items-center justify-center gap-2 bg-[#D6D6D6]">
            <SmilePlus className="h-10 w-10 stroke-muted-foreground" />
            <Text type="p" className="text-lg font-semibold">
              Todavía no hay candidatos en este proceso
            </Text>
            <Text
              type="p"
              size="small"
              className="max-w-md text-center text-muted-foreground"
            >
              Aquí verás a los postulantes en cuanto comiencen a aplicar a la
              vacante. Comparte la oferta en distintos canales para atraer más
              talento.
            </Text>
            <Button>Agregar candidato</Button>
          </div>
        )}
        {isLoading && (
          <div className="absolute bottom-0 left-4 flex h-[88%] w-[calc(100%-2rem)] flex-col items-center justify-center gap-2 bg-[#D6D6D6]">
            <SmilePlus className="h-10 w-10 stroke-muted-foreground" />
            <Text type="p" className="text-lg font-semibold">
              Buscando los mejores talentos para tu vacante…
            </Text>
            <Text
              type="p"
              size="small"
              className="max-w-md text-center text-muted-foreground"
            >
              🔄 Esto tomará solo unos instantes. Pronto conocerás a los mejores
              candidatos para tu búsqueda.
            </Text>
            <Progress value={33} className="max-w-md" />
          </div>
        )}
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
    </div>
  );
};
