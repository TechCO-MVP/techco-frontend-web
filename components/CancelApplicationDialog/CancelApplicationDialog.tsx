"use client";

import { FC, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";
import { usePipefyCard } from "@/hooks/use-pipefy-card";
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";

type Props = {
  cardId: string;
};

export const CancelApplicationDialog: FC<Readonly<Props>> = ({ cardId }) => {
  const [open, setOpen] = useState(false);
  const { card } = usePipefyCard({ cardId });
  const { mutate: moveCardToPhase } = useMoveCardToPhase({
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
    if (!open || publicPhaseFormUrl) return;
    const finalPhase = card?.pipe.phases.find(
      (phase) => phase.name === "No está interesado",
    );
    console.log("finalPhase", finalPhase);
    if (!finalPhase) return;
    moveCardToPhase({ cardId, destinationPhaseId: finalPhase.id });
  }, [open, cardId, moveCardToPhase, publicPhaseFormUrl, card?.pipe.phases]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-mdpx-4 mb-4 h-10 w-full max-w-md bg-secondary py-2 text-secondary-foreground hover:bg-secondary/80">
        No continuar con el proceso
      </DialogTrigger>

      <DialogTitle className="hidden">Enviar mi aplicación</DialogTitle>

      <DialogContent className="max-h-[80vh] min-h-[80vh] max-w-[70vw] overflow-y-auto">
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-white">
          {publicPhaseFormUrl && !isPending && (
            <iframe
              id="start-form"
              className="h-full w-full"
              src={publicPhaseFormUrl}
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
