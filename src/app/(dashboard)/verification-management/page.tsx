"use client";
import React, { useState } from "react";
import { CheckCircle, XCircle, Play, ImageIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

type VerifStatus = "pending" | "approved" | "rejected";

interface VerifRequest {
  id: string;
  name: string;
  email: string;
  type: "Brother" | "Sister";
  submitted: string;
  initial: string;
  photoUrl?: string;
  status: VerifStatus;
}

const initialRequests: VerifRequest[] = [
  { id: "1", name: "Omar Hassan",   email: "omar@example.com",   type: "Brother", submitted: "2024-04-28", initial: "O", status: "pending" },
  { id: "2", name: "Maryam Said",   email: "maryam@example.com", type: "Sister",  submitted: "2024-04-29", initial: "M", status: "pending" },
  { id: "3", name: "Khalid Ahmed",  email: "khalid@example.com", type: "Brother", submitted: "2024-04-30", initial: "K", status: "pending" },
  { id: "4", name: "Nour Ibrahim",  email: "nour@example.com",   type: "Sister",  submitted: "2024-05-01", initial: "N", status: "pending" },
  { id: "5", name: "Bilal Yusuf",   email: "bilal@example.com",  type: "Brother", submitted: "2024-05-02", initial: "B", status: "pending" },
  { id: "6", name: "Hana Kareem",   email: "hana@example.com",   type: "Sister",  submitted: "2024-05-03", initial: "H", status: "pending" },
];

export default function VerificationManagement() {
  const [requests, setRequests] = useState<VerifRequest[]>(initialRequests);
  const [filter, setFilter] = useState<"all" | VerifStatus>("all");

  const approve = (id: string) =>
    setRequests((p) => p.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
  const reject = (id: string) =>
    setRequests((p) => p.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));

  const filtered = requests.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">
      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6">
        <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
          Verification Management
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-sans">
          Review and approve user verification requests
        </p>
      </div>

      {/* Filter tabs + Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all font-sans capitalize",
              filter === tab
                ? tab === "approved"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : tab === "rejected"
                  ? "bg-red-500 text-white shadow-sm"
                  : tab === "pending"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-[#C4A052] text-white shadow-sm"
                : "bg-white border border-[#C8B99A] text-slate-600 hover:bg-[#F4EFE6]"
            )}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-bold",
              filter === tab ? "bg-white/20 text-white" : "bg-[#F4EFE6] text-[#C4A052]"
            )}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-slate-400 font-sans">
          No {filter === "all" ? "" : filter} requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((req) => (
            <div
              key={req.id}
              className={cn(
                "bg-white border rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md",
                req.status === "approved"
                  ? "border-emerald-200"
                  : req.status === "rejected"
                  ? "border-red-200"
                  : "border-[#EAE3D5]"
              )}
            >
              {/* Status ribbon */}
              {req.status !== "pending" && (
                <div className={cn(
                  "px-6 py-2 text-xs font-bold uppercase tracking-wider font-sans text-white flex items-center gap-2",
                  req.status === "approved" ? "bg-emerald-500" : "bg-red-500"
                )}>
                  {req.status === "approved" ? (
                    <><CheckCircle className="h-3.5 w-3.5" /> Approved</>
                  ) : (
                    <><XCircle className="h-3.5 w-3.5" /> Rejected</>
                  )}
                </div>
              )}

              {/* Card Header — avatar + name */}
              <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#C4A052] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                  {req.initial}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                    {req.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">{req.email}</p>
                </div>
              </div>

              {/* Type badge */}
              <div className="px-6 pb-3">
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-sans",
                  req.type === "Brother" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-500"
                )}>
                  {req.type}
                </span>
              </div>

              {/* Media preview area */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Photo placeholder */}
                  <div className="aspect-[4/3] bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-[#EAE3D5] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                    <User className="h-10 w-10 text-slate-300 relative z-10" />
                    <span className="text-[10px] text-slate-400 font-sans mt-1 relative z-10">ID Photo</span>
                    <div className="absolute bottom-2 left-2">
                      <ImageIcon className="h-4 w-4 text-white drop-shadow-sm" />
                    </div>
                  </div>

                  {/* Video placeholder */}
                  <div className="aspect-[4/3] bg-[#1C1C1E] rounded-2xl flex items-center justify-center relative overflow-hidden cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#111]" />
                    <div className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all relative z-10">
                      <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                    </div>
                    <span className="absolute bottom-2 right-3 text-[10px] text-white/50 font-sans">
                      Video
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitted date */}
              <div className="px-6 pb-4">
                <p className="text-xs text-slate-400 font-sans">
                  Submitted: <span className="font-semibold text-slate-600">{req.submitted}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                <button
                  disabled={req.status !== "pending"}
                  onClick={() => approve(req.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold font-sans transition-all",
                    req.status === "pending"
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  )}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  disabled={req.status !== "pending"}
                  onClick={() => reject(req.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold font-sans transition-all",
                    req.status === "pending"
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  )}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}