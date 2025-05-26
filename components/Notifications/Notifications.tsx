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
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HiringPositionData, PhaseType, NotificationType } from "@/types";
import { Dictionary } from "@/types/i18n";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n-config";

interface NotificationsProps {
  dictionary: Dictionary;
  positions: HiringPositionData[];
  businessId?: string;
}

export function Notifications({
  dictionary,
  positions,
  businessId,
}: NotificationsProps) {
  const { notifications: i18n } = dictionary;
  const { notifications, isLoading } = useGetNotifications();
  const [toMarkRead, setToMarkRead] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const params = useParams<{
    lang: Locale;
    id: string;
  }>();
  const { id: positionId } = params;
  const filteredNotifications = useMemo(() => {
    if (!positionId && !businessId) return notifications;

    return notifications?.filter(
      (notification) =>
        notification.position_id === positionId ||
        notification.business_id === businessId,
    );
  }, [notifications, positionId, businessId]);

  const { mutate } = useUpdateNotification({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERIES.NOTIFICATIONS,
      });
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
      filteredNotifications?.reduce(
        (acc, n) => (n.status === "NEW" || n.status === "READ" ? acc + 1 : acc),
        0,
      ) ?? 0,
    [filteredNotifications],
  );

  useEffect(() => {
    if (!open && toMarkRead.length > 0) {
      mutate({
        notification_ids: toMarkRead,
        status: "READ",
      });
    }
  }, [open, toMarkRead, mutate]);

  const markAsRead = (id: string) => {
    setToMarkRead((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Group and sort notifications by category (fallback logic)
  const categorizedNotifications = useMemo(() => {
    if (!filteredNotifications)
      return { action_required: [], informative: [], mention: [] };
    const sorted = [...filteredNotifications].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return {
      action_required: sorted.filter(
        (n) => n.phase_type === PhaseType.ACTION_CALL,
      ),
      informative: sorted.filter(
        (n) =>
          (n.notification_type !== NotificationType.TAGGED_IN_COMMENT &&
            !n.phase_type) ||
          n.phase_type === PhaseType.INFORMATIVE,
      ),
      mention: sorted.filter(
        (n) => n.notification_type === NotificationType.TAGGED_IN_COMMENT,
      ),
    };
  }, [filteredNotifications]);

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
          {i18n.label}
          <Badge className="bg-talent-green-500 hover:bg-talent-green-700">
            {count}
          </Badge>
        </span>
      </SheetTrigger>
      <SheetContent className="w-full p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {i18n.label}
            </SheetTitle>
          </div>
        </SheetHeader>
        <Tabs defaultValue="action_required" className="w-full">
          <TabsList className="sticky top-0 z-10 bg-background">
            <TabsTrigger
              className="rounded-none border-[#FFC107] text-black shadow-none data-[state=active]:border-b-2 data-[state=active]:text-talent-green-500 data-[state=active]:shadow-none"
              value="action_required"
            >
              {i18n.actionRequired} (
              {categorizedNotifications.action_required.length})
            </TabsTrigger>
            <TabsTrigger
              className="rounded-none border-[#FFC107] text-black shadow-none data-[state=active]:border-b-2 data-[state=active]:text-talent-green-500 data-[state=active]:shadow-none"
              value="informative"
            >
              {i18n.informative} ({categorizedNotifications.informative.length})
            </TabsTrigger>
            <TabsTrigger
              className="rounded-none border-[#FFC107] text-black shadow-none data-[state=active]:border-b-2 data-[state=active]:text-talent-green-500 data-[state=active]:shadow-none"
              value="mention"
            >
              {i18n.mention} ({categorizedNotifications.mention.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="action_required">
            <ScrollArea className="h-[calc(100vh-128px)]">
              <div className="flex flex-col">
                {categorizedNotifications.action_required.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {i18n.noActionRequired}
                  </div>
                ) : (
                  categorizedNotifications.action_required.map(
                    (notification) => (
                      <NotificationItem
                        dictionary={dictionary}
                        markAsRead={markAsRead}
                        setOpen={setOpen}
                        key={notification._id}
                        notification={notification}
                        positions={positions}
                      />
                    ),
                  )
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="informative">
            <ScrollArea className="h-[calc(100vh-128px)]">
              <div className="flex flex-col">
                {categorizedNotifications.informative.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {i18n.noInformative}
                  </div>
                ) : (
                  categorizedNotifications.informative.map((notification) => (
                    <NotificationItem
                      dictionary={dictionary}
                      markAsRead={markAsRead}
                      setOpen={setOpen}
                      key={notification._id}
                      notification={notification}
                      positions={positions}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="mention">
            <ScrollArea className="h-[calc(100vh-128px)]">
              <div className="flex flex-col">
                {categorizedNotifications.mention.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {i18n.noMention}
                  </div>
                ) : (
                  categorizedNotifications.mention.map((notification) => (
                    <NotificationItem
                      dictionary={dictionary}
                      markAsRead={markAsRead}
                      setOpen={setOpen}
                      key={notification._id}
                      notification={notification}
                      positions={positions}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
