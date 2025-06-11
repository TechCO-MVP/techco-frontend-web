"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, Loader2, Save, SendHorizonal } from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Step, Stepper } from "./Stepper";
import { Input } from "../ui/input";
import LoadingSkeleton from "./ChatSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { PositionSheet } from "./PositionSheet";
import { useWebSocket } from "@/hooks/use-websocket";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { useMessageHistory } from "@/hooks/use-message-history";
import {
  BotMessagePayload,
  BotResponseTypes,
  DraftPositionData,
  PositionConfigurationPhaseTypes,
  WebSocketMessagePayload,
} from "@/types";
import { useUpdatePositionConfiguration } from "@/hooks/use-update-position-configuration";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";
import { useBusinesses } from "@/hooks/use-businesses";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { cn, isPositionDescriptionComplete } from "@/lib/utils";

type CreateWithAIProps = {
  dictionary: Dictionary;
};

export const CreateDescriptionWithAI: FC<Readonly<CreateWithAIProps>> = ({
  dictionary,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const params = useParams<{
    lang: Locale;
    id: string;
    position_id: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lang, position_id, id } = params;
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState<BotMessagePayload[]>([]);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [animatedMessage, setAnimatedMessage] = useState<string | null>(null);
  const [positionProgress, setPositionProgrss] =
    useState<DraftPositionData | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const {
    rootBusiness,
    businesses,
    isLoading: loadingBusiness,
  } = useBusinesses();
  const currentBusiness = useMemo(() => {
    return businesses.find((b) => b._id === id);
  }, [id, businesses]);

  const { currentUser } = useCurrentUser();
  const { localUser, isLoading: loadingUsers } = useUsers({
    businessId: rootBusiness?._id,
    email: currentUser?.email,
  });

  const onNewMessage = (data: WebSocketMessagePayload) => {
    console.log(
      "%c[Debug] newMessage",
      "background-color: teal; font-size: 20px; color: white",
      data,
    );
    if (!data.payload) return;
    if (!("response_type" in data.payload)) return;

    const { action, payload } = data;
    if (!payload || action !== "chat_message") return;
    const newUserMessage: BotMessagePayload = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      message: payload.message,
      response_type: payload.response_type,
      phase_type: payload.phase_type,
      position_configuration_id: payload.position_configuration_id,
      thread_id: payload.thread_id,
      business_id: payload.business_id,
      options: payload.options,
    };
    if (payload.position) setPositionProgrss(payload.position);
    if (payload.response_type === BotResponseTypes.FINAL_CONFIRMATION)
      setIsCompleted(true);
    setLiveMessages((prev) => [...prev, newUserMessage]);

    setWaitingResponse(false);
  };

  const { sendMessage } = useWebSocket(null, onNewMessage);

  const { data: positionConfiguration, isLoading: loadingConfiguration } =
    usePositionConfigurations({
      id: position_id,
      businessId: id,
    });

  const { createPositionPage: i18n } = dictionary;
  const [steps, setSteps] = useState<Step[]>([]);

  const currentPosition = useMemo(() => {
    return positionConfiguration?.body.data.find(
      (position) => position._id === position_id,
    );
  }, [positionConfiguration, position_id]);

  const currentPhase = useMemo(() => {
    return currentPosition?.phases.find(
      (phase) => phase.type === PositionConfigurationPhaseTypes.DESCRIPTION,
    );
  }, [currentPosition]);

  const { messages, isLoading } = useMessageHistory({
    threadId: currentPhase?.thread_id,
  });

  useEffect(() => {
    if (currentPosition) {
      setSteps(
        currentPosition.phases.map((phase) => ({
          title: phase.name,
          status: phase.status,
          type: phase.type,
        })),
      );
    }
  }, [currentPosition]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const container = messageRef.current;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    }
  }, [isLoading, messages]);

  const onSendMessage = (msg?: string) => {
    if (isLoading || !currentPhase) return;
    const newUserMessage: BotMessagePayload = {
      id: `msg_${Date.now()}`,
      role: "user",
      message: msg ? msg : message,
      response_type: BotResponseTypes.OPEN_QUESTION,
      phase_type: currentPhase?.type,
      position_configuration_id: position_id,
      thread_id: currentPhase?.thread_id,
      business_id: id,
    };

    setLiveMessages((prev) => [...prev, newUserMessage]);
    sendMessage({
      action: "chat_message",
      payload: {
        phase_type: currentPhase?.type,
        thread_id: currentPhase?.thread_id,
        position_configuration_id: position_id,
        business_id: id,
        message: msg ? msg : message,
      },
    });
    setMessage("");

    setWaitingResponse(true);
  };

  useEffect(() => {
    const last = liveMessages[liveMessages.length - 1];
    if (!last || last.role !== "assistant") return;

    const fullText = last.message;

    let index = 0;
    setAnimatedMessage("");

    const interval = setInterval(() => {
      index++;
      setAnimatedMessage(fullText.slice(0, index));
      if (index >= fullText.length) clearInterval(interval);
    }, 5);

    return () => clearInterval(interval);
  }, [liveMessages]);

  useEffect(() => {
    if (!positionProgress) return;
    if (isPositionDescriptionComplete(positionProgress)) {
      setIsCompleted(true);
    }
  }, [positionProgress]);

  useEffect(() => {
    if (positionProgress) return;
    const msg = messages.filter((msg) => msg.role === "assistant").pop();
    if (!msg) return;

    const raw = msg.content?.[0]?.text?.value;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.position) {
        setPositionProgrss(parsed.position as DraftPositionData);
      }
      if (parsed?.response_type === BotResponseTypes.FINAL_CONFIRMATION) {
        setIsCompleted(true);
      }
    } catch {}
  }, [messages, positionProgress]);

  const { mutate: saveDraft, isPending } = useUpdatePositionConfiguration({
    onSuccess: (data) => {
      console.info("Save Draft success", data);
      toast({
        description: i18n.draftSavedMessage,
      });
      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
      if (isCompleted) {
        router.push(
          `/${lang}/dashboard/companies/${id}/position-configuration/${position_id}/description/preview`,
        );
      } else {
        router.push(
          `/${lang}/dashboard/positions?tab=drafts&business_id=${id}&position_id=${position_id}`,
        );
      }
    },
    onError: (error) => {
      console.error("Save Draft error", error);
    },
  });

  const onSaveDraft = () => {
    if (!localUser || !currentPhase || !currentPhase.thread_id) return;
    if (!currentPosition) return;
    setDialogOpen(false);
    saveDraft({
      ...currentPosition,
      phases:
        currentPosition?.phases.map((phase) =>
          phase.name === currentPhase?.name
            ? {
                ...phase,
                data: positionProgress,
              }
            : phase,
        ) ?? [],
    });
  };

  if (isLoading || loadingBusiness || loadingUsers || loadingConfiguration)
    return <LoadingSkeleton />;

  return (
    <div className="flex w-full flex-col px-8 py-6">
      <div className="relative flex flex-col gap-2">
        <Link
          href={`/${lang}/dashboard/positions?tab=drafts&business_id=${id}`}
          replace
        >
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.exit}
          </Button>
        </Link>
      </div>
      <div className="mx-auto flex w-fit min-w-[60rem] flex-col gap-7 px-10 py-2 shadow-md">
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="progress" className="border-none">
            <AccordionTrigger className="flex justify-end hover:no-underline">
              {i18n.showProgress}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <Heading level={2} className="text-2xl font-semibold">
                {i18n.progessTitle}
              </Heading>
              <Stepper
                phase={PositionConfigurationPhaseTypes.DESCRIPTION}
                steps={steps}
                setSteps={setSteps}
                i18n={i18n}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mx-auto flex h-full w-fit flex-col gap-10">
        <div className="mx-auto flex w-fit min-w-[60rem] justify-end gap-8 rounded-md bg-[#7676801F] p-4">
          <Button
            disabled={!positionProgress?.role || isPending}
            onClick={() => setDialogOpen(true)}
            className={cn(
              "h-8 bg-talent-green-500 hover:bg-talent-green-600",
              isCompleted && "bg-talent-orange-500 hover:bg-talent-orange-600",
            )}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Save />}
            {isCompleted ? i18n.finishBtnLabel : i18n.saveDraftBtnLabel}
          </Button>
          <PositionSheet
            business={currentBusiness}
            positionData={positionProgress}
            dictionary={dictionary}
          />
        </div>
        <div
          ref={messageRef}
          className="flex h-full max-h-[50vh] flex-col gap-3 overflow-y-auto"
        >
          {messages.map((msg) => {
            const isAssistant = msg.role === "assistant";
            const content = msg.content?.[0]?.text?.value;
            let parsedMessage = content;

            try {
              const parsed = JSON.parse(content || "");
              parsedMessage = parsed.message || content;
            } catch {
              // If it's plain text or JSON fails, we fall back to raw value
            }

            return (
              <Fragment key={msg.id}>
                {isAssistant ? (
                  <div className="max-w-[475px] text-sm leading-5 text-muted-foreground">
                    <p className="mb-2">{parsedMessage}</p>

                    {/* {(!waitingResponse &&
                      msg.id === firstMessageId &&
                      responseType) === "UNIQUE_SELECTION" &&
                      options.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {options.map((option) => (
                            <button
                              onClick={() => onSendMessage(option)}
                              key={option}
                              className="rounded-md border border-muted px-3 py-1 text-sm hover:bg-muted"
                            >
                              {cleanOption(option)}
                            </button>
                          ))}
                        </div>
                      )}

                    {responseType === "MULTIPLE_SELECTION" &&
                      options.length > 0 && (
                        <MultipleSelectionOptions
                          disabled={
                            msg.id !== firstMessageId || waitingResponse
                          }
                          options={options}
                          onSubmit={(selected) => {
                            onSendMessage(selected.toString());
                          }}
                        />
                      )} */}
                  </div>
                ) : (
                  <div className="max-w-[475px] place-self-end rounded-md bg-[#7676801F] p-6">
                    <p className="text-sm font-bold leading-5 text-muted-foreground">
                      {parsedMessage}
                    </p>
                  </div>
                )}
              </Fragment>
            );
          })}
          {liveMessages.map((msg, i) => {
            const isAssistant = msg.role === "assistant";
            const isLastAssistant =
              msg.role === "assistant" && i === liveMessages.length - 1;
            const text = msg.message;

            return (
              <Fragment key={msg.id}>
                {isAssistant ? (
                  <div className="max-w-[475px] text-sm leading-5 text-muted-foreground">
                    <p className="mb-2">
                      {isLastAssistant ? animatedMessage : text}
                    </p>
                  </div>
                ) : (
                  <div className="max-w-[475px] place-self-end rounded-md bg-[#7676801F] p-6">
                    <p className="text-sm font-bold leading-5 text-muted-foreground">
                      {text}
                    </p>
                  </div>
                )}
              </Fragment>
            );
          })}

          <div className="relative mt-auto">
            <Input
              onKeyUp={(e) => {
                if (e.key === "Enter") onSendMessage();
              }}
              value={message}
              disabled={waitingResponse || isLoading}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-10 h-14 rounded-md border-none bg-[#F7F9FB] pr-10 focus-visible:ring-0"
              placeholder="Type message"
            />
            {waitingResponse ? (
              <Loader2 className="absolute bottom-4 right-4 h-5 w-5 animate-spin cursor-not-allowed text-[#9fa1a2]" />
            ) : (
              <SendHorizonal
                onClick={() => onSendMessage()}
                className="absolute bottom-4 right-4 h-5 w-5 cursor-pointer text-[#9fa1a2] hover:text-foreground"
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.saveDraftTitle}</DialogTitle>
            <DialogDescription>{i18n.saveDraftDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {i18n.saveDraftCancel}
            </Button>
            <Button variant="talentGreen" onClick={onSaveDraft}>
              {i18n.saveDraftConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
