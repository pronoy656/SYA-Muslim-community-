"use client";
import React, { useState, useRef } from "react";
import {
  Plus, X, MapPin, Calendar, User, Mic,
  Play, Edit2, Trash2, Upload, FileAudio,
  Clock, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Khutbah {
  id: string;
  title: string;
  mosqueName: string;
  date: string;
  imam: string;
  description?: string;
  audioName?: string;
  duration: string;
  thumbnailBg: string;
}

type FilterTab = "All Khutbahs" | "This Month";

const THUMBNAIL_GRADIENTS = [
  "from-amber-900 via-amber-700 to-yellow-600",
  "from-emerald-900 via-teal-700 to-emerald-500",
  "from-slate-900 via-slate-700 to-slate-500",
  "from-indigo-900 via-purple-800 to-indigo-600",
  "from-rose-900 via-rose-700 to-orange-600",
  "from-sky-900 via-sky-700 to-cyan-600",
];

const initialKhutbahs: Khutbah[] = [
  { id: "1", title: "The Importance of Prayer in Our Lives", mosqueName: "Central Masjid",      date: "2024-04-26", imam: "Sheikh Ahmed Abdullah",  duration: "28:45", thumbnailBg: THUMBNAIL_GRADIENTS[0] },
  { id: "2", title: "Ramadan Reflections and Spiritual Growth", mosqueName: "Green Dome Mosque", date: "2024-04-19", imam: "Imam Yusuf Ibrahim",     duration: "32:18", thumbnailBg: THUMBNAIL_GRADIENTS[1] },
  { id: "3", title: "Unity and Brotherhood in Islam",          mosqueName: "Noor Islamic Center", date: "2024-04-12", imam: "Sheikh Omar Hassan",     duration: "25:33", thumbnailBg: THUMBNAIL_GRADIENTS[2] },
  { id: "4", title: "Seeking Knowledge in Islam",             mosqueName: "Al-Rahma Masjid",    date: "2024-04-05", imam: "Imam Khalid Said",       duration: "30:12", thumbnailBg: THUMBNAIL_GRADIENTS[3] },
  { id: "5", title: "Gratitude and Contentment in Islam",     mosqueName: "Central Masjid",      date: "2024-03-29", imam: "Sheikh Ahmed Abdullah",  duration: "27:40", thumbnailBg: THUMBNAIL_GRADIENTS[4] },
  { id: "6", title: "The Rights of Neighbours in Islam",      mosqueName: "Green Dome Mosque",   date: "2024-03-22", imam: "Imam Yusuf Ibrahim",     duration: "33:05", thumbnailBg: THUMBNAIL_GRADIENTS[5] },
];

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
          <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Delete Khutbah</h3>
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

/* ── Upload Khutbah Dialog ─────────────────────────────────────── */
function UploadKhutbahDialog({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (k: Khutbah) => void;
}) {
  const [title, setTitle] = useState("");
  const [mosqueName, setMosqueName] = useState("");
  const [date, setDate] = useState("");
  const [imam, setImam] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  const handleFile = (file: File) => {
    if (file.type.startsWith("audio/") || file.name.match(/\.(mp3|mp4|wav|m4a|ogg|aac)$/i)) {
      setAudioFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const canSubmit = title.trim() && mosqueName.trim() && date && imam.trim();

  const handleCreate = () => {
    if (!canSubmit) return;
    const idx = Math.floor(Math.random() * THUMBNAIL_GRADIENTS.length);
    onCreate({
      id: Date.now().toString(),
      title: title.trim(),
      mosqueName: mosqueName.trim(),
      date,
      imam: imam.trim(),
      description: description.trim() || undefined,
      audioName: audioFile?.name,
      duration: "00:00",
      thumbnailBg: THUMBNAIL_GRADIENTS[idx],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden font-sans max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-7 pb-2 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">Upload Khutbah</h2>
            <p className="text-xs text-slate-400 mt-1">Add a new Jummah khutbah recording</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors ml-4 shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="px-8 py-5 space-y-4 overflow-y-auto flex-1">

          {/* Khutbah Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mic className="h-4 w-4 text-[#C4A052]" /> Khutbah Title
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. The Importance of Prayer" className={inputClass} />
          </div>

          {/* Mosque Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C4A052]" /> Mosque Name
            </label>
            <input value={mosqueName} onChange={e => setMosqueName(e.target.value)} placeholder="e.g. Central Masjid" className={inputClass} />
          </div>

          {/* Date + Imam — 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#C4A052]" /> Khutbah Date
              </label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-[#C4A052]" /> Imam / Speaker
              </label>
              <input value={imam} onChange={e => setImam(e.target.value)} placeholder="e.g. Sheikh Ahmed" className={inputClass} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary of the khutbah topic..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Audio File */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileAudio className="h-4 w-4 text-[#C4A052]" /> Audio File
            </label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-7 cursor-pointer transition-all",
                dragOver
                  ? "border-[#C4A052] bg-[#F4EFE6]"
                  : audioFile
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-[#D4C4A8] bg-[#FAF7F2] hover:border-[#C4A052] hover:bg-[#F4EFE6]"
              )}
            >
              <input
                ref={fileRef}
                type="file"
                accept="audio/*,.mp3,.mp4,.wav,.m4a"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {audioFile ? (
                <>
                  <div className="h-11 w-11 rounded-2xl bg-emerald-100 flex items-center justify-center mb-2">
                    <FileAudio className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-700 text-center px-4">{audioFile.name}</p>
                  <p className="text-xs text-emerald-500 mt-1">{(audioFile.size / 1024 / 1024).toFixed(1)} MB · Click to replace</p>
                </>
              ) : (
                <>
                  <div className="h-11 w-11 rounded-2xl bg-[#EAE3D5] flex items-center justify-center mb-2">
                    <Upload className="h-5 w-5 text-[#C4A052]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Drop audio here or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">MP3, MP4, WAV, M4A — max 200 MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 pt-4 flex gap-3 shrink-0 border-t border-[#EAE3D5]">
          <button onClick={onClose} className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!canSubmit}
            className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Upload Khutbah
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Khutbah Card ──────────────────────────────────────────────── */
function KhutbahCard({ khutbah, onDelete }: {
  khutbah: Khutbah;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex gap-0">
      {/* Thumbnail */}
      <div className={cn(
        "relative w-44 shrink-0 bg-gradient-to-br flex items-center justify-center cursor-pointer group",
        khutbah.thumbnailBg
      )}>
        <div className="h-12 w-12 rounded-full bg-white/15 border border-white/30 flex items-center justify-center group-hover:bg-white/25 transition-all">
          <Play className="h-5 w-5 text-white fill-white ml-0.5" />
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold font-sans px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {khutbah.duration}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-cinzel uppercase tracking-wide leading-snug line-clamp-2 mb-2.5">
            {khutbah.title}
          </h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
              <MapPin className="h-3.5 w-3.5 text-[#C4A052] shrink-0" />
              <span className="truncate">{khutbah.mosqueName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
              <Calendar className="h-3.5 w-3.5 text-[#C4A052] shrink-0" />
              {khutbah.date}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
              <span className="text-slate-400">By:</span>
              <span className="font-medium text-slate-600 truncate">{khutbah.imam}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#F4EFE6] hover:bg-[#E8DCC8] rounded-xl text-sm font-semibold text-[#C4A052] transition-all font-sans">
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function JummaKhutbahPage() {
  const [khutbahs, setKhutbahs] = useState<Khutbah[]>(initialKhutbahs);
  const [filter, setFilter] = useState<FilterTab>("All Khutbahs");
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const filtered = filter === "This Month"
    ? khutbahs.filter(k => k.date.startsWith(thisMonth))
    : khutbahs;

  const deletingItem = khutbahs.find(k => k.id === deletingId);

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">

      {showUpload && (
        <UploadKhutbahDialog
          onClose={() => setShowUpload(false)}
          onCreate={(k) => setKhutbahs(p => [k, ...p])}
        />
      )}

      {deletingId && deletingItem && (
        <DeleteDialog
          title={deletingItem.title}
          onClose={() => setDeletingId(null)}
          onConfirm={() => { setKhutbahs(p => p.filter(k => k.id !== deletingId)); setDeletingId(null); }}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6">
        <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
          Jummah Khutbah Management
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-sans">
          Manage weekly Jummah khutbah videos from mosques
        </p>
      </div>

      {/* Filter tabs + Upload button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(["All Khutbahs", "This Month"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all font-sans",
                filter === tab
                  ? "bg-[#C4A052] text-white shadow-sm"
                  : "bg-white border border-[#C8B99A] text-slate-600 hover:bg-[#F4EFE6]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C4A052] hover:bg-[#A8873A] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all font-sans"
        >
          <Plus className="h-4 w-4" />
          Upload Khutbah
        </button>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-slate-400 font-sans">
          No khutbahs found for this period.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filtered.map(k => (
            <KhutbahCard
              key={k.id}
              khutbah={k}
              onDelete={() => setDeletingId(k.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
