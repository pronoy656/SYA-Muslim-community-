"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      const msg = "New passwords do not match";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    const promise = axiosSecure.post("/auth/change-password", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    toast.promise(promise, {
      loading: 'Changing password...',
      success: () => {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        }, 2000);
        return "Password changed successfully!";
      },
      error: (err) => {
        const msg = err.response?.data?.message || "Failed to change password";
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
  };

  const inputClass = "w-full pl-11 pr-12 py-3 rounded-xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 font-cinzel">Change Password</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-8 text-center">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Password Changed!</h3>
              <p className="text-slate-500 text-sm">Your password has been updated successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    name="currentPassword"
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#C4A052]"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#C4A052]"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#C4A052] text-white rounded-xl font-bold hover:bg-[#A8873A] transition-all shadow-md mt-4 disabled:opacity-70"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
