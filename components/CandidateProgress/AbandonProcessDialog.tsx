"use client";

import { Dispatch, type FC, SetStateAction, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";
import { usePipefyCard } from "@/hooks/use-pipefy-card";
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";
import { cn } from "@/lib/utils";
import { Dictionary } from "@/types/i18n";
import { ABANDON_PROCESS_PHASE_NAME } from "@/constants";

type Props = {
  cardId: string;
  dictionary: Dictionary;
  setShouldRefetch: Dispatch<SetStateAction<boolean>>;
};

export const AbandonProcessDialog: FC<Readonly<Props>> = ({
  cardId,
  dictionary,
  setShouldRefetch,
}) => {
  const { positionOfferPage: i18n } = dictionary;
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { card } = usePipefyCard({ cardId });
  const { mutate: moveCardToPhase, isPending: isMovingCardToPhase } =
    useMoveCardToPhase({
      onSuccess(data) {
        console.log("[Success]", data);
        mutate({ cardId, enable: true });
      },
      onError(error) {
        console.log("[Error]", error);
      },
    });
  const [publicPhaseFormUrl, setPublicPhaseFormUrl] = useState("");
  const { mutate, isPending } = usePublicPhaseFormLink({
    onSuccess(data) {
      console.log("[Success]", data.configurePublicPhaseFormLink);
      setPublicPhaseFormUrl(data.configurePublicPhaseFormLink.url);
    },
    onError(error) {
      console.log("[Error]", error);
      setPublicPhaseFormUrl("");
    },
  });

  useEffect(() => {
    setShouldRefetch(!open);
    if (!open) {
      setConfirmed(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !confirmed || publicPhaseFormUrl) return;

    const finalPhase = card?.pipe.phases.find(
      (phase) => phase.name === ABANDON_PROCESS_PHASE_NAME,
    );

    if (!finalPhase) return;
    moveCardToPhase({ cardId, destinationPhaseId: finalPhase.id });
  }, [
    open,
    confirmed,
    cardId,
    moveCardToPhase,
    publicPhaseFormUrl,
    card?.pipe.phases,
  ]);

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="mb-4 mt-4 h-10 max-w-md rounded-md border border-talent-green-500 px-4 py-2 text-talent-green-500 hover:bg-secondary/80">
        {i18n.abandonProcessLabel}
      </DialogTrigger>

      <DialogTitle className="hidden">{i18n.abandonProcessLabel}</DialogTitle>
      <DialogDescription className="hidden">
        {i18n.abandonProcessLabel}
      </DialogDescription>

      <DialogContent
        className={cn(
          `overflow-y-auto`,
          confirmed && "max-h-[80vh] min-h-[80vh] max-w-[70vw]",
        )}
      >
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-white">
          {!confirmed ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="mb-6 text-gray-600">{i18n.confirmSkipMessage}</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {i18n.cancelLabel}
                </Button>
                <Button variant="destructive" onClick={handleConfirm}>
                  {i18n.confirmLabel}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {publicPhaseFormUrl && !isPending && !isMovingCardToPhase && (
                <iframe
                  id="start-form"
                  className="h-full w-full"
                  src={publicPhaseFormUrl}
                ></iframe>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
