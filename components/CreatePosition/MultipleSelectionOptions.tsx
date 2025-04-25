import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export const MultipleSelectionOptions = ({
  options,
  onSubmit,
  disabled = false,
}: {
  options: string[];
  onSubmit: (selected: string[]) => void;
  disabled?: boolean;
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const handleSubmit = () => {
    onSubmit(selected);
  };

  return (
    <div className="mt-4 space-y-2">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option}
            checked={selected.includes(option)}
            onCheckedChange={() => toggleOption(option)}
            disabled={disabled}
          />
          <Label htmlFor={option} className="text-sm">
            {option}
          </Label>
        </div>
      ))}

      <Button
        className="mt-2"
        onClick={handleSubmit}
        disabled={selected.length === 0 || disabled}
      >
        Enviar respuestas
      </Button>
    </div>
  );
};
