"use client";

import { useState } from "react";
import {
  Flag,
  Linkedin,
  Mail,
  Minus,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
import { PipefyNode, PipefyFieldValues, PipefyPhase } from "@/types/pipefy";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { countryLabelLookup } from "@/lib/utils";
import { CountryLabel } from "../CountryLabel/CountryLabel";

interface CardProps {
  card: PipefyNode;
  column: PipefyPhase;

  onCardMove: (draggedId: string, targetId: string) => void;
  setDraggedCard: (
    card: { id: string; sourceColumn: PipefyPhase } | null,
  ) => void;
}
export const UserCard: React.FC<CardProps> = ({
  card,
  column,
  onCardMove,
  setDraggedCard,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fieldMap = PipefyBoardTransformer.mapFields(card.fields);

  const avatarUrl =
    fieldMap[PipefyFieldValues.Avatar] || "https://picsum.photos/200/200";
  const candidateName =
    fieldMap[PipefyFieldValues.CandidateName] || "Nombre Desconocido";
  const roleAlignment =
    fieldMap[PipefyFieldValues.RoleAlignment] || "Desconocido";
  const candidateCountry =
    fieldMap[PipefyFieldValues.CandidateCountry] || "Desconocido";
  const candidateCity =
    fieldMap[PipefyFieldValues.CandidateCityA] ||
    fieldMap[PipefyFieldValues.CandidateCityB] ||
    "Ciudad Desconocida";
  const currentPosition =
    fieldMap[PipefyFieldValues.CurrentPosition] || "Cargo Desconocido";
  const currentCompany =
    fieldMap[PipefyFieldValues.CurrentCompany] || "Empresa Desconocida";
  const yearsOfExperience =
    fieldMap[PipefyFieldValues.YearsOfExperience] || "Experiencia Desconocida";
  const processStartDate =
    fieldMap[PipefyFieldValues.ProcessStartDate] || "Fecha Desconocida";
  const candidateStatus =
    fieldMap[PipefyFieldValues.CandidateStatus] || "Estado Desconocido";
  const candidateSource =
    fieldMap[PipefyFieldValues.CandidateSource] || "Fuente Desconocida";
  const linkedinUrl = fieldMap[PipefyFieldValues.LinkedInURL] || "#";
  const email = fieldMap[PipefyFieldValues.CandidateEmail] || "#";
  const timeInPosition = fieldMap[PipefyFieldValues.TimeInPosition] || "#";

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ ...card, columnId: column.id }),
    );
    setDraggedCard({ id: card.id, sourceColumn: column });
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
        <div className="flex h-8 items-center justify-between">
          <Heading className="text-xs" level={2}>
            Afinidad al cargo: {roleAlignment}
          </Heading>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
              <DropdownMenuItem>Editar perfil</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Mover de Etapa</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Etapa 1</DropdownMenuItem>
                    <DropdownMenuItem>Etapa 2</DropdownMenuItem>
                    <DropdownMenuItem>Etapa 3</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>Eliminar candidato</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Cambiar de Estado
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Activo</DropdownMenuItem>
                    <DropdownMenuItem>Inactivo</DropdownMenuItem>
                    <DropdownMenuItem>Pendiente</DropdownMenuItem>
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
            <div className="space-y-1">
              <Text type="p" className="text-xs text-gray-600">
                {currentPosition} en {currentCompany}
              </Text>
              <Text size="xxs">{timeInPosition}</Text>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 overflow-hidden"
          >
            <Text size="small" className="font-bold text-muted-foreground">
              {yearsOfExperience}
            </Text>
            <div className="mb-2 flex items-center gap-2">
              <span>Contactar:</span>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
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
        )}
      </AnimatePresence>
      <div className="flex flex-col items-start justify-center">
        {!isExpanded && (
          <Button
            variant="secondary"
            className="h-8 w-full"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Plus />
            <span className="text-xs">Más información</span>
          </Button>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 overflow-hidden"
            >
              <div className="space-y-4 border-t pt-4">
                <div>
                  <div className="mb-2 flex gap-1">
                    <Text
                      type="span"
                      className="text-xs font-bold text-muted-foreground"
                    >
                      Origen del candidato:
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
                      Fecha de inicio de proceso:
                    </Text>
                    <Text type="span" className="text-xs">
                      {processStartDate}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Text size="xs">Comentario</Text>
                    <Textarea
                      className="resize-none"
                      placeholder="Escribe un comentario sobre este candidato "
                    ></Textarea>
                  </div>
                </div>
                {isExpanded && (
                  <Button
                    variant="secondary"
                    className="h-8 w-full"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <Minus />
                    <span>Menos información</span>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
