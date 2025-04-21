import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MissingFieldsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleteFields: () => void;
  onCancel: () => void;
  pendingMove: {
    sourceColumnId?: string;
    cardId?: string;
  } | null;
  i18n: {
    missingFieldsDialogTitle: string;
    missingFieldsDialogInfo: string;
    completeMissingFieldsLabel: string;
    cancelMove: string;
  };
}

export const MissingFieldsDialog: React.FC<MissingFieldsDialogProps> = ({
  open,
  onOpenChange,
  onCompleteFields,
  onCancel,
  pendingMove,
  i18n,
}) => {
  const handleCompleteFields = () => {
    const element = document.querySelector(
      `#details-${pendingMove?.sourceColumnId}-${pendingMove?.cardId}`,
    ) as HTMLElement;

    if (element) {
      element.click();
      onCompleteFields();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[26rem] p-12">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl font-normal">
            {i18n.missingFieldsDialogTitle}
          </DialogTitle>
          <DialogDescription>{i18n.missingFieldsDialogInfo}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-10 flex flex-col gap-8 sm:flex-col">
          <Button onClick={handleCompleteFields} variant="default">
            {i18n.completeMissingFieldsLabel}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            {i18n.cancelMove}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
