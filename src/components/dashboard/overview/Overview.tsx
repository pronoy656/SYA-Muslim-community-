"use client";
import React from "react";
import { Users, ShieldCheck, MessageSquare, Video, TrendingUp, UserCheck } from "lucide-react";
import { StatCard } from "./StatCard";
import { RecentActivity } from "./RecentActivity";

export default function Overview() {
  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8 rounded-xl">
      {/* Header Section */}
      <div className="border-b border-[#EAE3D5] pb-6">
        <h1 className="text-3xl font-normal text-slate-800 tracking-wider font-cinzel uppercase">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Welcome to SYA Admin Panel
        </p>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Users"
          value="12,453"
          trend="+12.5%"
          trendType="positive"
          Icon={Users}
          iconBgColor="bg-[#F4EFE6]"
          iconColor="text-[#C4A052]"
        />
        <StatCard
          label="Pending Verifications"
          value="43"
          trend="-5.2%"
          trendType="negative"
          Icon={ShieldCheck}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-500"
        />
        <StatCard
          label="Active Questions"
          value="1,247"
          trend="+8.3%"
          trendType="positive"
          Icon={MessageSquare}
          iconBgColor="bg-[#F4EFE6]"
          iconColor="text-[#C4A052]"
        />
      </div>

      {/* Row 2: Performance Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Uploaded Videos"
          value="342"
          trend="+23.1%"
          trendType="positive"
          Icon={Video}
          iconBgColor="bg-[#F4EFE6]"
          iconColor="text-[#C4A052]"
        />
        <StatCard
          label="Active Users (30d)"
          value="8,921"
          trend="+15.7%"
          trendType="positive"
          Icon={TrendingUp}
          iconBgColor="bg-[#F4F1E1]"
          iconColor="text-[#D4AF37]"
        />
        <StatCard
          label="Verified Users"
          value="11,234"
          trend="+6.8%"
          trendType="positive"
          Icon={UserCheck}
          iconBgColor="bg-[#F4EFE6]"
          iconColor="text-[#C4A052]"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1">
        <RecentActivity />
      </div>
    </div>
  );
}
