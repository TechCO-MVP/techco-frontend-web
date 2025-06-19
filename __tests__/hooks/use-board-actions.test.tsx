// __tests__/hooks/use-board-actions.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useBoardActions } from "@/hooks/use-board-actions";
import { BoardState } from "@/types/pipefy";
import { vi, describe, it, expect, beforeEach } from "vitest";

const mockMutate = vi.fn();
const mockToast = vi.fn();
const mockOnSuccess = vi.fn();
const mockOnError = vi.fn();

// Replace your useMoveCardToPhase mock with this
vi.mock("@/hooks/use-move-card-to-phase", () => ({
  useMoveCardToPhase: (opts: any) => {
    // Save callbacks but also make mockMutate trigger them
    if (opts?.onSuccess) mockOnSuccess.mockImplementation(opts.onSuccess);
    if (opts?.onError) mockOnError.mockImplementation(opts.onError);

    // Make mockMutate trigger the onSuccess callback
    mockMutate.mockImplementation((variables: any) => {
      // When mutate is called, automatically trigger onSuccess
      if (opts?.onSuccess) {
        opts.onSuccess(
          {
            moveCardToPhase: {
              clientMutationId: "mock-id",
              card: { id: variables.cardId },
            },
          },
          variables,
        );
      }
    });

    return { mutate: mockMutate };
  },
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const mockSetBoard = vi.fn();

const createMockBoard = (): BoardState => ({
  pipe: {
    id: "pipe-id",
    name: "Pipe",
    cards_count: 2,
    organizationId: "org-id",
    startFormPhaseId: "start",
    publicForm: { url: "http://example.com" },
    phases: [],
  },
  columns: [
    {
      id: "col-1",
      name: "Column 1",
      cards_count: 1,
      cards: {
        nodes: [
          {
            id: "card-1",
            fields: [],
            comments: [],
            current_phase: {} as any,
            phases_history: [],
          },
          {
            id: "card-2",
            fields: [],
            comments: [],
            current_phase: {} as any,
            phases_history: [],
          },
        ],
      },
      cards_can_be_moved_to_phases: [],
      next_phase_ids: [],
      previous_phase_ids: [],
      fields: [],
      fieldConditions: [],
    },
    {
      id: "col-2",
      name: "Column 2",
      cards_count: 0,
      cards: {
        nodes: [],
      },
      cards_can_be_moved_to_phases: [],
      next_phase_ids: [],
      previous_phase_ids: [],
      fields: [],
      fieldConditions: [],
    },
  ],
});

describe("useBoardActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets pendingMove and opens alert on onDrop", () => {
    const board = createMockBoard();
    const { result } = renderHook(() =>
      useBoardActions({ board, setBoard: mockSetBoard }),
    );

    act(() => {
      result.current.onDrop("card-1", "col-1", "col-2", 0);
    });

    expect(result.current.pendingMove).toEqual({
      cardId: "card-1",
      sourceColumnId: "col-1",
      targetColumnId: "col-2",
      newPosition: 0,
    });
    expect(result.current.isAlertOpen).toBe(true);
  });

  it("does not drop if card is missing", () => {
    const board = createMockBoard();
    const { result } = renderHook(() =>
      useBoardActions({ board, setBoard: mockSetBoard }),
    );

    act(() => {
      result.current.onDrop("invalid-id", "col-1", "col-2", 0);
    });

    expect(result.current.pendingMove).toBeNull();
  });

  it("does not drop if board is missing", () => {
    const { result } = renderHook(() =>
      useBoardActions({ board: undefined, setBoard: mockSetBoard }),
    );

    act(() => {
      result.current.onDrop("card-1", "col-1", "col-2", 0);
    });

    expect(result.current.pendingMove).toBeNull();
  });

  it("sets board with reordered cards on onCardMove", () => {
    const board = createMockBoard();
    const setBoard = vi.fn((fn) => fn(board));
    const { result } = renderHook(() => useBoardActions({ board, setBoard }));

    act(() => {
      result.current.onCardMove("col-1", "card-1", "card-2");
    });

    expect(setBoard).toHaveBeenCalled();
  });

  it("confirms move and calls mutate", () => {
    const board = createMockBoard();
    const { result } = renderHook(() =>
      useBoardActions({ board, setBoard: mockSetBoard }),
    );

    act(() => {
      result.current.onDrop("card-1", "col-1", "col-2", 0); // sets pendingMove
    });

    // Add this to ensure state is updated before confirming
    act(() => {
      result.current.confirmMove(); // calls mutate
    });
    expect(mockMutate).toHaveBeenCalledWith({
      cardId: "card-1",
      destinationPhaseId: "col-2",
    });
  });

  it("cancels move and resets state", () => {
    const board = createMockBoard();
    const { result } = renderHook(() =>
      useBoardActions({ board, setBoard: mockSetBoard }),
    );

    act(() => {
      result.current.setDraggedCard({
        id: "card-1",
        node: board.columns[0].cards.nodes[0],
        sourceColumn: board.columns[0],
      });
      result.current.onDrop("card-1", "col-1", "col-2", 0);
      result.current.cancelMove();
    });

    expect(result.current.isAlertOpen).toBe(false);
    expect(result.current.pendingMove).toBe(null);
    expect(result.current.draggedCard).toBe(null);
  });
  it("handles error and sets pending field modal", () => {
    const board = createMockBoard();
    const { result } = renderHook(() =>
      useBoardActions({ board, setBoard: mockSetBoard }),
    );

    act(() => {
      result.current.onDrop("card-1", "col-1", "col-2", 0);
      mockOnError(new Error("fail"), {
        cardId: "card-1",
        destinationPhaseId: "col-2",
      });
    });

    expect(result.current.showPendingFieldsModal).toBe(true);
    expect(result.current.isAlertOpen).toBe(false);
  });

  it("handles success and updates board", () => {
    const board = createMockBoard();
    const movedCard = board.columns[0].cards.nodes[0];
    const { result } = renderHook(() =>
      useBoardActions({ board, setBoard: mockSetBoard }),
    );

    act(() => {
      result.current.onDrop("card-1", "col-1", "col-2", 0); // set pendingMove
    });

    act(() => {
      mockOnSuccess(
        {
          moveCardToPhase: {
            clientMutationId: "123",
            card: movedCard,
          },
        },
        { cardId: "card-1", destinationPhaseId: "col-2" },
      );
    });

    expect(mockToast).toHaveBeenCalled();
    expect(result.current.pendingMove).toBe(null);
    expect(result.current.isAlertOpen).toBe(false);
  });

  it("updates board correctly on successful move", () => {
    const board = createMockBoard();

    // Important: Create a mock that actually executes the function passed to it
    const setBoard = vi.fn((updater) => {
      if (typeof updater === "function") {
        // Execute the function with the current board and save the result
        const result = updater(board);
        // Update our local variable to simulate React state update
        Object.assign(board, result);
        return result;
      }
      return updater;
    });

    const { result } = renderHook(() => useBoardActions({ board, setBoard }));

    // Set up pendingMove
    act(() => {
      result.current.onDrop("card-1", "col-1", "col-2", 0);
    });

    // Manually trigger the onSuccess callback with the relevant data
    act(() => {
      mockOnSuccess(
        {
          moveCardToPhase: {
            clientMutationId: "mock-id",
            card: { id: "card-1" },
          },
        },
        { cardId: "card-1", destinationPhaseId: "col-2" },
      );
    });

    // Verify setBoard was called
    expect(setBoard).toHaveBeenCalled();

    // Verify the board has been updated correctly
    // Card should be removed from col-1
    expect(
      board.columns
        .find((c) => c.id === "col-1")
        ?.cards.nodes.find((card) => card.id === "card-1"),
    ).toBeUndefined();

    // Card should now be in col-2
    expect(
      board.columns
        .find((c) => c.id === "col-2")
        ?.cards.nodes.find((card) => card.id === "card-1"),
    ).toBeDefined();

    // Verify other state updates
    expect(result.current.pendingMove).toBe(null);
    expect(result.current.isAlertOpen).toBe(false);
    expect(mockToast).toHaveBeenCalled();
  });
});
