import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel-var",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SYA Muslim Community — Admin",
  description: "Admin dashboard for the SYA Muslim Community platform",
  icons: {
    icon: "/SYA logo 1.png",
    shortcut: "/SYA logo 1.png",
    apple: "/SYA logo 1.png",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}
      >
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
