import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useBoardFilters } from "@/hooks/use-board-filters";
import { BoardState, PipefyFieldValues } from "@/types/pipefy";

const mockBoard: BoardState = {
  pipe: {
    id: "pipe_1",
    name: "Pipeline",
    organizationId: "org_1",
    cards_count: 1,
    startFormPhaseId: "start",
    publicForm: { url: "https://example.com" },
    phases: [
      {
        id: "phase_1",
        name: "Phase 1",
        cards_count: 1,
        cards: {
          nodes: [
            {
              id: "card_1",
              current_phase: {} as any,
              phases_history: [],
              comments: [],
              fields: [
                {
                  id: "1",
                  label: "Candidate Name",
                  name: "name",
                  value: "Alice Johnson",
                  indexName: PipefyFieldValues.CandidateName,
                  type: "short_text",
                  internal_id: "",
                  required: false,
                  options: [],
                  filled_at: new Date(),
                  phase_field: {
                    internal_id: "1",
                    required: true,
                    options: [],
                  },
                  field: { type: "short_text" },
                },
                {
                  id: "2",
                  label: "Role Alignment",
                  name: "role",
                  value: "Match",
                  indexName: PipefyFieldValues.RoleAlignment,
                  type: "short_text",
                  internal_id: "",
                  required: false,
                  options: [],
                  filled_at: new Date(),
                  phase_field: {
                    internal_id: "2",
                    required: true,
                    options: [],
                  },
                  field: { type: "short_text" },
                },
                {
                  id: "3",
                  label: "Candidate Source",
                  name: "source",
                  value: "LinkedIn",
                  indexName: PipefyFieldValues.CandidateSource,
                  type: "short_text",
                  internal_id: "",
                  required: false,
                  options: [],
                  filled_at: new Date(),
                  phase_field: {
                    internal_id: "3",
                    required: true,
                    options: [],
                  },
                  field: { type: "short_text" },
                },
                {
                  id: "4",
                  label: "Candidate Status",
                  name: "status",
                  value: "Active",
                  indexName: PipefyFieldValues.CandidateStatus,
                  type: "short_text",
                  internal_id: "",
                  required: false,
                  options: [],
                  filled_at: new Date(),
                  phase_field: {
                    internal_id: "4",
                    required: true,
                    options: [],
                  },
                  field: { type: "short_text" },
                },
              ],
            },
          ],
        },
        cards_can_be_moved_to_phases: [],
        next_phase_ids: [],
        previous_phase_ids: [],
        fields: [],
        fieldConditions: [],
      },
    ],
  },
  columns: [],
};

describe("useBoardFilters", () => {
  it("should return all cards when no filters are applied", () => {
    const { result } = renderHook(() => useBoardFilters(mockBoard));
    expect(result.current.resultCount).toBe(1);
  });

  it("should filter by candidate name", () => {
    const { result } = renderHook(() => useBoardFilters(mockBoard));
    act(() => {
      result.current.setSearchTerm("alice");
    });
    expect(result.current.resultCount).toBe(1);
  });

  it("should return 0 results when name doesn't match", () => {
    const { result } = renderHook(() => useBoardFilters(mockBoard));
    act(() => {
      result.current.setSearchTerm("bob");
    });
    expect(result.current.resultCount).toBe(0);
  });

  it("should toggle match filter", () => {
    const { result } = renderHook(() => useBoardFilters(mockBoard));
    act(() => {
      result.current.handleMatchChange("Match");
    });
    expect(result.current.matchFilter).toBe("Match");

    act(() => {
      result.current.handleMatchChange("Match");
    });
    expect(result.current.matchFilter).toBeNull();
  });

  it("should toggle source filter", () => {
    const { result } = renderHook(() => useBoardFilters(mockBoard));
    act(() => {
      result.current.handleSourceChange("LinkedIn");
    });
    expect(result.current.sourceFilter).toBe("LinkedIn");

    act(() => {
      result.current.handleSourceChange("LinkedIn");
    });
    expect(result.current.sourceFilter).toBeNull();
  });

  it("should toggle status filter", () => {
    const { result } = renderHook(() => useBoardFilters(mockBoard));
    act(() => {
      result.current.handleStatusChange("Active");
    });
    expect(result.current.statusFilter).toBe("Active");

    act(() => {
      result.current.handleStatusChange("Active");
    });
    expect(result.current.statusFilter).toBeNull();
  });

  it("should combine all filters correctly", () => {
    const { result } = renderHook(() => useBoardFilters(mockBoard));
    act(() => {
      result.current.setSearchTerm("Alice");
      result.current.handleMatchChange("Match");
      result.current.handleSourceChange("LinkedIn");
      result.current.handleStatusChange("Active");
    });
    expect(result.current.resultCount).toBe(1);
  });

  it("should return 0 if combined filters don't match", () => {
    const { result } = renderHook(() => useBoardFilters(mockBoard));
    act(() => {
      result.current.setSearchTerm("Unknown");
      result.current.handleMatchChange("Mismatch");
      result.current.handleSourceChange("Referral");
      result.current.handleStatusChange("Inactive");
    });
    expect(result.current.resultCount).toBe(0);
  });

  it("should handle undefined board", () => {
    const { result } = renderHook(() => useBoardFilters(undefined));
    expect(result.current.resultCount).toBe(0);
    expect(result.current.filteredBoard).toStrictEqual([]);
  });
});
