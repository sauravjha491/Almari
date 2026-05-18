"use client";

import { useEffect, useState } from "react";
import { User, ShoppingBag, LogOut, Settings, Package, MapPin, ChevronRight, Clock } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/cn";
import { useAuth } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-24 sm:pb-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-slate-100 dark:border-zinc-800 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-black">
            {user?.name?.[0] || user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user?.name || "User"}</h1>
            <p className="text-slate-500 dark:text-zinc-400 font-medium">{user?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                {user?.role} Account
              </span>
              <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                Verified
              </span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 space-y-1">
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl text-blue-600 font-bold transition-all">
                <div className="flex items-center gap-3">
                  <Package size={20} /> My Orders
                </div>
                <ChevronRight size={18} />
              </button>
              <button className="w-full flex items-center justify-between p-4 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl font-bold transition-all group">
                <div className="flex items-center gap-3">
                  <MapPin size={20} /> Shipping Addresses
                </div>
                <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full flex items-center justify-between p-4 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl font-bold transition-all group">
                <div className="flex items-center gap-3">
                  <Settings size={20} /> Account Settings
                </div>
                <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
            <h3 className="text-xl font-black mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-6">Our support team is available 24/7 to assist you.</p>
            <button className="w-full py-3 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 transition-all shadow-lg">
              Contact Support
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Orders</h2>
            <Link href="/orders" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 p-12 rounded-[32px] border border-slate-100 dark:border-zinc-800 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-slate-300 dark:text-zinc-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No orders yet</h3>
              <p className="text-slate-500 dark:text-zinc-400 mb-6">You haven't placed any orders yet.</p>
              <Link 
                href="/"
                className="inline-flex px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-blue-600 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 dark:text-white block">
                        {formatMoney(order.total)}
                      </span>
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter mt-1",
                        order.status === "DELIVERED" ? "bg-green-100 text-green-600" :
                        order.status === "SHIPPED" ? "bg-blue-100 text-blue-600" :
                        order.status === "PENDING" ? "bg-yellow-100 text-yellow-600" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-zinc-800">
                    <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                      {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                    </span>
                    <button className="text-sm font-bold text-blue-600 group-hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
