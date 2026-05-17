"use client";

import { useAuth } from "@/stores/auth-store";
import Link from "next/link";
import { User, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function UserNav() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <Loader2 className="animate-spin text-slate-400" size={20} />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
      >
        <User size={18} />
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end hidden sm:flex">
        <span className="text-xs font-bold text-slate-900">{user.name}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{user.role}</span>
      </div>
      
      <div className="relative group">
        <button className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-white transition-all">
          <User size={20} />
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            {user.role === "ADMIN" && (
              <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                <LayoutDashboard size={16} /> Admin Panel
              </Link>
            )}
            <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
              <User size={16} /> My Account
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
