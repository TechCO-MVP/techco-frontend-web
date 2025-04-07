"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { HiringPositionData } from "@/types";

interface SearchProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  positions: HiringPositionData[];
}

export const Search: FC<Readonly<SearchProps>> = ({
  value,
  setValue,
  placeholder,
  positions,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[350px] max-w-[18rem] justify-between shadow-sm"
          >
            {value
              ? positions.find((position) => position.role === value)?.role
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder={placeholder} className="h-9" />
            <CommandList>
              <CommandEmpty>Sin resultados.</CommandEmpty>
              <CommandGroup>
                {positions.map((position) => (
                  <CommandItem
                    key={position._id}
                    value={position.role}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {position.role}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === position.role ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <button onClick={() => setValue("")}>
          <X className="w-4" />
        </button>
      )}
    </div>
  );
};
