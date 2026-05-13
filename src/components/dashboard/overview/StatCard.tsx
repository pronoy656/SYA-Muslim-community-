"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendType?: "positive" | "negative" | "neutral";
    Icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    description?: string;
}

export function StatCard({
    label,
    value,
    trend,
    trendType = "positive",
    Icon,
    iconBgColor,
    iconColor,
    description,
}: StatCardProps) {
    return (
        <Card className="bg-white border-[#EAE3D5] shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div
                        className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center",
                            iconBgColor
                        )}
                    >
                        <Icon className={cn("h-6 w-6", iconColor)} />
                    </div>
                    {trend && (
                        <div className={cn(
                            "text-xs font-semibold px-2.5 py-1 rounded-md",
                            trendType === "positive" 
                              ? "text-emerald-600 bg-emerald-50" 
                              : trendType === "negative"
                              ? "text-red-500 bg-red-50"
                              : "text-slate-500 bg-slate-100"
                        )}>
                            {trend}
                        </div>
                    )}
                </div>
                <div className="mt-8 space-y-1">
                    <p className="text-3xl font-bold text-slate-900 tracking-tight font-cinzel">
                        {value}
                    </p>
                    <p className="text-sm text-slate-500 capitalize">
                        {label}
                    </p>
                    {description && (
                        <p className="text-xs text-slate-400">
                            {description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
