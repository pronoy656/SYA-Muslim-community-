"use client";
import React, { useState, useEffect } from "react";
import { LogOut, ChevronDown, Settings, X, Bell, CheckCircle2, MoreVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function TopBar() {
  const [showSettings, setShowSettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifLoading, setIsNotifLoading] = useState(false);

  const fetchMyNotifications = async () => {
    try {
      setIsNotifLoading(true);
      const response = await axiosSecure.get("/notifications/me");
      const data = response.data.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNotifications();
    // Optional: Set up interval for live updates
    const interval = setInterval(fetchMyNotifications, 60000); // 1 min
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await axiosSecure.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosSecure.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#EAE3D5] bg-[#FCFAF8] sticky top-0 z-10 h-16 font-cinzel">
        <div className="text-slate-400 text-sm font-medium">
          SYA Admin Portal
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-xl hover:bg-[#F0EBE1] border border-transparent hover:border-[#EAE3D5] transition-all outline-none cursor-pointer group">
                <Bell className={cn(
                  "h-5 w-5 transition-colors",
                  unreadCount > 0 ? "text-[#C4A052] fill-[#C4A052]/10" : "text-slate-400"
                )} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl border border-[#EAE3D5] shadow-2xl font-sans bg-white overflow-hidden">
              <div className="px-5 py-4 bg-[#FAF9F6] border-b border-[#EAE3D5] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-cinzel">Notifications</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">You have {unreadCount} unread messages</p>
                </div>
                <button 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-[10px] font-bold text-[#C4A052] hover:text-[#A8873A] disabled:opacity-50 transition-colors uppercase tracking-tighter"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto divide-y divide-[#F0EBE1]">
                {isNotifLoading && notifications.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p className="text-xs italic">Checking for alerts...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="h-12 w-12 rounded-full bg-[#FAF9F6] flex items-center justify-center">
                      <Bell className="h-6 w-6 opacity-20" />
                    </div>
                    <p className="text-xs font-medium">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "px-5 py-4 transition-all hover:bg-[#FAF7F2] relative group",
                        !n.isRead && "bg-[#FDF6E3]/30"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                          n.isRead ? "bg-slate-50 text-slate-400" : "bg-[#FDF6E3] text-[#C4A052]"
                        )}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className={cn(
                              "text-sm leading-tight truncate",
                              n.isRead ? "text-slate-600 font-medium" : "text-slate-900 font-bold"
                            )}>
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <button 
                                onClick={() => markAsRead(n.id)}
                                className="h-5 w-5 rounded-full hover:bg-white flex items-center justify-center text-[#C4A052] opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-[#EAE3D5]"
                                title="Mark as read"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-1.5 italic">
                            "{n.message}"
                          </p>
                          <p className="text-[9px] text-slate-400 font-medium">
                            {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      {!n.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C4A052]" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-[#FAF9F6] border-t border-[#EAE3D5]">
                <button className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest text-center">
                  View All Activity
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 text-right hover:bg-[#F0EBE1] p-1.5 pr-2 rounded-2xl transition-all outline-none cursor-pointer border border-transparent hover:border-[#EAE3D5]">
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-slate-700 leading-tight">Admin User</div>
                  <div className="text-[10px] font-sans text-slate-500">admin@sya.app</div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA8529] flex items-center justify-center text-white text-sm font-bold shadow-sm border border-[#AA8529]/20">
                  A
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border border-[#EAE3D5] shadow-xl font-sans bg-white">
              <div className="px-3 py-3 mb-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-cinzel">Admin Account</p>
              </div>
              <DropdownMenuItem 
                className="flex items-center gap-3 px-3 py-2.5 text-slate-700 focus:bg-[#FAF7F2] rounded-xl cursor-pointer transition-colors group"
                onClick={() => setShowSettings(true)}
              >
                <div className="h-9 w-9 rounded-xl bg-[#FAF7F2] group-hover:bg-white border border-transparent group-hover:border-[#E0D4BC] flex items-center justify-center shrink-0 transition-all">
                  <Settings className="h-4.5 w-4.5 text-[#C4A052]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">Settings</p>
                  <p className="text-[10px] text-slate-500">Manage your password</p>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#EAE3D5] my-1.5 mx-2" />
              
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 focus:bg-red-50 rounded-xl cursor-pointer transition-colors group">
                <div className="h-9 w-9 rounded-xl bg-red-50 group-hover:bg-white border border-transparent group-hover:border-red-100 flex items-center justify-center shrink-0 transition-all">
                  <LogOut className="h-4.5 w-4.5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-600">Log out</p>
                  <p className="text-[10px] text-red-400">Sign out of your account</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden font-sans" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#FAF7F2] border-b border-[#EAE3D5] px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">Admin Settings</h2>
                <p className="text-xs text-slate-500 mt-1">Update your security preferences</p>
              </div>
              <button onClick={() => setShowSettings(false)} className="h-8 w-8 rounded-full bg-white border border-[#EAE3D5] flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="px-8 py-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..." 
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 transition-all placeholder:text-slate-400" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password..." 
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 transition-all placeholder:text-slate-400" 
                />
              </div>
            </div>
            
            <div className="px-8 pb-8 flex gap-3">
              <button onClick={() => setShowSettings(false)} className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">
                Cancel
              </button>
              <button 
                disabled={!currentPassword || !newPassword}
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setShowSettings(false);
                }} 
                className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

