"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingBag, Package, DollarSign, ArrowUpRight } from "lucide-react";
import { formatMoney } from "@/lib/money";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        console.error("Failed to fetch stats:", data.error);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!stats) return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-slate-900">Failed to load dashboard data</h2>
      <p className="text-slate-500 mt-2">Please try refreshing the page</p>
    </div>
  );

  const statCards = [
    { label: "Total Revenue", value: formatMoney(stats.totalIncome), icon: DollarSign, color: "bg-green-500" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-purple-500" },
    { label: "Total Customers", value: stats.totalUsers, icon: Users, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Real-time stats for your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-6">
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
            <Link 
              href="/admin/orders" 
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">{order.fullName}</span>
                  <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-slate-900">{formatMoney(order.total)}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-6">Store Performance</h2>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">Analytics visualization placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
