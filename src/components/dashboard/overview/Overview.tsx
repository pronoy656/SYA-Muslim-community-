"use client";
import React, { useEffect, useState } from "react";
import { Users, ShieldCheck, MessageSquare, Video, TrendingUp, UserCheck, Loader2 } from "lucide-react";
import { StatCard } from "./StatCard";
import { RecentActivity } from "./RecentActivity";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";

interface Metric {
  value: number;
  changePct: number;
  direction: "up" | "down" | "neutral";
}

interface DashboardMetrics {
  meta: { comparisonPeriod: string };
  totalUsers: Metric;
  activeUsers: Metric;
  pendingVerification: Metric;
  activeQuestions: Metric;
  uploadedKhutba: Metric;
}

export default function Overview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosSecure.get("/admin/growth-metrics");
        setMetrics(response.data.data);
      } catch (error) {
        toast.error("Failed to load dashboard metrics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#FCFAF8] rounded-xl">
        <Loader2 className="h-8 w-8 text-[#C4A052] animate-spin" />
      </div>
    );
  }

  const getTrendProps = (metric: Metric) => {
    const sign = metric.direction === "up" ? "+" : metric.direction === "down" ? "-" : "";
    return {
      value: metric.value.toLocaleString(),
      trend: `${sign}${metric.changePct}%`,
      trendType: (metric.direction === "up" ? "positive" : metric.direction === "down" ? "negative" : "neutral") as "positive" | "negative" | "neutral",
    };
  };

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
          Icon={Users}
          iconBgColor="bg-[#F4EFE6]"
          iconColor="text-[#C4A052]"
          {...getTrendProps(metrics.totalUsers)}
        />
        <StatCard
          label="Pending Verifications"
          Icon={ShieldCheck}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-500"
          {...getTrendProps(metrics.pendingVerification)}
        />
        <StatCard
          label="Active Questions"
          Icon={MessageSquare}
          iconBgColor="bg-[#F4EFE6]"
          iconColor="text-[#C4A052]"
          {...getTrendProps(metrics.activeQuestions)}
        />
      </div>

      {/* Row 2: Performance Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Uploaded Khutbas"
          Icon={Video}
          iconBgColor="bg-[#F4EFE6]"
          iconColor="text-[#C4A052]"
          {...getTrendProps(metrics.uploadedKhutba)}
        />
        <StatCard
          label="Active Users (30d)"
          Icon={TrendingUp}
          iconBgColor="bg-[#F4F1E1]"
          iconColor="text-[#D4AF37]"
          {...getTrendProps(metrics.activeUsers)}
        />
        {/* Placeholder for symmetric grid if needed, or we just leave it 2 cols in row 2 */}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1">
        <RecentActivity />
      </div>
    </div>
  );
}
