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
import {
  HiringPositionData,
  NotificationCategory,
  NotificationPayload,
} from "@/types";
import { Dictionary } from "@/types/i18n";

function getNotificationCategory(notification: {
  notification_type: string;
}): NotificationCategory {
  switch (notification.notification_type) {
    case "PHASE_CHANGE":
      return "action_required";
    case "PROFILE_FILTER_PROCESS":
      return "informative";
    case "TAGGED_IN_COMMENT":
      return "mention";
    default:
      return "informative";
  }
}

/**
 * Returns the CTA label for a notification based on its category.
 * Uses hardcoded strings for now; replace with i18n keys when available.
 */
function getCtaLabel(
  notification: NotificationPayload["message"],
  i18n: Dictionary["notifications"],
): string {
  const category = getNotificationCategory(notification);
  switch (category) {
    case "mention":
      return i18n.ctaSeeComment;
    case "informative":
      return i18n.ctaSeeCandidate;
    case "action_required":
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
  const category = getNotificationCategory(notification);
  switch (category) {
    case "mention":
      // "@NombreUsuario te etiquetó en un comentario sobre este candidato"
      return `@${notification.profile_name} ${i18n.mentionText}`;
    case "informative":
      // "El candidato cambió de la fase '[Nombre fase origen]' a '[Nombre fase destino]'"
      if (notification.phase_from && notification.phase_to) {
        return i18n.phaseChange
          .replace("{from}", notification.phase_from)
          .replace("{to}", notification.phase_to);
      }
      return notification.message;
    case "action_required":
      // "El candidato entró a la fase '[Nombre fase]'. Debes hacer una acción"
      if (notification.phase_name) {
        return i18n.enteredPhase.replace("{phase}", notification.phase_name);
      }
      return notification.message;
    default:
      return notification.message;
  }
}

export function NotificationItem({
  setOpen,
  notification,
  markAsRead,
  dictionary,
  positions,
}: {
  notification: NotificationPayload["message"];
  setOpen: Dispatch<SetStateAction<boolean>>;
  markAsRead: (id: string) => void;
  dictionary: Dictionary;
  positions: HiringPositionData[];
}) {
  const { notifications: i18n } = dictionary;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams<{ lang: Locale }>();
  const { lang } = params;
  const onNotificationClick = () => {
    console.log(
      "%c[Debug] notification",
      "background-color: teal; font-size: 20px; color: white",
      notification,
    );
    const position = positions.find(
      (position) => position.pipe_id === notification.pipe_id,
    );
    console.log(
      "%c[Debug] position",
      "background-color: teal; font-size: 20px; color: white",
      position,
    );
    dispatch(
      setNotificationsState({
        showCandidateDetails: {
          cardId: notification.card_id,
          phaseId: notification.phase_id,
        },
      }),
    );
    setOpen(false);
    router.push(`/${lang}/dashboard/positions/${position?._id}`);
  };

  const handleVisible = () => {
    if (notification.status === "READ") {
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
              {i18n.position}:{notification.position_name}
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
