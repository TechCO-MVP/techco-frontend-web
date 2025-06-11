"use client";
import { PositionData } from "@/types";
import { Dictionary } from "@/types/i18n";
import Image from "next/image";
import { countryNameLookup } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { CancelApplicationDialog } from "../CancelApplicationDialog/CancelApplicationDialog";
import { usePipefyCard } from "@/hooks/use-pipefy-card";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { CandidateSources, PipefyFieldValues } from "@/types/pipefy";
import LoadingSkeleton from "./Skeleton";

interface PositionDetailsPageProps {
  positionData: PositionData;
  dictionary: Dictionary;
  company_name: string;
  vacancy_name: string;
  token: string;
}

export const PositionDetailsPage = ({
  positionData,
  dictionary,
  company_name,
  vacancy_name,
  token,
}: PositionDetailsPageProps) => {
  const { positionOfferPage: i18n } = dictionary;
  const { card, isLoading } = usePipefyCard({
    cardId: positionData.hiring_card_id,
  });
  const fieldMap = PipefyBoardTransformer.mapFields(card?.fields || []);
  const candidateSource = fieldMap[PipefyFieldValues.CandidateSource];
  const linkedinSource = candidateSource === CandidateSources.LinkedIn;
  if (isLoading) return <LoadingSkeleton />;
  return (
    <div className="relative flex h-full min-h-screen items-center justify-center bg-gray-50">
      <div
        className="min-h-100vh flex h-full min-h-screen w-full flex-col justify-center bg-gray-50"
        style={{
          backgroundImage: "url('/assets/background.jpeg')",
          backgroundBlendMode: "lighten",
          backgroundColor: "rgba(255,255,255,0.8)",
        }}
      >
        <div className="mx-auto flex h-[85vh] w-[85vw] flex-col items-center justify-center bg-white px-4 py-12 text-center">
          <div className="mb-8">
            <Image
              src="/assets/talent_connect.svg"
              alt={company_name}
              width={64}
              height={64}
              className="mx-auto"
            />
          </div>

          <div className="mb-6 space-y-1 text-sm text-muted-foreground">
            <p className="uppercase tracking-wide">
              <span>{positionData.position_city}</span>
              <span className="mx-2">•</span>
              <span>{countryNameLookup(positionData.position_country)}</span>
              <span className="mx-2">•</span>
              <span>{positionData.position_work_mode}</span>
              <span className="mx-2">•</span>
              <span>{positionData.business_name}</span>
            </p>
          </div>

          <h1 className="mb-6 text-4xl font-bold capitalize md:text-5xl">
            {positionData.position_role}
          </h1>

          <p className="mb-6 text-xl">
            ¡{positionData.hiring_profile_name}, {i18n.joinOurTeam}!
          </p>

          <p className="mb-8 max-w-prose text-muted-foreground">
            {positionData.business_description}
          </p>

          <Button
            className="mb-4 w-full max-w-md"
            size="lg"
            variant="talentGreen"
          >
            <Link
              href={{
                pathname: linkedinSource
                  ? `${vacancy_name}/details`
                  : `${vacancy_name}/form`,
                query: { token },
              }}
            >
              {i18n.applyLabel}
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground">
            {i18n.responseTimeInfo}
          </p>
          <CancelApplicationDialog
            dictionary={dictionary}
            cardId={positionData.hiring_card_id}
          />
        </div>
      </div>
    </div>
  );
};
