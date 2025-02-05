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
import { cn } from "@/lib/utils";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Textarea } from "../ui/textarea";
import { type BoardState, Card as CardType } from "@/types";

interface CardProps {
  card: CardType;
  columnId: string;
  onCardMove: (draggedId: string, targetId: string) => void;
}
export const UserCard: React.FC<CardProps> = ({
  card,
  columnId,
  onCardMove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ ...card, columnId }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedCardData = e.dataTransfer.getData("text/plain");
    const draggedCard: CardType & { columnId: string } =
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
            Afinidad al cargo: 85%
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
              <AvatarImage
                src="https://picsum.photos/200/200"
                alt="Profile picture"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Badge
              variant="outline"
              className="rounded-md text-[#34C759] hover:bg-green-50"
            >
              Activa
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs">
                  <Flag className="h-4 w-4" /> CDMX - Mex 🇲🇽
                </span>
              </div>
              <Heading level={3} className="text-base">
                Sofia Cabrera London
              </Heading>
            </div>
            <div className="space-y-1">
              <Text type="p" className="text-xs text-gray-600">
                Training lead en Globant
              </Text>
              <Text size="xxs">Enero 2022 - Actual · 3 años</Text>
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
              12 años experiencia en sofware
            </Text>
            <div className="mb-2 flex items-center gap-2">
              <span>Contactar:</span>
              <Linkedin className="h-4 w-4" />
              <Mail className="h-4 w-4" />
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
                      Recomendado
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
                      2 Feb 2025
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
