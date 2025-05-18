import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dictionary } from "@/types/i18n";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  dictionary: Dictionary;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  dictionary,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[26rem] p-12">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl font-normal">
            {dictionary.positionsPage.confirmDeleteDialogTitle}
          </DialogTitle>
          <DialogDescription>
            {dictionary.positionsPage.confirmDeleteDialogDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-10 flex flex-col gap-8 sm:flex-col">
          <Button
            variant="talentGreen"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {dictionary.positionsPage.confirmDeleteDialogConfirm}
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {dictionary.positionsPage.confirmDeleteDialogCancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
