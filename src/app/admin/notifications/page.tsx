"use client";

import { useEffect, useState } from "react";
import { Bell, ShoppingBag, User, Clock, Trash2, Filter } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Notifications</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Monitor all system events and user alerts</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all">
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="text-slate-300 dark:text-zinc-600" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No notifications yet</h2>
            <p className="text-slate-500 dark:text-zinc-400">All system events will be logged here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-zinc-800">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                <div className="flex gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    notification.message.toLowerCase().includes("placed") ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" :
                    notification.message.toLowerCase().includes("shipped") ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                    notification.message.toLowerCase().includes("delivered") ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                    "bg-slate-100 dark:bg-zinc-800 text-slate-600"
                  )}>
                    {notification.message.toLowerCase().includes("placed") ? <ShoppingBag size={20} /> :
                     notification.message.toLowerCase().includes("user") ? <User size={20} /> :
                     <Bell size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                        <Clock size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {new Date(notification.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                        <User size={12} />
                        <span>{notification.user.name || "Anonymous"} ({notification.user.email})</span>
                      </div>
                      {notification.orderId && (
                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold">
                          <ShoppingBag size={12} />
                          <span>Order #{notification.orderId.slice(-6).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
