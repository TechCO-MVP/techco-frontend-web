"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { setNotificationsState } from "@/lib/store/features/notifications/notifications";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n-config";
import { useAppDispatch } from "@/lib/store/hooks";
import { Dispatch, SetStateAction, useState } from "react";
interface Notification {
  id: string;
  type: "candidate_added" | "candidate_phase" | "system_update" | "error";
  title: string;
  date: string;
  time: string;
  description: string;
  isNew: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "candidate_added",
    title: "Nuevo candidato agregado ID: 0000000",
    date: "2 Feb 2025",
    time: "10:32 AM",
    description:
      'Carlos Pérez ha sido agregado al proceso para "Lead Developer".',
    isNew: true,
    actionLabel: "Ver candidato",
    actionUrl: "#",
  },
  {
    id: "2",
    type: "candidate_phase",
    title: "Candidato en nueva fase ID: 0000000",
    date: "2 Feb 2025",
    time: "10:32 AM",
    description: 'María Gómez ha avanzado a "Entrevista técnica".',
    isNew: true,
    actionLabel: "Revisar proceso",
    actionUrl: "#",
  },
  {
    id: "3",
    type: "system_update",
    title: "Actualización en el sistema",
    date: "17 Feb 2025",
    time: "11:54 AM",
    description:
      "Se ha actualizado la plataforma con nuevas mejoras en el dashboard.",
    isNew: false,
  },
  {
    id: "4",
    type: "error",
    title: "Error en carga de archivo",
    date: "2 Feb 2025",
    time: "10:32 AM",
    description:
      "No se pudo cargar el CV de Juan Rodríguez. Por favor, intenta de nuevo",
    isNew: false,
    actionLabel: "Reintentar",
    actionUrl: "#",
  },
  {
    id: "5",
    type: "candidate_phase",
    title: "Candidato en nueva fase ID: 0000000",
    date: "2 Feb 2025",
    time: "10:32 AM",
    description: 'María Gómez ha avanzado a "Entrevista técnica".',
    isNew: false,
  },
];

export function NotificationItem({
  setOpen,
  notification,
}: {
  notification: Notification;
  setOpen: Dispatch<SetStateAction<boolean>>;
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
  return (
    <div
      className={cn(
        "border-b border-border px-4 py-4",
        !notification.isNew && "border-[#B3B3B3] bg-[#EBEDF0]",
      )}
    >
      {notification.isNew && (
        <div className="mb-2">
          <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-medium text-white">
            Nueva
          </span>
        </div>
      )}
      <div className="flex gap-2">
        🔹
        <div className="flex-1">
          <div className="text-sm font-medium">{notification.title}</div>
          <div className="mb-1 text-xs text-muted-foreground">
            {notification.date} - {notification.time}
          </div>
          <p className="mb-2 text-sm text-muted-foreground">
            {notification.description}
          </p>
          {notification.actionLabel && (
            <div className="flex justify-end">
              <Button
                onClick={onNotificationClick}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                {notification.actionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NotificationsProps {
  count?: number;
  label: string;
}

export function Notifications({ count = 9, label }: NotificationsProps) {
  const [open, setOpen] = useState(false);
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
            {notifications.map((notification) => (
              <NotificationItem
                setOpen={setOpen}
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
