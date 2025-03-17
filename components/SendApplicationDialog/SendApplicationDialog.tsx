"use client";

import { FC, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";

type Props = {
  cardId: string;
};

export const SendApplicationDialog: FC<Readonly<Props>> = ({ cardId }) => {
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
    console.log("mount");
    if (publicPhaseFormUrl) return;
    mutate({ cardId, enable: true });
  }, [publicPhaseFormUrl, cardId, mutate]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="mb-4 h-10 w-full max-w-md rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">
        Enviar mi aplicación
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
