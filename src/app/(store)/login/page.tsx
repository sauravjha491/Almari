"use client";

import { useState } from "react";
import { useAuth } from "@/stores/auth-store";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(formData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Log in to your Almari account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium border border-red-100 dark:border-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={20} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={20} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
