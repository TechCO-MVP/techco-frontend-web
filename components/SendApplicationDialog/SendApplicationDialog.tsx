"use client";

import { FC, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";
import { Dictionary } from "@/types/i18n";

type Props = {
  cardId: string;
  dictionary: Dictionary;
};

export const SendApplicationDialog: FC<Readonly<Props>> = ({
  cardId,
  dictionary,
}) => {
  const { positionOfferPage: i18n } = dictionary;

  const [open, setOpen] = useState(false);
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
    if (publicPhaseFormUrl) return;
    mutate({ cardId, enable: true });
  }, [publicPhaseFormUrl, cardId, mutate]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:bg-talent-green-600 mb-4 h-10 w-full max-w-md rounded-md bg-talent-green-500 text-white">
        {i18n.sendApplicationLabel}
      </DialogTrigger>

      <DialogTitle className="hidden">{i18n.sendApplicationLabel}</DialogTitle>

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
