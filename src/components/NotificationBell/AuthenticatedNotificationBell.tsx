"use client";

import { useAppSelector } from "@/store/hooks";
import NotificationBell from "@/components/NotificationBell/NotificationBell";

export default function AuthenticatedNotificationBell() {
  const isAuthenticated = useAppSelector((state) => !!state.auth.user?.access);

  if (!isAuthenticated) {
    return null;
  }

  return <NotificationBell />;
}
