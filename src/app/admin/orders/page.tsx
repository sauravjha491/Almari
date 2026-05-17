"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Truck, CheckCircle, Clock, MoreVertical } from "lucide-react";
import { formatMoney } from "@/lib/money";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
        <p className="text-slate-500 mt-1">Track and process customer orders</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-8 py-4">Order ID</th>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Total</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <span className="font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{order.fullName}</span>
                    <span className="text-xs text-slate-400">{order.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6 font-black text-slate-900">{formatMoney(order.total)}</td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    order.status === "DELIVERED" ? "bg-green-100 text-green-600" :
                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
