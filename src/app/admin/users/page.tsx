"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Calendar, Shield, MoreVertical } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Management</h1>
        <p className="text-slate-500 mt-1">View and manage your registered users</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Joined Date</th>
              <th className="px-8 py-4">Orders</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{user.name || "Anonymous"}</span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 font-bold text-slate-900">{user._count?.orders || 0}</td>
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
