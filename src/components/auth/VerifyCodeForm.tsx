"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyCodeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/new-password");
    }, 600);
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-slate-800 font-cinzel uppercase tracking-wide">Verify Code</h1>
        <p className="text-slate-500 font-sans text-sm">
          Enter the 5-digit code sent to your email to reset your password.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="flex justify-center gap-3 md:gap-4">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 md:w-14 md:h-16 bg-[#FAF7F2] border border-[#E0D4BC] rounded-2xl text-center text-2xl font-bold text-slate-800 focus:border-[#C4A052] focus:ring-2 focus:ring-[#C4A052]/40 outline-none transition-all shadow-sm"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-4 text-base font-bold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-sans"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <div className="text-center text-sm text-slate-500 font-sans">
          Didn't receive the code?{" "}
          <button type="button" className="font-semibold text-[#C4A052] hover:text-[#A8873A] transition-colors">
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
}

