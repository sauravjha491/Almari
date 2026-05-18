"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Truck, CheckCircle, Clock, MoreVertical, Trash2, Package, X } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/cn";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        // Optimistically update the local state to show the change immediately
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === id ? { ...order, status } : order
          )
        );
        // Then refetch to be sure
        fetchOrders();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("An error occurred while updating the status");
    }
    setActiveMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await fetch(`/api/admin/orders/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchOrders();
        }
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
    setActiveMenu(null);
  };

  if (isLoading && orders.length === 0) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Clock className="animate-spin text-blue-600" size={40} />
    </div>
  );

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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-slate-500 font-medium">
                  No orders found in the system
                </td>
              </tr>
            ) : (
              orders.map((order) => (
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
                  <td className="px-8 py-6 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === order.id ? null : order.id)}
                      className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {activeMenu === order.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-8 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={() => handleUpdateStatus(order.id, "PENDING")}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-yellow-600 hover:bg-yellow-50 transition-colors"
                          >
                            <Clock size={16} /> Mark Pending
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "SHIPPED")}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Truck size={16} /> Mark Shipped
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-green-600 hover:bg-green-50 transition-colors"
                          >
                            <CheckCircle size={16} /> Mark Delivered
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} /> Delete Order
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
