"use client";

import { FC, useEffect, useState } from "react";
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
import { Dictionary } from "@/types/i18n";

type Props = {
  onCityChange?: (city: string) => void;
  onCountryChange?: (country: string) => void;
  defaultCity?: string;
  defaultCountry?: string;
  dictionary: Dictionary;
};

export const LocationSelector: FC<Props> = ({
  onCityChange,
  onCountryChange,
  defaultCity,
  defaultCountry,
  dictionary,
}) => {
  const { createPositionPage: i18n } = dictionary;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [city, setCity] = useState("");
  const [countryName, setCountryName] = useState("");

  useEffect(() => {
    if (value) {
      const code = countryCodeLookup(value);
      const name = code ? countryNameLookup(code) : "";
      setCountryName(name ?? "");
      onCountryChange?.(code || "");
    }
  }, [value, onCountryChange]);

  useEffect(() => {
    onCityChange?.(city);
  }, [city, onCityChange]);

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
              : defaultCountry
                ? COUNTRIES.find(
                    (country) => country.code === defaultCountry.toLowerCase(),
                  )?.label
                : i18n.countryPlaceholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput
              placeholder={i18n.countrySearchPlaceholder}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>{i18n.countryNotFound}</CommandEmpty>
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
        defaultValue={defaultCity}
        className="w-[250px] focus-visible:ring-0"
        placeholder="Ciudad"
        type="text"
        onChange={(e) => setCity(e.target.value)}
      />
      {city && countryName && (
        <span>
          📍 {i18n.locationLabel}: {city} /{countryName}
        </span>
      )}
    </div>
  );
};
