import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MovePhaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  i18n: {
    moveToPhaseDialogTitle: string;
    moveToPhaseDialogInfo: string;
    confirmMove: string;
    cancelMove: string;
  };
}

export const MovePhaseDialog: React.FC<MovePhaseDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  i18n,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[26rem] p-12">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl font-normal">
            {i18n.moveToPhaseDialogTitle}
          </DialogTitle>
          <DialogDescription>{i18n.moveToPhaseDialogInfo}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-10 flex flex-col gap-8 sm:flex-col">
          <Button variant="default" onClick={onConfirm}>
            {i18n.confirmMove}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            {i18n.cancelMove}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
