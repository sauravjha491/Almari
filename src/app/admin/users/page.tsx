"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Calendar, Shield, MoreVertical, Edit, Trash2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      role: user.role,
      password: "",
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete user");
      }
    }
    setActiveMenu(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/users/${editingUser.id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } else {
      const error = await res.json();
      alert(error.error || "Failed to update user");
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Customer Management</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">View and manage your registered users</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 whitespace-nowrap">User</th>
                <th className="px-8 py-4 whitespace-nowrap">Role</th>
                <th className="px-8 py-4 whitespace-nowrap">Joined Date</th>
                <th className="px-8 py-4 whitespace-nowrap">Orders</th>
                <th className="px-8 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white truncate">{user.name || "Anonymous User"}</span>
                        <span className="text-xs text-slate-400 dark:text-zinc-500 truncate">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      user.role === "ADMIN" 
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" 
                        : "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-500 dark:text-zinc-400 text-sm whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {user._count?.orders || 0}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                      className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-all border border-transparent hover:border-slate-100 dark:hover:border-zinc-600"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === user.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-8 top-12 w-40 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-700 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={() => handleEdit(user)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700/50 transition-colors"
                          >
                            <Edit size={16} className="text-blue-500" /> Edit User
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            <Trash2 size={16} /> Delete User
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col border border-slate-100 dark:border-zinc-800">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Edit User</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Update account information and permissions</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all border border-slate-100 dark:border-zinc-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Account Role</label>
                <select
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white appearance-none transition-all font-medium"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER">Standard User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">New Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
