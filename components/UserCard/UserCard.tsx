"use client";

import { Mail, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin } from "@/icons";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import {
  PipefyNode,
  PipefyFieldValues,
  PipefyPhase,
  PipefyPipe,
} from "@/types/pipefy";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { countryLabelLookup } from "@/lib/utils";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { CandidateDetailsDialog } from "../CandidateDetailsDialog/CandidateDetailsDialog";
import { Dictionary } from "@/types/i18n";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { selectNotificationsState } from "@/lib/store/features/notifications/notifications";
import { HiringPositionData } from "@/types";

interface CardProps {
  dictionary: Dictionary;
  card: PipefyNode;
  column: PipefyPhase;
  pipe: PipefyPipe;
  position?: HiringPositionData;
  onCardMove: (draggedId: string, targetId: string) => void;
  setDraggedCard: (
    card: { id: string; node: PipefyNode; sourceColumn: PipefyPhase } | null,
  ) => void;
}
export const UserCard: React.FC<CardProps> = ({
  card,
  column,
  onCardMove,
  setDraggedCard,
  pipe,
  dictionary,
  position,
}) => {
  const notificationsState = useAppSelector(selectNotificationsState);
  const { showCandidateDetails } = notificationsState;

  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { userCard: i18n } = dictionary;
  const fieldMap = PipefyBoardTransformer.mapFields(card.fields);
  const avatarUrl =
    fieldMap[PipefyFieldValues.Avatar] || "https://picsum.photos/200/200";
  const candidateName = fieldMap[PipefyFieldValues.CandidateName];
  const roleAlignment = fieldMap[PipefyFieldValues.RoleAlignment];
  const candidateCountry = fieldMap[PipefyFieldValues.CandidateCountry] || "CO";
  const candidateCity =
    fieldMap[PipefyFieldValues.CandidateCityA] ||
    fieldMap[PipefyFieldValues.CandidateCityB] ||
    "Bogotá";
  const currentPosition = fieldMap[PipefyFieldValues.CurrentPosition];
  const currentCompany = fieldMap[PipefyFieldValues.CurrentCompany];
  const yearsOfExperience = fieldMap[PipefyFieldValues.YearsOfExperience];
  const candidateStatus =
    fieldMap[PipefyFieldValues.CandidateStatus] || "Activo";
  const linkedinUrl = fieldMap[PipefyFieldValues.LinkedInURL] || "#";
  const email = fieldMap[PipefyFieldValues.CandidateEmail] || "#";

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ ...card, columnId: column.id }),
    );
    setDraggedCard({ id: card.id, node: card, sourceColumn: column });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedCard(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedCardData = e.dataTransfer.getData("text/plain");
    const draggedCard: PipefyNode & { columnId: string } =
      JSON.parse(draggedCardData);
    if (draggedCard.id !== card.id) {
      onCardMove(draggedCard.id, card.id);
    }
  };

  useEffect(() => {
    if (showCandidateDetails && showCandidateDetails.cardId === card.id) {
      console.log("[Notifications] showCandidateDetails", {
        showCandidateDetails,
        card,
      });
      setOpen(true);
    }
  }, [showCandidateDetails]);

  return (
    <Card
      ref={cardRef}
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.closest("#dialog-close")) return;
        if (open) return;
        setOpen(true);
      }}
      id={`details-${column.id}-${card.id}`}
      // draggable
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="mb-6 w-[19rem] cursor-pointer p-6"
    >
      <div>
        <div className="mb-4 flex h-8 items-center justify-between">
          <Badge className="rounded-md bg-secondary text-secondary-foreground hover:bg-secondary">
            {i18n.roleAlignment}: {roleAlignment}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-2 w-2">
                <MoreHorizontal className="h-2 w-2" />
                <span className="sr-only hidden">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {i18n.movePhase}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {column.cards_can_be_moved_to_phases.map((phase) => (
                      <DropdownMenuItem key={phase.id}>
                        {phase.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-2 flex gap-4">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl} alt="Profile picture" />
              <AvatarFallback>{candidateName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Badge
              variant="outline"
              className="rounded-md text-[#34C759] hover:bg-green-50"
            >
              {candidateStatus}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs">
                  {candidateCity}
                  &nbsp; -
                  <CountryLabel
                    code={candidateCountry}
                    label={countryLabelLookup(candidateCountry)}
                  />
                </span>
              </div>
              <Heading level={3} className="text-base">
                {candidateName}
              </Heading>
            </div>
            {currentPosition && (
              <div className="space-y-1">
                <Text type="p" className="text-xs text-gray-600">
                  {currentPosition} {i18n.inLabel} {currentCompany}
                </Text>
                <Text size="xxs">{yearsOfExperience}</Text>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-2 overflow-hidden"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="text-muted-foreground">{i18n.contactLabel}:</span>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin />
            </a>
            <a
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </AnimatePresence>

      <CandidateDetailsDialog
        open={open}
        setOpen={setOpen}
        dictionary={dictionary}
        pipe={pipe}
        card={card}
        position={position}
      />
    </Card>
  );
};
