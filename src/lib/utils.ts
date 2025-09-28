import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/components/ui/sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeRemaining(deadlineIso?: string) {
  if (!deadlineIso) return { ms: Infinity, days: Infinity, hours: Infinity, minutes: Infinity, expired: false };
  const now = Date.now();
  const until = new Date(deadlineIso).getTime();
  const ms = until - now;
  const expired = ms <= 0;
  const minutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  return { ms, days, hours, minutes: mins, expired };
}

export function formatRemaining(deadlineIso?: string) {
  const { expired, days, hours, minutes } = timeRemaining(deadlineIso);
  if (!deadlineIso) return "No deadline";
  if (expired) return "Deadline passed";
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function canUseNotifications(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (!canUseNotifications()) return null;
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return null;
  }
}

export function notify(title: string, body?: string) {
  // Always show an in-app toast
  toast(title, { description: body });
  // Best-effort OS notification
  try {
    if (canUseNotifications() && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  } catch {}
}
