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
import { Textarea } from "../ui/textarea";
import {
  PipefyNode,
  PipefyFieldValues,
  PipefyPhase,
  PipefyPipe,
} from "@/types/pipefy";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { countryLabelLookup, formatDate } from "@/lib/utils";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { CandidateDetailsDialog } from "../CandidateDetailsDialog/CandidateDetailsDialog";
import { Dictionary } from "@/types/i18n";

interface CardProps {
  dictionary: Dictionary;
  card: PipefyNode;
  column: PipefyPhase;
  pipe: PipefyPipe;

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
}) => {
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
  const processStartDate =
    fieldMap[PipefyFieldValues.ProcessStartDate] || undefined;
  const candidateStatus =
    fieldMap[PipefyFieldValues.CandidateStatus] || "Activo";
  const candidateSource = fieldMap[PipefyFieldValues.CandidateSource];
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

  return (
    <Card
      draggable
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full max-w-[19rem] cursor-grab p-6 active:cursor-grabbing"
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
                <span className="sr-only">Open menu</span>
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
              <AvatarFallback>{candidateName.charAt(0)}</AvatarFallback>
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
      <div className="flex flex-col items-start justify-center">
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden"
          >
            <div className="min-w-64 space-y-4 border-t pt-4">
              <div>
                <div className="mb-2 flex gap-1">
                  <Text
                    type="span"
                    className="text-xs font-bold text-muted-foreground"
                  >
                    {i18n.candidateSource}:
                  </Text>
                  <Text type="span" className="text-xs">
                    {candidateSource}
                  </Text>
                </div>
                <div className="mb-2 flex gap-1">
                  <Text
                    type="span"
                    className="text-xs font-bold text-muted-foreground"
                  >
                    {i18n.processStartDate}:
                  </Text>
                  <Text type="span" className="text-xs">
                    {formatDate(processStartDate)}
                  </Text>
                </div>
                <div className="flex flex-col gap-2">
                  <Text className="text-foreground" size="xs">
                    {i18n.lastCandidateComment}
                  </Text>
                  <Textarea
                    disabled
                    className="resize-none"
                    placeholder="El aspirante demuestra un sólido entendimiento de los principios de desarrollo de software y posee..."
                  ></Textarea>
                </div>
              </div>

              <CandidateDetailsDialog
                i18n={i18n}
                pipe={pipe}
                card={card}
                phase={column}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};
