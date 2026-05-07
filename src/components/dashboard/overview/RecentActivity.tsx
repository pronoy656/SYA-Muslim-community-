"use client";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activities = [
    {
        id: 1,
        name: "Ahmed Khan",
        action: "New verification request",
        time: "2 minutes ago",
        initial: "A",
    },
    {
        id: 2,
        name: "Fatima Ali",
        action: "Uploaded Jummah Khutbah video",
        time: "15 minutes ago",
        initial: "F",
    },
    {
        id: 3,
        name: "Omar Hassan",
        action: "Reported inappropriate content",
        time: "32 minutes ago",
        initial: "O",
    },
    {
        id: 4,
        name: "Aisha Rahman",
        action: "Created new community group",
        time: "1 hour ago",
        initial: "A",
    },
    {
        id: 5,
        name: "Ibrahim Malik",
        action: "Updated mosque information",
        time: "2 hours ago",
        initial: "I",
    },
];

export function RecentActivity() {
    return (
        <Card className="bg-white border-[#EAE3D5] shadow-sm rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-[#EAE3D5]">
                <h2 className="text-xl font-normal text-slate-800 tracking-wider uppercase">
                    Recent Activity
                </h2>
            </div>
            <CardContent className="p-8 space-y-4">
                {activities.map((activity) => (
                    <div 
                        key={activity.id} 
                        className="flex items-center justify-between p-4 border border-[#EAE3D5] rounded-xl hover:shadow-md transition-shadow bg-[#FCFAF8]"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 bg-[#C4A052]">
                                <AvatarFallback className="bg-[#C4A052] text-white font-semibold">
                                    {activity.initial}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{activity.name}</p>
                                <p className="text-xs text-slate-500">{activity.action}</p>
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 whitespace-nowrap">
                            {activity.time}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
