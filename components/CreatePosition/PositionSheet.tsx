import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { PreviewContent } from "./PreviewContent";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

export const PositionSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-8">
          <Eye /> Previsualizar vacante
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[780px] p-0 sm:max-w-[780px]">
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-sm font-medium">
              Detalles de la oferta
            </SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="flex flex-col">
            <PreviewContent />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
