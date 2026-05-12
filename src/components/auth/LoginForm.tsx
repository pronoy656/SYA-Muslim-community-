"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosPublic from "@/lib/axios";
import { useAuth } from "@/providers/AuthProvider";

import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginPromise = axiosPublic.post("/auth/login", formData);

    toast.promise(loginPromise, {
      loading: 'Authenticating...',
      success: (response) => {
        const data = response.data?.data || response.data;
        const token = data?.token || data?.accessToken || data?.access_token;
        const userData = data?.user || {};
        
        if (token) {
          login(token, userData);
          return "Login successful!";
        } else {
          throw new Error("Token not found in response");
        }
      },
      error: (err) => {
        const msg = err.response?.data?.message || err.message || "Authentication failed";
        setError(msg);
        return msg;
      },
    });

    try {
      await loginPromise;
    } catch (err) {
      // Handled by toast.promise
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-slate-800 font-cinzel uppercase tracking-wide">Welcome Back</h1>
        <p className="text-slate-500 font-sans text-sm">Login to your SYA admin account</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 font-sans block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className={inputClass}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 font-sans block">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={cn(inputClass, "pr-12")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#C4A052] transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between font-sans">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="h-5 w-5 rounded-md border-2 border-[#E0D4BC] bg-[#FAF7F2] peer-checked:bg-[#C4A052] peer-checked:border-[#C4A052] transition-all flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800 transition-colors">Remember Password</span>
          </label>
          <Link href="/reset" className="text-sm font-semibold text-[#C4A052] hover:text-[#A8873A] transition-colors">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-4 text-base font-bold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-sans mt-2"
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}
