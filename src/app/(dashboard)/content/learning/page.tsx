"use client";
import React, { useState, useRef } from "react";
import {
  Plus, X, BookOpen, Clock, Play, Edit2, Trash2,
  Upload, FileVideo, AlertTriangle, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningContent {
  id: string;
  title: string;
  prayerTime: string;
  videoName?: string;
  createdAt: string;
}

const PRAYER_TIMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Jumu'ah", "General"];

const initialContent: LearningContent[] = [
  { id: "1", title: "The Importance of Fajr Prayer",       prayerTime: "Fajr",     videoName: "fajr_importance.mp4",    createdAt: "2024-01-15" },
  { id: "2", title: "Dhuhr — Midday Reflection",           prayerTime: "Dhuhr",    videoName: "dhuhr_reflection.mp4",   createdAt: "2024-02-10" },
  { id: "3", title: "Asr Prayer — The Middle Prayer",      prayerTime: "Asr",      videoName: "asr_guide.mp4",          createdAt: "2024-02-28" },
  { id: "4", title: "Maghrib & Evening Adhkar",            prayerTime: "Maghrib",  videoName: "maghrib_adhkar.mp4",     createdAt: "2024-03-12" },
  { id: "5", title: "Isha & Night Worship",                prayerTime: "Isha",     videoName: undefined,                createdAt: "2024-04-01" },
  { id: "6", title: "Jumu'ah Khutbah Essentials",          prayerTime: "Jumu'ah",  videoName: "jumma_essentials.mp4",   createdAt: "2024-04-20" },
];

const prayerTimeColors: Record<string, string> = {
  "Fajr":    "bg-sky-50 text-sky-600",
  "Dhuhr":   "bg-amber-50 text-amber-600",
  "Asr":     "bg-orange-50 text-orange-500",
  "Maghrib": "bg-rose-50 text-rose-500",
  "Isha":    "bg-indigo-50 text-indigo-600",
  "Jumu'ah": "bg-emerald-50 text-emerald-600",
  "General": "bg-slate-100 text-slate-500",
};

/* ── Delete Dialog ─────────────────────────────────────────────── */
function DeleteDialog({ title, onClose, onConfirm }: {
  title: string; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Delete Content</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Delete <span className="font-semibold text-slate-700">"{title}"</span>?{" "}
            This <span className="text-red-500 font-semibold">cannot be undone</span>.
          </p>
        </div>
        <div className="px-8 pb-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 text-sm font-semibold bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Create Dialog ─────────────────────────────────────────────── */
function CreateLearningDialog({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (item: LearningContent) => void;
}) {
  const [title, setTitle] = useState("");
  const [prayerTime, setPrayerTime] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  const handleFile = (file: File) => {
    if (file.type.startsWith("video/")) setVideoFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleCreate = () => {
    if (!title.trim() || !prayerTime) return;
    onCreate({
      id: Date.now().toString(),
      title: title.trim(),
      prayerTime,
      videoName: videoFile?.name,
      createdAt: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const canSubmit = title.trim() && prayerTime;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden font-sans" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 pt-8 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">Create New Learning</h2>
            <p className="text-xs text-slate-400 mt-1">Add new learning content for the community</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors ml-4 shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-5">

          {/* Prayer Time */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Prayer Time</label>
            <div className="grid grid-cols-4 gap-2">
              {PRAYER_TIMES.map((pt) => (
                <button
                  key={pt}
                  onClick={() => setPrayerTime(pt)}
                  className={cn(
                    "py-2.5 rounded-xl text-xs font-semibold border-2 transition-all",
                    prayerTime === pt
                      ? "border-[#C4A052] bg-[#F4EFE6] text-[#C4A052]"
                      : "border-[#E0D4BC] bg-[#FAF7F2] text-slate-500 hover:border-[#C4A052]/50"
                  )}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter content title..."
              className={inputClass}
            />
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Video Upload</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "relative w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-8 cursor-pointer transition-all",
                dragOver
                  ? "border-[#C4A052] bg-[#F4EFE6]"
                  : videoFile
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-[#D4C4A8] bg-[#FAF7F2] hover:border-[#C4A052] hover:bg-[#F4EFE6]"
              )}
            >
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {videoFile ? (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
                    <FileVideo className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-700 text-center px-4">{videoFile.name}</p>
                  <p className="text-xs text-emerald-500 mt-1">
                    {(videoFile.size / 1024 / 1024).toFixed(1)} MB · Click to replace
                  </p>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-[#EAE3D5] flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-[#C4A052]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Drop video here or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">MP4, MOV, AVI — max 500 MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Create Learning
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Learning Card ─────────────────────────────────────────────── */
function LearningCard({ item, onDelete }: {
  item: LearningContent;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-[#EAE3D5] rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-[#C4A052] to-[#E8C97A]" />

      {/* Video thumbnail area */}
      <div className="mx-6 mt-6 aspect-video bg-[#1C1C1E] rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#111]" />
        {item.videoName ? (
          <>
            <div className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all relative z-10">
              <Play className="h-5 w-5 text-white fill-white ml-0.5" />
            </div>
            <span className="absolute bottom-2 right-3 text-[10px] text-white/50 font-sans truncate max-w-[80%]">
              {item.videoName}
            </span>
          </>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-2">
            <FileVideo className="h-8 w-8 text-white/30" />
            <span className="text-xs text-white/30 font-sans">No video uploaded</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Prayer time badge */}
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sans mb-3",
          prayerTimeColors[item.prayerTime] ?? "bg-slate-100 text-slate-500"
        )}>
          <Clock className="h-3 w-3" />
          {item.prayerTime}
        </span>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 font-cinzel uppercase tracking-wide leading-snug line-clamp-2 mb-3">
          {item.title}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-sans mb-5">
          <Calendar className="h-3.5 w-3.5" />
          Created: <span className="font-semibold text-slate-600">{item.createdAt}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F4EFE6] hover:bg-[#E8DCC8] rounded-2xl text-sm font-semibold text-[#C4A052] transition-all font-sans">
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="h-10 w-10 flex items-center justify-center rounded-2xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function LearningPage() {
  const [items, setItems] = useState<LearningContent[]>(initialContent);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deletingItem = items.find(i => i.id === deletingId);

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">

      {showCreate && (
        <CreateLearningDialog
          onClose={() => setShowCreate(false)}
          onCreate={(item) => setItems(p => [item, ...p])}
        />
      )}

      {deletingId && deletingItem && (
        <DeleteDialog
          title={deletingItem.title}
          onClose={() => setDeletingId(null)}
          onConfirm={() => {
            setItems(p => p.filter(i => i.id !== deletingId));
            setDeletingId(null);
          }}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-2xl bg-[#F4EFE6] flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#C4A052]" />
            </div>
            <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
              Learning Content
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-sans ml-[52px]">
            Manage educational videos and prayer-time learning
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C4A052] hover:bg-[#A8873A] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all font-sans shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Learning
        </button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 flex-wrap">
        {PRAYER_TIMES.map((pt) => {
          const count = items.filter(i => i.prayerTime === pt).length;
          if (!count) return null;
          return (
            <div key={pt} className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold font-sans",
              prayerTimeColors[pt]
            )}>
              <Clock className="h-3.5 w-3.5" />
              {pt}: {count}
            </div>
          );
        })}
        <div className="ml-auto text-xs text-slate-400 font-sans">
          {items.length} total {items.length === 1 ? "item" : "items"}
        </div>
      </div>

      {/* Cards grid */}
      {items.length === 0 ? (
        <div className="text-center py-24 text-slate-400 font-sans">
          No learning content yet. Click "New Learning" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map(item => (
            <LearningCard
              key={item.id}
              item={item}
              onDelete={() => setDeletingId(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
