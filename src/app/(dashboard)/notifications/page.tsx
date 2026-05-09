"use client";
import React, { useState } from "react";
import { Bell, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Audience = "All Users" | "Brothers" | "Sisters" | "New Members";

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  audience: Audience;
  sentDate: string;
  delivered: number;
}

const audienceColors: Record<Audience, string> = {
  "All Users": "bg-green-50 text-green-600 border border-green-200",
  Brothers: "bg-blue-50 text-blue-600 border border-blue-200",
  Sisters: "bg-pink-50 text-pink-500 border border-pink-200",
  "New Members": "bg-amber-50 text-amber-600 border border-amber-200",
};

const initialHistory: NotificationRecord[] = [
  {
    id: "1",
    title: "New Jummah Khutbah Available",
    message: "Watch the latest khutbah from Central Masjid",
    audience: "All Users",
    sentDate: "2024-04-29 10:30",
    delivered: 12234,
  },
  {
    id: "2",
    title: "Ramadan Prayer Schedule Updated",
    message: "Check updated prayer times for your local mosque",
    audience: "All Users",
    sentDate: "2024-04-25 08:15",
    delivered: 11876,
  },
  {
    id: "3",
    title: "Sisters Study Circle Tomorrow",
    message: "Join us for Quran study at 7 PM",
    audience: "Sisters",
    sentDate: "2024-04-22 16:45",
    delivered: 5432,
  },
];

const audienceOptions: Audience[] = [
  "All Users",
  "Brothers",
  "Sisters",
  "New Members",
];

export default function NotificationsPage() {
  const [history, setHistory] = useState<NotificationRecord[]>(initialHistory);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formAudience, setFormAudience] = useState<Audience>("All Users");

  const handleSend = () => {
    if (!formTitle.trim() || !formMessage.trim()) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newRecord: NotificationRecord = {
      id: String(Date.now()),
      title: formTitle,
      message: formMessage,
      audience: formAudience,
      sentDate: dateStr,
      delivered: 0,
    };
    setHistory((prev) => [newRecord, ...prev]);
    setFormTitle("");
    setFormMessage("");
    setFormAudience("All Users");
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setFormTitle("");
    setFormMessage("");
    setFormAudience("All Users");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">
      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6">
        <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
          Push Notifications
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-sans">
          Send notifications to users
        </p>
      </div>

      {/* Create New Notification Card */}
      <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#FDF6E3] border border-[#E8D9B0] flex items-center justify-center shrink-0">
            <Bell className="h-6 w-6 text-[#C4A052]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-wide uppercase">
              Create New Notification
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Send targeted messages to your users
            </p>
          </div>
        </div>
        <button
          id="create-send-btn"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C4A052] hover:bg-[#b08c3e] text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md font-sans"
        >
          <Send className="h-4 w-4" />
          Create &amp; Send
        </button>
      </div>

      {/* Notification History Table */}
      <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EAE3D5]">
          <h3 className="text-base font-semibold text-slate-700 tracking-wide uppercase">
            Notification History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6EE] border-b border-[#EAE3D5]">
                <th className="text-left px-6 py-3 text-slate-600 font-bold font-sans uppercase tracking-wide text-xs">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-slate-600 font-bold font-sans uppercase tracking-wide text-xs">
                  Message
                </th>
                <th className="text-left px-6 py-3 text-slate-600 font-bold font-sans uppercase tracking-wide text-xs">
                  Audience
                </th>
                <th className="text-left px-6 py-3 text-slate-600 font-bold font-sans uppercase tracking-wide text-xs">
                  Sent Date
                </th>
                <th className="text-left px-6 py-3 text-slate-600 font-bold font-sans uppercase tracking-wide text-xs">
                  Delivered
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b border-[#EAE3D5] transition-colors hover:bg-[#FDF9F3]",
                    i === history.length - 1 ? "border-b-0" : ""
                  )}
                >
                  <td className="px-6 py-4 font-bold text-slate-800 font-sans text-sm whitespace-nowrap">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-sans text-sm max-w-[240px] truncate">
                    {item.message}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans",
                        audienceColors[item.audience]
                      )}
                    >
                      {item.audience}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-sans text-sm whitespace-nowrap">
                    {item.sentDate}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 font-sans text-sm">
                    {item.delivered.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Dialog Panel */}
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Dialog Header */}
            <div className="px-8 pt-8 pb-2">
              <h2
                id="dialog-title"
                className="text-2xl font-normal text-slate-800 tracking-wide font-cinzel"
              >
                Create Push Notification
              </h2>
            </div>

            {/* Form Body */}
            <div className="px-8 py-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 font-sans">
                  Notification Title
                </label>
                <input
                  id="notif-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter notification title..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#E8D9B0] text-slate-800 placeholder:text-slate-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 font-sans">
                  Message
                </label>
                <textarea
                  id="notif-message"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Enter notification message..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#E8D9B0] text-slate-800 placeholder:text-slate-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all resize-none"
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 font-sans">
                  Target Audience
                </label>
                <select
                  id="notif-audience"
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value as Audience)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#E8D9B0] text-slate-800 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all appearance-none cursor-pointer"
                >
                  {audienceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="rounded-xl bg-[#FAF6EE] border border-[#E8D9B0] p-4">
                <p className="text-xs text-slate-500 font-sans mb-3 font-semibold uppercase tracking-wide">
                  Preview:
                </p>
                <div className="bg-white rounded-xl border border-[#EAE3D5] px-4 py-3 flex items-start gap-3 shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-[#FDF6E3] border border-[#E8D9B0] flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="h-4 w-4 text-[#C4A052]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 font-sans">
                      {formTitle || "Notification Title"}
                    </p>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      {formMessage || "Your notification message will appear here..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-8 pb-8 grid grid-cols-2 gap-4">
              <button
                id="cancel-btn"
                onClick={handleCancel}
                className="py-3 rounded-xl bg-[#FAF6EE] border border-[#E8D9B0] text-slate-700 font-semibold font-sans text-sm hover:bg-[#F0E9D8] transition-all"
              >
                Cancel
              </button>
              <button
                id="send-notification-btn"
                onClick={handleSend}
                disabled={!formTitle.trim() || !formMessage.trim()}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl font-semibold font-sans text-sm transition-all",
                  formTitle.trim() && formMessage.trim()
                    ? "bg-[#C4A052] hover:bg-[#b08c3e] text-white shadow-sm hover:shadow-md"
                    : "bg-[#E8D9B0] text-[#C4A052]/50 cursor-not-allowed"
                )}
              >
                <Send className="h-4 w-4" />
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
