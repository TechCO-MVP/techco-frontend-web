import {
  BoardState,
  PipefyCard,
  PipefyField,
  PipefyPipeResponse,
} from "@/types/pipefy";

export class PipefyBoardTransformer {
  private data: PipefyPipeResponse;

  constructor(data: PipefyPipeResponse) {
    this.data = data;
  }

  toBoardState(): BoardState {
    return {
      columns: this.data.pipe.phases.map((phase) => ({
        name: phase.name,
        id: phase.id,
        title: phase.name,
        cards_can_be_moved_to_phases: phase.cards_can_be_moved_to_phases,
        cards_count: phase.cards_count,
        cards: {
          nodes: phase.cards.nodes.map((node) => ({
            id: node.id,
            fields: node.fields.map((field) => ({
              indexName: field.indexName,
              name: field.name,
              value: field.value,
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
