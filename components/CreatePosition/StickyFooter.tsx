import { FC } from "react";
import { Button } from "../ui/button";

interface StickyFooterProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const StickyFooter: FC<StickyFooterProps> = ({
  onCancel,
  onSave,
  isSaving = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-end border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
