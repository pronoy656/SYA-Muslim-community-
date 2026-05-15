"use client";
import React, { useState, useEffect } from "react";
import { Bell, Send, Loader2, Calendar, Users as UsersIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";

type AudienceLabel = "All Users" | "Brothers" | "Sisters";
type AudienceValue = "ALL" | "BROTHER" | "SISTER";

interface NotificationRecord {
  id: string;
  title: string;
  text: string;
  audience: AudienceValue;
  createdAt: string;
  deliveredCount: number;
}

const audienceMap: Record<AudienceLabel, AudienceValue> = {
  "All Users": "ALL",
  "Brothers": "BROTHER",
  "Sisters": "SISTER",
};

const audienceColors: Record<AudienceValue, string> = {
  "ALL": "bg-green-50 text-green-600 border border-green-200",
  "BROTHER": "bg-blue-50 text-blue-600 border border-blue-200",
  "SISTER": "bg-pink-50 text-pink-500 border border-pink-200",
};

const audienceOptions: AudienceLabel[] = [
  "All Users",
  "Brothers",
  "Sisters",
];

export default function NotificationsPage() {
  const [history, setHistory] = useState<NotificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formAudience, setFormAudience] = useState<AudienceLabel>("All Users");

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/notifications/broadcasts");
      setHistory(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch notification history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!formTitle.trim() || !formMessage.trim()) return;
    
    try {
      setIsSending(true);
      // Map UI label to backend enum value
      const audienceValue = audienceMap[formAudience];

      await axiosSecure.post("/notifications/broadcasts", {
        title: formTitle,
        text: formMessage, // Backend expects 'text'
        audience: audienceValue, // Backend expects 'ALL' | 'BROTHER' | 'SISTER'
      });
      
      toast.success("Notification broadcasted successfully");
      setFormTitle("");
      setFormMessage("");
      setFormAudience("All Users");
      setDialogOpen(false);
      fetchHistory(); // Refresh history
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    if (isSending) return;
    setFormTitle("");
    setFormMessage("");
    setFormAudience("All Users");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">
      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase flex items-center gap-3">
            <Bell className="h-8 w-8 text-[#C4A052]" />
            Push Notifications
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-sans ml-11">
            Send targeted broadcast messages to the SYA community
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#EAE3D5] p-6 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Broadcasts</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-normal text-slate-800">{history.length}</p>
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Send className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#EAE3D5] p-6 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Audience Reached</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-normal text-slate-800">
              {history.reduce((acc, curr) => acc + (curr.deliveredCount || 0), 0).toLocaleString()}
            </p>
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <UsersIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#EAE3D5] p-6 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Sent</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-slate-800 font-sans">
              {history[0] ? new Date(history[0].createdAt).toLocaleDateString() : "Never"}
            </p>
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#FDF6E3] border border-[#E8D9B0] flex items-center justify-center shrink-0">
            <Bell className="h-6 w-6 text-[#C4A052]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-wide uppercase">
              Broadcast System
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Draft and distribute high-priority alerts to specific groups
            </p>
          </div>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#C4A052] hover:bg-[#b08c3e] text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md font-sans"
        >
          <Plus className="h-4 w-4" />
          Create Broadcast
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white border border-[#EAE3D5] rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-[#EAE3D5] flex items-center justify-between bg-[#FAF9F6]">
          <h3 className="text-sm font-bold text-slate-700 tracking-widest uppercase font-cinzel">
            Broadcast History
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin text-[#C4A052]" />
              <p className="text-sm font-sans italic">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Bell className="h-12 w-12 opacity-20" />
              <p className="text-sm font-sans italic">No broadcast history found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF6EE] border-b border-[#EAE3D5]">
                  <th className="text-left px-8 py-4 text-slate-600 font-bold font-sans uppercase tracking-widest text-[10px]">Title & Message</th>
                  <th className="text-left px-8 py-4 text-slate-600 font-bold font-sans uppercase tracking-widest text-[10px]">Target Audience</th>
                  <th className="text-left px-8 py-4 text-slate-600 font-bold font-sans uppercase tracking-widest text-[10px]">Delivery Time</th>
                  <th className="text-center px-8 py-4 text-slate-600 font-bold font-sans uppercase tracking-widest text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D5]">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FDF9F3] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="max-w-md">
                        <p className="font-bold text-slate-800 font-sans text-sm mb-1">{item.title}</p>
                        <p className="text-xs text-slate-500 font-sans line-clamp-1 group-hover:line-clamp-none transition-all duration-300 italic">
                          "{item.text}"
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold font-sans uppercase tracking-tight",
                        audienceColors[item.audience]
                      )}>
                        {Object.keys(audienceMap).find(key => audienceMap[key as AudienceLabel] === item.audience) || item.audience}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-sans text-xs">
                      <p className="font-semibold text-slate-700">{new Date(item.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] opacity-70">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Sent</span>
                        <span className="text-[9px] text-slate-400 font-sans">{item.deliveredCount?.toLocaleString() || 0} Delivered</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancel} />

          <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#FAF7F2] border-b border-[#EAE3D5] px-10 py-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-normal text-slate-800 tracking-wider font-cinzel uppercase">
                  New Broadcast
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-sans">Draft your announcement carefully</p>
              </div>
              <button 
                onClick={handleCancel}
                className="h-10 w-10 rounded-full bg-white border border-[#EAE3D5] flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-10 py-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans ml-1">
                  Target Group
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {audienceOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFormAudience(opt)}
                      className={cn(
                        "py-3 px-4 rounded-2xl text-xs font-bold transition-all border-2 text-left flex items-center justify-between",
                        formAudience === opt 
                          ? "border-[#C4A052] bg-[#F4EFE6] text-[#C4A052]" 
                          : "border-[#EAE3D5] bg-[#FCFAF8] text-slate-500 hover:border-[#C4A052]/50"
                      )}
                    >
                      {opt}
                      {formAudience === opt && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans ml-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Ramadan Mubarak!"
                  className="w-full px-5 py-4 rounded-2xl bg-[#FCFAF8] border border-[#EAE3D5] text-slate-800 placeholder:text-slate-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans ml-1">
                  Message Content
                </label>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Write your announcement here..."
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl bg-[#FCFAF8] border border-[#EAE3D5] text-slate-800 placeholder:text-slate-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all resize-none"
                />
              </div>

              {/* Preview */}
              <div className="rounded-[1.5rem] bg-[#1C1C1E] p-6 shadow-xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone Preview</p>
                  <div className="h-1 w-8 bg-white/20 rounded-full" />
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-start gap-3 border border-white/10">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#C4A052] to-[#AA8529] flex items-center justify-center shrink-0 shadow-lg">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white font-sans truncate tracking-wide">
                      {formTitle || "Notification Title"}
                    </p>
                    <p className="text-[10px] text-white/60 font-sans mt-0.5 leading-relaxed">
                      {formMessage || "Draft your message to see a preview of how it will appear on user devices."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 pb-10 flex gap-4">
              <button
                onClick={handleCancel}
                disabled={isSending}
                className="flex-1 py-4 rounded-2xl bg-white border border-[#EAE3D5] text-slate-600 font-bold font-sans text-sm hover:bg-[#FCFAF8] transition-all disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={handleSend}
                disabled={!formTitle.trim() || !formMessage.trim() || isSending}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold font-sans text-sm transition-all shadow-lg active:scale-95",
                  formTitle.trim() && formMessage.trim() && !isSending
                    ? "bg-[#C4A052] hover:bg-[#A8873A] text-white"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                )}
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
