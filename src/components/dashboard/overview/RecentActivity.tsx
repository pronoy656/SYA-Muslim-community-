"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { Loader2 } from "lucide-react";

interface Activity {
    id: string;
    type: string;
    title: string;
    status: string;
    timestamp: string;
    image: string;
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function RecentActivity() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axiosSecure.get("/admin/recent-activities");
                setActivities(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch recent activities", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, []);

    return (
        <Card className="bg-white border-[#EAE3D5] shadow-sm rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-[#EAE3D5]">
                <h2 className="text-xl font-normal text-slate-800 tracking-wider uppercase font-cinzel">
                    Recent Activity
                </h2>
            </div>
            <CardContent className="p-8 space-y-4 min-h-[200px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full py-8">
                        <Loader2 className="h-6 w-6 text-[#C4A052] animate-spin" />
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center text-slate-400 py-8 text-sm">
                        No recent activity
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div 
                            key={activity.id} 
                            className="flex items-center justify-between p-4 border border-[#EAE3D5] rounded-xl hover:shadow-md transition-shadow bg-[#FCFAF8]"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 bg-[#C4A052]">
                                    {activity.image && activity.image !== "/default-avatar.svg" ? (
                                        <img src={activity.image} alt={activity.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <AvatarFallback className="bg-[#C4A052] text-white font-semibold">
                                            {activity.title.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{activity.type.replace(/_/g, ' ')}</p>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 whitespace-nowrap ml-4">
                                {timeAgo(activity.timestamp)}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
