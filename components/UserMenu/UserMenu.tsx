import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, LogOut } from "lucide-react";
interface Props {
  username: string;
}

export const UserMenu: FC<Readonly<Props>> = ({ username }) => {
  return (
    <div className="flex items-center">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://picsum.photos/200/200" alt="@username" />
        <AvatarFallback>UN</AvatarFallback>
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
                <AvatarImage
                  src="https://picsum.photos/200/200"
                  alt="@username"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Username</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {username}
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
