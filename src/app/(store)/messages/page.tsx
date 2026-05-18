"use client";

import { useEffect, useState } from "react";
import { Bell, Package, CheckCircle, Clock, Truck, AlertCircle, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/cn";
import { useAuth } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          
          // Mark as read after fetching
          await fetch("/api/notifications", { method: "PATCH" });
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getIcon = (message: string) => {
    if (message.includes("shipped")) return <Truck className="text-blue-500" />;
    if (message.includes("delivered")) return <CheckCircle className="text-green-500" />;
    if (message.includes("placed")) return <ShoppingBag className="text-indigo-500" />;
    if (message.includes("pending")) return <Clock className="text-yellow-500" />;
    if (message.includes("canceled")) return <AlertCircle className="text-red-500" />;
    return <Bell className="text-gray-500" />;
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
          <Bell className="text-indigo-600 dark:text-indigo-400" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Messages</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">Stay updated with your orders</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-[32px] border border-slate-100 dark:border-zinc-800 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-slate-300 dark:text-zinc-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No messages yet</h2>
            <p className="text-slate-500 dark:text-zinc-400">We'll notify you here when your order status changes.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={cn(
                "bg-white dark:bg-zinc-900 p-6 rounded-[28px] border transition-all hover:shadow-md",
                notification.isRead 
                  ? "border-slate-100 dark:border-zinc-800 opacity-80" 
                  : "border-indigo-100 dark:border-indigo-900/30 shadow-sm"
              )}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.message.toLowerCase())}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white font-medium leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {notification.order && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter",
                        notification.order.status === "DELIVERED" ? "bg-green-100 text-green-600" :
                        notification.order.status === "SHIPPED" ? "bg-blue-100 text-blue-600" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {notification.order.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
