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
import { HiringPositionData, PhaseType, NotificationPayload } from "@/types";
import { Dictionary } from "@/types/i18n";

/**
 * Returns the CTA label for a notification based on its category.
 * Uses hardcoded strings for now; replace with i18n keys when available.
 */
function getCtaLabel(
  notification: NotificationPayload["message"],
  i18n: Dictionary["notifications"],
): string {
  switch (notification.phase_type) {
    case PhaseType.INFORMATIVE:
      return i18n.ctaSeeCandidate;
    case PhaseType.ACTION_CALL:
      return i18n.ctaStartAction;
    default:
      return i18n.ctaSeeCandidate;
  }
}

/**
 * Returns the main notification text based on its category and data.
 * Uses hardcoded templates for now; replace with i18n keys when available.
 */
function getNotificationText(
  notification: NotificationPayload["message"],
  i18n: Dictionary["notifications"],
): string {
  switch (notification.phase_type) {
    case PhaseType.INFORMATIVE:
      if (notification.phase_name) {
        return i18n.enteredPhase.replace("{phase}", notification.phase_name);
      }
      return notification.message;
    case PhaseType.ACTION_CALL:
      if (notification.phase_name) {
        return i18n.enteredPhase.replace("{phase}", notification.phase_name);
      }
      return notification.message;
    default:
      return notification.message;
  }
}

function findPosition(
  positions: HiringPositionData[],
  notification: NotificationPayload["message"],
): HiringPositionData | undefined {
  if (notification.position_id) {
    const byPositionId = positions.find(
      (position) => position._id === notification.position_id,
    );
    if (byPositionId) return byPositionId;
  }
  if (notification.pipe_id) {
    return positions.find(
      (position) => position.pipe_id === notification.pipe_id,
    );
  }
  return undefined;
}

export function NotificationItem({
  setOpen,
  notification,
  markAsRead,
  markAsReviewed,
  dictionary,
  positions,
}: {
  notification: NotificationPayload["message"];
  setOpen: Dispatch<SetStateAction<boolean>>;
  markAsRead: (id: string) => void;
  markAsReviewed: (id: string) => void;
  dictionary: Dictionary;
  positions: HiringPositionData[];
}) {
  const { notifications: i18n } = dictionary;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams<{ lang: Locale }>();
  const { lang } = params;
  const position = findPosition(positions, notification);

  const onNotificationClick = () => {
    if (!position) {
      console.warn("[Notifications] Position not found", {
        notification,
        position,
        positions,
      });
      return;
    }

    dispatch(
      setNotificationsState({
        showCandidateDetails: {
          cardId: notification.card_id,
          phaseId: notification.phase_id,
          defaultTab:
            notification.notification_type === "TAGGED_IN_COMMENT"
              ? "comments"
              : "about",
        },
      }),
    );

    setOpen(false);
    if (notification.status !== "REVIEWED") {
      markAsReviewed(notification._id);
    }
    router.push(
      `/${lang}/dashboard/positions/${position?._id}?business_id=${notification.business_id}`,
    );
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
              {i18n.new}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="text-base font-bold">
              {i18n.position}:{position?.role || notification.position_name}
            </div>
            {notification.profile_name && (
              <div className="text-sm">
                {i18n.candidate}: {notification.profile_name}
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
              {getNotificationText(notification, i18n)}
            </p>

            <div className="flex justify-start">
              <Button
                onClick={onNotificationClick}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                {getCtaLabel(notification, i18n)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </VisibleOnScreen>
  );
}
