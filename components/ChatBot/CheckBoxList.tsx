"use client";

import { useTransition, useState, FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { sendResponse } from "@/actions"; // replace with your actual server action

type ChatCheckboxPromptProps = {
  message: string;
  options: string[];
};

export const CheckBoxList: FC<ChatCheckboxPromptProps> = ({
  message,
  options,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const handleSubmit = () => {
    startTransition(() => {
      sendResponse();
    });
  };

  return (
    <div className="space-y-6">
      <p>{message}</p>

      <div className="space-y-4">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selected.includes(option)}
              onCheckedChange={() => toggleOption(option)}
              disabled={isPending}
            />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={selected.length === 0 || isPending}
      >
        {isPending ? "Enviando..." : "Enviar respuestas"}
      </Button>
    </div>
  );
};
