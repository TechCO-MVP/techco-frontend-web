"use client";

import { FC, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Dictionary } from "@/types/i18n";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useProfileFilterStartUrl } from "@/hooks/use-profile-filter-start-url";
import { PositionData } from "@/types";

type Props = {
  dictionary: Dictionary;
  positionData: PositionData;
};

export const SendPublicApplicationDialog: FC<Readonly<Props>> = ({
  dictionary,
  positionData,
}) => {
  const { positionOfferPage: i18n } = dictionary;
  const [formData, setFormData] = useState({
    email: "",
    linkedin: "",
  });
  const [complete, setComplete] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate, isPending } = useProfileFilterStartUrl({
    onSuccess(data) {
      console.log("[Success]", data.body);
      setComplete(true);
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });
  const [open, setOpen] = useState(false);
  const startProfileFilter = () => {
    mutate({
      position_id: positionData.position_id,
      business_id: positionData.business_id,
      email: formData.email,
      url_profiles: [formData.linkedin],
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:bg-talent-green-600 mb-4 h-10 w-full max-w-md rounded-md bg-talent-green-500 text-white">
        {i18n.iWantToApply}
      </DialogTrigger>

      <DialogTitle className="hidden">{i18n.sendApplicationLabel}</DialogTitle>

      <DialogContent className="overflow-y-auto p-12">
        <div className="flex w-full flex-col items-center justify-center gap-8 rounded-md bg-white">
          {complete ? (
            <h1 className="text-center text-xl font-bold text-talent-green-500">
              Gracias por tu interés en el rol {positionData.position_role}. En
              breve recibirás un correo con los siguientes pasos para continuar
              con tu postulación. Te deseamos muchos éxitos.
            </h1>
          ) : (
            <>
              <h1 className="text-center text-xl font-bold text-talent-green-500">
                Para iniciar tu postulación, por favor indícanos la URL de tu
                perfil de LinkedIn y tu correo electrónico.
              </h1>
              <form className="flex w-full flex-col items-center justify-center gap-4">
                <Input
                  className="focus-visible:ring-talent-green-500"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                />
                <Input
                  className="focus-visible:ring-talent-green-500"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  type="text"
                  placeholder="LinkedIn"
                />
                <Button
                  disabled={isPending || !formData.email || !formData.linkedin}
                  variant="talentGreen"
                  type="button"
                  onClick={startProfileFilter}
                  className="mx-auto mb-4 w-full max-w-[22rem]"
                >
                  Enviar{" "}
                  {isPending && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    className="mx-auto w-full max-w-[22rem]"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
