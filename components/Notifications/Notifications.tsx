"use client";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "../ui/badge";
import { useEffect, useMemo, useState } from "react";

import { useGetNotifications } from "@/hooks/use-get-notifications";
import { NotificationItem } from "./NotificationItem";
import { useUpdateNotification } from "@/hooks/use-update-notification";

interface NotificationsProps {
  label: string;
}

export function Notifications({ label }: NotificationsProps) {
  const { notifications, isLoading } = useGetNotifications();
  const [toMarkRead, setToMarkRead] = useState<string[]>([]);
  const { mutate } = useUpdateNotification({
    onSuccess: () => {
      console.log(
        "%c[Debug] sucess",
        "background-color: teal; font-size: 20px; color: white",
      );
    },
    onError: () => {
      console.log(
        "%c[Debug] error",
        "background-color: teal; font-size: 20px; color: white",
      );
    },
  });

  const [open, setOpen] = useState(false);
  const count = useMemo(
    () =>
      notifications?.reduce(
        (acc, n) => (n.status === "NEW" || n.status === "READ" ? acc + 1 : acc),
        0,
      ) ?? 0,
    [notifications],
  );

  useEffect(() => {
    console.log(
      "%c[Debug] ",
      "background-color: teal; font-size: 20px; color: white",
      {
        open,
        toMarkRead,
      },
    );
    if (!open && toMarkRead.length > 0) {
      mutate({
        notification_ids: toMarkRead,
        status: "READ",
      });
    }
  }, [open, toMarkRead]);

  const markAsRead = (id: string) => {
    setToMarkRead((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  if (isLoading)
    return (
      <div className="flex gap-1">
        <div className="h-5 w-[100px] rounded bg-gray-200"></div>
        <div className="h-5 w-5 rounded-full bg-gray-200"></div>
      </div>
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className="flex cursor-pointer items-center justify-center gap-1">
          {label} <Badge>{count}</Badge>
        </span>
      </SheetTrigger>
      <SheetContent className="w-full p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {label}
            </SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="flex flex-col">
            {notifications?.map((notification) => (
              <NotificationItem
                markAsRead={markAsRead}
                setOpen={setOpen}
                key={notification._id}
                notification={notification}
              />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
