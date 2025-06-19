import { describe, it, expect } from "vitest";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import {
  PipefyField,
  PipefyPipeResponse,
  PipefyFieldType,
} from "@/types/pipefy";

describe("PipefyBoardTransformer", () => {
  const mockData: PipefyPipeResponse = {
    pipe: {
      id: "pipe-1",
      name: "Test Pipe",
      organizationId: "org-123",
      cards_count: 1,
      startFormPhaseId: "start-phase-id",
      publicForm: {
        url: "https://example.com/form",
      },
      phases: [
        {
          id: "phase-1",
          name: "Phase One",
          cards_count: 1,
          fieldConditions: [],
          fields: [],
          cards_can_be_moved_to_phases: [],
          next_phase_ids: [],
          previous_phase_ids: [],
          cards: {
            nodes: [
              {
                id: "card-1",
                current_phase: {
                  id: "phase-1",
                  name: "Phase One",
                  cards_count: 0,
                  fieldConditions: [],
                  fields: [],
                  cards_can_be_moved_to_phases: [],
                  next_phase_ids: [],
                  previous_phase_ids: [],
                  cards: { nodes: [] },
                },
                comments: [],
                phases_history: [],
                fields: [
                  {
                    id: "field-1",
                    name: "candidate_name",
                    label: "Candidate Name",
                    type: "short_text" as PipefyFieldType,
                    value: "Alice",
                    indexName: "candidate_name",
                    options: [],
                    filled_at: new Date(),
                    required: true,
                    field: { type: "short_text" },
                    phase_field: {
                      internal_id: "pf-1",
                      required: true,
                      options: [],
                    },
                    internal_id: "int-1",
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };

  it("should correctly transform to board state", () => {
    const transformer = new PipefyBoardTransformer(mockData);
    const boardState = transformer.toBoardState();

    expect(boardState.pipe.name).toBe("Test Pipe");
    expect(boardState.columns.length).toBe(1);
    expect(boardState.columns[0].id).toBe("phase-1");

    const card = boardState.columns[0].cards.nodes[0];
    expect(card.fields[0].value).toBe("Alice");
    expect(card.fields[0].name).toBe("candidate_name");
  });

  it("should correctly map fields using mapFields", () => {
    const fields: PipefyField[] = [
      {
        id: "f1",
        name: "email",
        label: "Email",
        type: "email",
        value: "alice@example.com",
        indexName: "email",
        options: [],
        filled_at: new Date(),
        field: { type: "email" },
        internal_id: "int-1",
        phase_field: {
          internal_id: "pf-1",
          required: true,
          options: [],
        },
      },
      {
        id: "f2",
        name: "role",
        label: "Role",
        type: "short_text",
        value: "Engineer",
        indexName: "role",
        options: [],
        filled_at: new Date(),
        field: { type: "short_text" },
        internal_id: "int-2",
        phase_field: {
          internal_id: "pf-2",
          required: true,
          options: [],
        },
      },
    ];

    const mapped = PipefyBoardTransformer.mapFields(fields);

    expect(mapped).toEqual({
      email: "alice@example.com",
      role: "Engineer",
    });
  });
});
