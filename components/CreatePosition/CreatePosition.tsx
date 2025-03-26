"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import {
  BrainCog,
  ChevronLeft,
  Copy,
  Eye,
  Pencil,
  Save,
  SendHorizonal,
} from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Step, Stepper } from "./Stepper";
import { OptionCard } from "./OptionCard";
import { Input } from "../ui/input";
import { Preview } from "./Preview";
import { PreviewDialog } from "./PreviewDialog";
type CreatePositionProps = {
  dictionary: Dictionary;
};

export const CreatePosition: FC<Readonly<CreatePositionProps>> = ({
  dictionary,
}) => {
  const params = useParams<{ lang: Locale }>();
  const [showPreview, setShowPreview] = useState(false);
  const { lang } = params;
  const { createPositionPage: i18n } = dictionary;
  const [steps, setSteps] = useState<Step[]>([
    {
      title: i18n.descriptionStep,
      status: "complete",
    },
    {
      title: i18n.initialTestStep,
      status: "pending",
    },
    {
      title: i18n.softSkillsStep,
      status: "pending",
    },
    {
      title: i18n.technicalSkillsStep,
      status: "skipped",
    },
    {
      title: i18n.publishedStep,
      status: "pending",
    },
  ]);

  return <Preview />;
  return (
    <div className="flex w-full flex-col px-8 py-6">
      <div className="relative flex flex-col gap-2">
        <Link href={`/${lang}/dashboard/positions`} replace>
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.goBack}
          </Button>
        </Link>
        <Heading className="text-2xl" level={1}>
          {i18n.pageTitle}
        </Heading>
        <Text className="text-sm text-muted-foreground" type="p">
          {i18n.pageDescription}
        </Text>
        <div className="mt-4 h-[1px] w-full bg-gray-200"></div>
      </div>
      <div className="mx-auto flex w-fit flex-col gap-7 px-10 py-12 shadow-md">
        <Heading level={2} className="text-2xl font-semibold">
          {i18n.progessTitle}
        </Heading>
        <Stepper steps={steps} setSteps={setSteps} i18n={i18n} />
      </div>
      {true && (
        <div className="mx-auto flex w-fit flex-col gap-10">
          <div className="mx-auto flex w-fit min-w-[60rem] justify-end gap-8 rounded-md bg-[#7676801F] p-4">
            <Button className="h-8">
              <Save /> Guardar borrador
            </Button>
            <Button onClick={() => setShowPreview(true)} className="h-8">
              <Eye /> Previsualizar vacante
            </Button>
          </div>
          {/* Chat */}
          <div className="flex flex-col gap-3">
            {/* System Message */}
            <p className="max-w-[475px] text-sm leading-5 text-muted-foreground">
              👋 ¡Hola! Estoy aquí para ayudarte a crear la vacante perfecta.
              Para empezar, dime:Para empezar, dime: ¿Cuál es el nombre del
              cargo que estás buscando?
            </p>
            {/* User Message */}
            <div className="max-w-[475px] place-self-end rounded-md bg-[#7676801F] p-6">
              <p className="leadin-5 text-sm font-bold text-muted-foreground">
                Necesito un desarrollador Backend
              </p>
            </div>

            {/* System Message */}
            <p className="max-w-[475px] text-sm leading-5 text-muted-foreground">
              ¡Genial! Para hacer la descripción más precisa, ¿quieres enfocarte
              en algún lenguaje o tecnología en particular? 🔹 Ejemplo: Node.js,
              Python, Java, SQL, etc.
            </p>

            {/* User Message */}
            <div className="max-w-[475px] place-self-end rounded-md bg-[#7676801F] p-6">
              <p className="leadin-5 text-sm font-bold text-muted-foreground">
                Sí, necesito experiencia en Node.js y bases de datos SQL.
              </p>
            </div>

            {/* System Message */}
            <p className="max-w-[475px] text-sm leading-5 text-muted-foreground">
               ¡Perfecto! Con esta información, estoy generando una descripción
              inicial. ¿Te gustaría agregar alguna habilidad blanda clave para
              este cargo? Ejemplo: Trabajo en equipo, resolución de problemas,
              liderazgo técnico.
            </p>

            <div className="relative">
              <Input
                className="mt-10 h-14 rounded-md border-none bg-[#F7F9FB] focus-visible:ring-gray-500"
                placeholder="Type message"
              />
              <SendHorizonal className="absolute bottom-4 right-4 h-5 w-5 cursor-pointer text-[#9fa1a2] hover:text-foreground" />
            </div>
          </div>
        </div>
      )}
      <div className="mt-14 flex justify-center gap-8">
        <OptionCard
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.createWithAi}
          description={i18n.createWithAiDescription}
          details={i18n.createWithAiDetails}
          icon={<BrainCog className="h-10 w-10" />}
        />

        <OptionCard
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.createManually}
          description={i18n.createManuallyDescription}
          details={i18n.createManuallyDetails}
          icon={<Pencil className="h-10 w-10" />}
        />

        <OptionCard
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.copyPrevious}
          description={i18n.copyPreviousDescription}
          details={i18n.copyPreviousDetails}
          icon={<Copy className="h-10 w-10" />}
        />
        <PreviewDialog
          dictionary={dictionary}
          open={showPreview}
          setOpen={setShowPreview}
        />
      </div>
    </div>
  );
};
