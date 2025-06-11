import { PositionPhaseSearchResult } from "@/types";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";

export const FirstInterviewResults = ({
  phase,
  candidateName,
}: {
  phase: PositionPhaseSearchResult | null;
  candidateName: string;
}) => {
  return (
    <div className="max-w-4xl bg-white p-6">
      <div className="mb-8">
        <div className="mb-4 flex flex-col gap-2">
          <Heading className="text-base font-bold" level={2}>
            {phase?.groupName}
          </Heading>
          <Heading className="text-sm font-bold" level={2}>
            ¡Cuéntanos cómo te fue con {candidateName}!
          </Heading>
          <Text className="text-sm text-[#090909]">
            ¿Cumplió tus expectativas y quieres que continúe al Assessment
            técnico? <br />
            Cuéntanos en el formulario de la derecha.
          </Text>
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <Heading className="text-sm font-bold" level={2}>
            Qué debes hacer:
          </Heading>
          <Text className="text-sm text-[#090909]">
            Apenas nos confirmes, le avisaremos que puede continuar con el
            Assessment técnico. ¡Así seguimos avanzando sin perder ritmo!
          </Text>
        </div>
      </div>
    </div>
  );
};
