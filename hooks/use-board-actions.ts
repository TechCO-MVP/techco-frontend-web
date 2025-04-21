import { useState } from "react";
import { PipefyNode, PipefyPhase, BoardState } from "@/types/pipefy";
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";
import { useToast } from "@/hooks/use-toast";

interface UseBoardDragDropParams {
  board?: BoardState;
  setBoard: React.Dispatch<React.SetStateAction<BoardState | undefined>>;
}

interface PendingMove {
  cardId: string;
  sourceColumnId: string;
  targetColumnId: string;
  newPosition: number;
}

export function useBoardActions({ board, setBoard }: UseBoardDragDropParams) {
  const [draggedCard, setDraggedCard] = useState<{
    id: string;
    node: PipefyNode;
    sourceColumn: PipefyPhase;
  } | null>(null);

  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showPendingFieldsModal, setShowPendingFieldsModal] = useState(false);

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
        if (!prevBoard) return prevBoard;

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
    onError: () => {
      setShowPendingFieldsModal(true);
      setIsAlertOpen(false);
    },
  });

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

  const onCardMove = (
    columnId: string,
    draggedId: string,
    targetId: string,
  ) => {
    setBoard((prevBoard) => {
      if (!prevBoard) return prevBoard;

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

  return {
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
  };
}
