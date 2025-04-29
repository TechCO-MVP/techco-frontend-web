"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

type StartFormDialogProps = {
  publicFormUrl?: string;
};

export const StartFormDialog: FC<Readonly<StartFormDialogProps>> = ({
  publicFormUrl,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button asChild variant="talentGreen">
          <span>
            <Plus /> Agregar Candidato
          </span>
        </Button>
      </DialogTrigger>

      <DialogTitle className="hidden">Agregar Candidato</DialogTitle>

      <DialogContent className="max-h-[80vh] min-h-[80vh] max-w-[70vw] overflow-y-auto">
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-white">
          {publicFormUrl && (
            <iframe
              id="start-form"
              className="h-full w-full"
              src={publicFormUrl}
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
