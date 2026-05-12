"use client";
import React from "react";
import { Users, UserCheck, UserPlus, UserX, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricValue {
  value: number;
  changePct: number;
  direction: "up" | "down" | "neutral";
}

interface UserMetrics {
  totalUsers: MetricValue;
  activeUsers: MetricValue;
  pendingUsers: MetricValue;
  suspendedUsers: MetricValue;
}

export default function UserStats({ metrics }: { metrics: UserMetrics | null }) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-[#EAE3D5] rounded-3xl p-6 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: metrics.totalUsers.value,
      change: metrics.totalUsers.changePct,
      direction: metrics.totalUsers.direction,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Users",
      value: metrics.activeUsers.value,
      change: metrics.activeUsers.changePct,
      direction: metrics.activeUsers.direction,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Verification",
      value: metrics.pendingUsers.value,
      change: metrics.pendingUsers.changePct,
      direction: metrics.pendingUsers.direction,
      icon: UserPlus,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Suspended",
      value: metrics.suspendedUsers.value,
      change: metrics.suspendedUsers.changePct,
      direction: metrics.suspendedUsers.direction,
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white border border-[#EAE3D5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-2xl", card.bg, card.color)}>
              <card.icon className="h-6 w-6" />
            </div>
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold",
              card.direction === "up" ? "bg-emerald-50 text-emerald-600" : 
              card.direction === "down" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"
            )}>
              {card.direction === "up" && <ArrowUpRight className="h-3 w-3" />}
              {card.direction === "down" && <ArrowDownRight className="h-3 w-3" />}
              {card.direction === "neutral" && <Minus className="h-3 w-3" />}
              {card.change}%
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 font-sans">{card.label}</p>
            <h3 className="text-2xl font-bold text-slate-800 font-cinzel mt-1 tracking-tight">
              {card.value.toLocaleString()}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
