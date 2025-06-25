"use client";

import { type FC, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  cardId: string;
  label: string;
};

export const CurrentPhaseFormDialog: FC<Readonly<Props>> = ({
  cardId,
  label,
}) => {
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
    if (!open || publicPhaseFormUrl) return;

    mutate({ cardId, enable: true });
  }, [open, mutate, cardId, publicPhaseFormUrl]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="mb-4 mt-4 h-10 max-w-md rounded-md border bg-talent-green-500 px-4 py-2 text-white hover:bg-talent-green-600">
        {label}
      </DialogTrigger>

      <DialogTitle className="hidden">{label}</DialogTitle>
      <DialogDescription className="hidden">{label}</DialogDescription>

      <DialogContent
        className={cn(`max-h-[80vh] min-h-[80vh] max-w-[70vw] overflow-y-auto`)}
      >
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-white">
          {isPending && (
            <Loader2 className="h-10 w-10 animate-spin text-talent-green-500" />
          )}
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
