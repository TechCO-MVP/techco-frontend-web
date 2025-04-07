"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setNotificationsState } from "@/lib/store/features/notifications/notifications";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n-config";
import { useAppDispatch } from "@/lib/store/hooks";
import { Dispatch, SetStateAction } from "react";
import { VisibleOnScreen } from "./VisibleOnScreen";
import { Notification } from "@/types";

export function NotificationItem({
  setOpen,
  notification,
  markAsRead,
}: {
  notification: Notification;
  setOpen: Dispatch<SetStateAction<boolean>>;
  markAsRead: (id: string) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams<{ lang: Locale }>();
  const { lang } = params;
  const onNotificationClick = () => {
    dispatch(
      setNotificationsState({
        showCandidateDetails: {
          cardId: "1097053490",
          phaseId: "334947965",
        },
      }),
    );
    setOpen(false);
    router.push(`/${lang}/dashboard/positions/67d37ee3318bf870f6f64ad5`);
  };

  const handleVisible = () => {
    if (notification.status === "NEW") {
      markAsRead(notification._id);
    }
  };
  return (
    <VisibleOnScreen onVisible={handleVisible}>
      <div
        className={cn(
          "border-b border-border px-4 py-4",
          notification.status === "REVIEWED" && "border-[#B3B3B3] bg-[#EBEDF0]",
        )}
      >
        {notification.status === "NEW" && (
          <div className="mb-2">
            <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-medium text-white">
              Nueva
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="text-base font-bold">
              {notification.position_name}
            </div>
            {notification.profile_name && (
              <div className="text-sm">
                Candidato: {notification.profile_name}
              </div>
            )}
            <div className="mb-1 text-xs text-muted-foreground">
              {new Intl.DateTimeFormat(lang, {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }).format(
                new Date(
                  notification.created_at.endsWith("Z")
                    ? notification.created_at
                    : notification.created_at + "Z",
                ),
              )}
            </div>
            <p className="mb-2 text-sm text-muted-foreground">
              {notification.message}
            </p>

            <div className="flex justify-start">
              <Button
                onClick={onNotificationClick}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                CTA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </VisibleOnScreen>
  );
}
