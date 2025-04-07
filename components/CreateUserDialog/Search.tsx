"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

import { User } from "@/types";

interface SearchProps {
  placeholder: string;
  users: User[];
  setExistingUser: Dispatch<SetStateAction<User | undefined>>;
}

export const Search: FC<Readonly<SearchProps>> = ({
  placeholder,
  users,
  setExistingUser,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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
              ? users.find(
                  (user) => `${user.full_name}-${user.email}` === value,
                )?.full_name
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
                {users.map((user) => (
                  <CommandItem
                    key={user._id}
                    value={`${user.full_name}-${user.email}`}
                    onSelect={(currentValue) => {
                      setExistingUser(user);
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {user.full_name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === `${user.full_name}-${user.email}`
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
