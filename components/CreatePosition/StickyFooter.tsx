import { FC } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface StickyFooterProps {
  canSave?: boolean;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  cancelLabel: string;
  saveLabel: string;
}

export const StickyFooter: FC<StickyFooterProps> = ({
  cancelLabel,
  saveLabel,
  onCancel,
  onSave,
  canSave,
  isSaving = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-end border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={onSave} disabled={isSaving || !canSave}>
          {isSaving && <Loader2 className="animate-spin" />}
          {saveLabel}
        </Button>
      </div>
    </div>
  );
};
