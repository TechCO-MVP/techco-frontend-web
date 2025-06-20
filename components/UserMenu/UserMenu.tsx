"use client";
import { FC, useTransition } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Loader2, LogOut } from "lucide-react";
import * as actions from "@/actions";
import { Locale } from "@/i18n-config";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Props {
  lang: Locale;
}

export const UserMenu: FC<Readonly<Props>> = ({ lang }) => {
  const { currentUser } = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append("lang", lang);
      actions.signOut(formData);
    });
  };

  return (
    <div className="flex items-center">
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {currentUser?.name
            ? currentUser?.name.slice(0, 2).toUpperCase()
            : "UN"}
        </AvatarFallback>
      </Avatar>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-1 h-8 w-8">
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Open user menu</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {currentUser?.name
                    ? currentUser?.name.slice(0, 2).toUpperCase()
                    : "UN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser?.name}
                </p>
                <p
                  title={currentUser?.email}
                  className="max-w-[140px] overflow-hidden truncate whitespace-nowrap text-xs leading-none text-muted-foreground"
                >
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <form onSubmit={handleSignOut}>
                <input type="hidden" name="lang" value={lang} />

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-600"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
