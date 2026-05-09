"use client";
import Image from "next/image";
import { PropsWithChildren } from "react";

type AuthLayoutShellProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>;

export default function AuthLayoutShell({
  children,
}: AuthLayoutShellProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FCFAF8] text-slate-800 font-sans">
      {/* Left Side: Hero Image and Text */}
      <div className="relative hidden md:flex flex-col justify-end p-12 overflow-hidden bg-[#1E2328]">
        {/* Background Image */}
        <Image
          src="/auth-bg.png"
          alt="Islamic Community Center"
          priority
          fill
          className="object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111418] via-[#1E2328]/60 to-[#1E2328]/10" />

        {/* Text Content over Image */}
        <div className="relative z-10 max-w-lg mb-8">
          <div className="h-16 w-16 mb-8 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA8529] flex items-center justify-center shadow-lg border border-[#AA8529]/20">
            <span className="text-white font-cinzel text-3xl font-bold">S</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-normal text-white mb-6 leading-tight font-cinzel tracking-wide">
            Empowering the <span className="text-[#C4A052]">Community</span>
          </h1>
          <p className="text-lg text-slate-200 leading-relaxed font-light drop-shadow-sm">
            Welcome to the SYA Administration Portal. Manage members, coordinate events, and foster a stronger, more connected community.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          {/* Logo Section */}
          <div className="mb-10">
            <Image
              src="/SYA logo 1.png"
              alt="SYA Logo"
              width={160}
              height={70}
              className="object-contain"
              priority
            />
          </div>

          {/* Form Content */}
          <div className="w-full text-left">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
