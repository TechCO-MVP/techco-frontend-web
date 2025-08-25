"use client";

import { FC, useState, useRef } from "react";

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
import { useProfileFilterStartCv } from "@/hooks/use-profile-filter-start-cv";
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
  const [applicationMethod, setApplicationMethod] = useState<'linkedin' | 'cv'>('cv');
  const [formData, setFormData] = useState({
    email: "",
    linkedin: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [complete, setComplete] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate: mutateUrl, isPending: isPendingUrl } = useProfileFilterStartUrl({
    onSuccess(data) {
      console.log("[Success LinkedIn]", data.body);
      setComplete(true);
    },
    onError(error) {
      console.log("[Error LinkedIn]", error);
    },
  });

  const { mutate: mutateCv, isPending: isPendingCv } = useProfileFilterStartCv({
    onSuccess(data) {
      console.log("[Success CV]", data.body);
      setComplete(true);
    },
    onError(error) {
      console.log("[Error CV]", error);
    },
  });
  const [open, setOpen] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      if (file) {
        alert('Solo se permiten archivos PDF');
      }
    }
  };

  const startProfileFilter = () => {
    if (applicationMethod === 'linkedin') {
      mutateUrl({
        position_id: positionData.position_entity._id,
        business_id: positionData.business_id,
        url_profiles: [
          {
            email: formData.email,
            url: formData.linkedin,
          },
        ],
      });
    } else {
      if (!selectedFile) return;
      mutateCv({
        position_id: positionData.position_entity._id,
        business_id: positionData.business_id,
        file: selectedFile,
        email: formData.email,
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="mb-4 h-10 w-full max-w-md rounded-md bg-talent-green-500 text-white hover:bg-talent-green-600">
        {i18n.iWantToApply}
      </DialogTrigger>

      <DialogTitle className="hidden">{i18n.sendApplicationLabel}</DialogTitle>

      <DialogContent className="overflow-y-auto p-12">
        <div className="flex w-full flex-col items-center justify-center gap-8 rounded-md bg-white">
          {complete ? (
            <h1 className="text-center text-xl font-bold text-talent-green-500">
              Gracias por tu interés en el rol{" "}
              {positionData.position_entity.role}. En breve recibirás un correo
              con los siguientes pasos para continuar con tu postulación. Te
              deseamos muchos éxitos.
            </h1>
          ) : (
            <>
              <h1 className="text-center text-xl font-bold text-talent-green-500">
                ¿Cómo quieres postularte?
              </h1>
              <p className="text-center text-gray-600">
                Elige lo que mejor te represente:
                tu LinkedIn o tu hoja de vida.
              </p>
              
              {/* Application Method Tabs */}
              <div className="flex w-full max-w-md gap-1 rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setApplicationMethod('cv')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    applicationMethod === 'cv'
                      ? 'bg-white text-talent-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hoja de vida
                </button>
                <button
                  type="button"
                  onClick={() => setApplicationMethod('linkedin')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    applicationMethod === 'linkedin'
                      ? 'bg-white text-talent-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  LinkedIn
                </button>
              </div>

              <form className="flex w-full flex-col items-center justify-center gap-4">
                <Input
                  className="focus-visible:ring-talent-green-500"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                />
                
                <div className="min-h-[120px] w-full">
                  {applicationMethod === 'linkedin' ? (
                    <>
                      <Input
                        className="focus-visible:ring-talent-green-500"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        type="text"
                        placeholder="LinkedIn"
                      />
                      <p className="mt-4 text-sm text-gray-500">
                        Por favor, asegúrate de que tu URL siga esta estructura:{" "}
                        <b className="text-talent-green-500">
                          https://www.linkedin.com/...
                        </b>
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-full">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="cv-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-2 border-dashed border-gray-300 hover:border-talent-green-500 hover:bg-talent-green-50"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {selectedFile ? selectedFile.name : 'Adjuntar hoja de vida'}
                        </Button>
                        <p className="mt-4 text-sm text-gray-500">
                          Solo se permiten archivos PDF
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <Button
                  disabled={
                    (isPendingUrl || isPendingCv) ||
                    !formData.email ||
                    (applicationMethod === 'linkedin' && !formData.linkedin) ||
                    (applicationMethod === 'cv' && !selectedFile)
                  }
                  variant="talentGreen"
                  type="button"
                  onClick={startProfileFilter}
                  className="mx-auto mb-4 w-full max-w-[22rem]"
                >
                  Enviar{" "}
                  {(isPendingUrl || isPendingCv) && (
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
