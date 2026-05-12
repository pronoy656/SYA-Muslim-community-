"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

import axiosPublic from "@/lib/axios";

import { toast } from "sonner";

export default function NewPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    const resetToken = sessionStorage.getItem("resetToken");
    const headers = resetToken ? { Authorization: `Bearer ${resetToken}` } : {};

    const promise = axiosPublic.post("/auth/reset-password", 
      { 
        token: resetToken,
        newPassword: passwords.newPassword 
      },
      { headers }
    );

    toast.promise(promise, {
      loading: 'Updating password...',
      success: () => {
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetToken");
        router.push("/login");
        return "Password reset successfully!";
      },
      error: (err) => {
        const msg = err.response?.data?.message || "Failed to reset password";
        setError(msg);
        return msg;
      }
    });

    try {
      await promise;
    } catch (err) {
      // Handled by toast
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full pl-11 pr-12 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-slate-800 font-cinzel uppercase tracking-wide">Set New Password</h1>
        <p className="text-slate-500 font-sans text-sm">Create a new secure password for your account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2 text-left">
          <label className="text-sm font-semibold text-slate-700 font-sans block">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              required
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#C4A052] transition-colors focus:outline-none"
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2 text-left">
          <label className="text-sm font-semibold text-slate-700 font-sans block">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#C4A052] transition-colors focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 text-base font-bold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-sans mt-4" 
          disabled={loading}
        >
          {loading ? "Saving..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
}

