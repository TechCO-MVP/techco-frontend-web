"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn, countryCodeLookup, countryNameLookup } from "@/lib/utils";
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

import { COUNTRIES } from "@/lib/data/countries";
import { Input } from "../ui/input";

export const LocationSelector = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [city, setCity] = useState("");
  const [countryName, setCountryName] = useState("");

  useEffect(() => {
    if (value) {
      const code = countryCodeLookup(value);
      const name = code ? countryNameLookup(code) : "";
      setCountryName(name ?? "");
    }
  }, [value]);
  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            {value
              ? COUNTRIES.find((country) => country.value === value)?.label
              : "Seleccionar país..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Buscar país..." className="h-9" />
            <CommandList>
              <CommandEmpty>País no encontrado.</CommandEmpty>
              <CommandGroup>
                {COUNTRIES.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {country.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === country.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        className="w-[250px] focus-visible:ring-0"
        placeholder="Ciudad"
        type="text"
        onChange={(e) => setCity(e.target.value)}
      />
      {city && countryName && (
        <span>
          📍 Ubicación: {city} /{countryName}
        </span>
      )}
    </div>
  );
};
