import { BoardState, PipefyField, PipefyPipeResponse } from "@/types/pipefy";

export class PipefyBoardTransformer {
  private data: PipefyPipeResponse;

  constructor(data: PipefyPipeResponse) {
    this.data = data;
  }

  toBoardState(): BoardState {
    return {
      pipe: this.data.pipe,
      columns: this.data.pipe.phases.map((phase) => ({
        fieldConditions: phase.fieldConditions,
        name: phase.name,
        id: phase.id,
        title: phase.name,
        fields: phase.fields,
        cards_can_be_moved_to_phases: phase.cards_can_be_moved_to_phases,
        next_phase_ids: phase.next_phase_ids,
        previous_phase_ids: phase.previous_phase_ids,
        cards_count: phase.cards_count,
        cards: {
          nodes: phase.cards.nodes.map((node) => ({
            phases_history: node.phases_history,
            current_phase: node.current_phase,
            comments: node.comments,
            id: node.id,
            fields: node.fields.map((field) => ({
              id: field.id,
              type: field.type,
              label: field.label,
              indexName: field.indexName,
              name: field.name,
              value: field.value,
              filled_at: field.filled_at,
              phase_field: field.phase_field,
              field: field.field,
              internal_id: field.internal_id,
              options: field.options,
            })),
          })),
        },
      })),
    };
  }

  public static mapFields(fields: PipefyField[]): Record<string, string> {
    return fields.reduce(
      (acc, field) => {
        acc[field.indexName] = field.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}
