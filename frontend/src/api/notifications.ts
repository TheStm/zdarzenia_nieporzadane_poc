import type { Notification, NotificationListResponse } from "../types/notification";
import { apiFetch } from "./client";

export async function getNotifications(): Promise<NotificationListResponse> {
  return apiFetch<NotificationListResponse>("/api/notifications");
}

export async function getUnreadCount(): Promise<number> {
  const data = await apiFetch<{ unread_count: number }>("/api/notifications/unread-count");
  return data.unread_count;
}

export async function markAsRead(id: number): Promise<Notification> {
  return apiFetch<Notification>(`/api/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllAsRead(): Promise<void> {
  await apiFetch<unknown>("/api/notifications/mark-all-read", { method: "POST" });
}
