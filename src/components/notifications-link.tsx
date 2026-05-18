"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/stores/auth-store";

export function NotificationsLink() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          const unread = data.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchUnreadCount();
    
    // Refresh every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <Link
      href="/messages"
      className={cn(
        "relative rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800",
        "hover:bg-slate-50 flex items-center gap-2",
      )}
    >
      <MessageSquare size={18} className="text-slate-600" />
      <span className="hidden md:inline">Messages</span>
      {unreadCount > 0 ? (
        <span
          className={cn(
            "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-semibold",
            "bg-red-500 text-white",
          )}
        >
          {unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
