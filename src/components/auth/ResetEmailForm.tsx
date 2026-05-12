"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

import axiosPublic from "@/lib/axios";

import { toast } from "sonner";

export default function ResetEmailForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const promise = axiosPublic.post("/auth/forgot-password", { email });

    toast.promise(promise, {
      loading: 'Sending reset code...',
      success: () => {
        sessionStorage.setItem("resetEmail", email);
        router.push("/verify");
        return "Reset code sent to your email!";
      },
      error: (err) => {
        const msg = err.response?.data?.message || "Failed to send reset link";
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

  const inputClass = "w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-slate-800 font-cinzel uppercase tracking-wide">Forgot Password</h1>
        <p className="text-slate-500 font-sans text-sm">Enter your email to receive a reset code</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2 text-left">
          <label className="text-sm font-semibold text-slate-700 font-sans block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sya.app"
              className={inputClass}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-4 text-base font-bold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-sans mt-2"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center pt-4">
          <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#C4A052] transition-colors font-sans">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

