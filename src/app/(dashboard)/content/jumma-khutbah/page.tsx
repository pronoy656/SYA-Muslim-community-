"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Plus, X, MapPin, Calendar, User, Mic,
  Play, Edit2, Trash2, Upload, FileAudio,
  Clock, AlertTriangle, FileImage, Loader2,
  Pause, RotateCcw, RotateCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";

interface Khutbah {
  id: string;
  title: string;
  mosqueName: string;
  date: string;
  imam: string;
  description: string;
  audioUrl: string;
  thumbnailUrl: string;
  duration: number;
  createdAt?: string;
  updatedAt?: string;
}

type FilterTab = "All Khutbahs" | "This Month";

const formatDuration = (totalSeconds: number) => {
  if (!totalSeconds) return "0:00";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/* ── Delete Dialog ─────────────────────────────────────────────── */
function DeleteDialog({ title, onClose, onConfirm, isDeleting }: {
  title: string; onClose: () => void; onConfirm: () => void; isDeleting: boolean;
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
          <button 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="flex-1 py-3 text-sm font-semibold bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Upload/Edit Khutbah Dialog ─────────────────────────────────────── */
function KhutbahDialog({ onClose, onSave, editingItem }: {
  onClose: () => void;
  onSave: () => void;
  editingItem?: Khutbah | null;
}) {
  const [title, setTitle] = useState(editingItem?.title || "");
  const [mosqueName, setMosqueName] = useState(editingItem?.mosqueName || "");
  const [date, setDate] = useState(editingItem?.date ? editingItem.date.split('T')[0] : "");
  const [imam, setImam] = useState(editingItem?.imam || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [duration, setDuration] = useState(editingItem?.duration?.toString() || "");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const audioRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      console.log("Audio Duration before append:", duration);
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("mosqueName", mosqueName);
      formData.append("imam", imam);
      formData.append("date", new Date(date).toISOString());
      formData.append("description", description);
      formData.append("duration", duration);
      
      if (audioFile) formData.append("audio", audioFile);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      console.log("--- Sending FormData ---");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      console.log("------------------------");

      if (editingItem) {
        const response = await axiosSecure.patch(`/khutba/${editingItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log("PATCH Response Data:", response.data);
        toast.success("Khutbah updated successfully");
      } else {
        const response = await axiosSecure.post("/khutba", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log("POST Response Data:", response.data);
        toast.success("Khutbah created successfully");
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = title && mosqueName && date && imam && (editingItem || (audioFile && thumbnailFile));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden font-sans max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 pt-7 pb-2 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">
              {editingItem ? "Edit Khutbah" : "Upload Khutbah"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {editingItem ? "Update the existing khutbah details" : "Add a new Jummah khutbah recording"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors ml-4 shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mic className="h-4 w-4 text-[#C4A052]" /> Khutbah Title
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. The Importance of Prayer" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C4A052]" /> Mosque Name
            </label>
            <input value={mosqueName} onChange={e => setMosqueName(e.target.value)} placeholder="e.g. Central Masjid" className={inputClass} />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#C4A052]" /> Duration (sec)
                </label>
                {duration && (
                  <span className="text-[10px] font-mono text-[#C4A052] bg-[#C4A052]/10 px-2 py-0.5 rounded-full">
                    Est. {formatDuration(parseFloat(duration))}
                  </span>
                )}
              </div>
              <input type="number" step="1" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 2400" className={inputClass} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary of the khutbah topic..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileAudio className="h-4 w-4 text-[#C4A052]" /> Audio File
              </label>
              <div 
                onClick={() => audioRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all",
                  audioFile ? "border-emerald-500 bg-emerald-50" : "border-[#D4C4A8] bg-[#FAF7F2] hover:border-[#C4A052]"
                )}
              >
                <input 
                  type="file" 
                  ref={audioRef} 
                  className="hidden" 
                  accept="audio/*" 
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setAudioFile(file);
                    if (file) {
                      const audio = document.createElement('audio');
                      audio.src = URL.createObjectURL(file);
                      audio.onloadedmetadata = () => {
                        const durationInSeconds = audio.duration;
                        setDuration(Math.round(durationInSeconds).toString());
                        URL.revokeObjectURL(audio.src);
                      };
                    }
                  }} 
                />
                <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                <span className="text-[10px] text-slate-500 truncate block">
                  {audioFile ? audioFile.name : "Choose MP3/WAV"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileImage className="h-4 w-4 text-[#C4A052]" /> Thumbnail
              </label>
              <div 
                onClick={() => thumbRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all",
                  thumbnailFile ? "border-emerald-500 bg-emerald-50" : "border-[#D4C4A8] bg-[#FAF7F2] hover:border-[#C4A052]"
                )}
              >
                <input type="file" ref={thumbRef} className="hidden" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} />
                <Upload className="h-4 w-4 mx-auto mb-1 text-slate-400" />
                <span className="text-[10px] text-slate-500 truncate block">
                  {thumbnailFile ? thumbnailFile.name : "Choose JPG/PNG"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-7 pt-4 flex gap-3 shrink-0 border-t border-[#EAE3D5]">
          <button onClick={onClose} className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSubmit || isSubmitting}
            className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingItem ? "Update Khutbah" : "Upload Khutbah"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Audio Player ────────────────────────────────────────────────── */
function KhutbahAudioPlayer({ khutbah, onClear }: { khutbah: Khutbah; onClear: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, khutbah.audioUrl]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 pr-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-5 text-white">
        <audio 
          ref={audioRef} 
          src={khutbah.audioUrl} 
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Thumbnail & Info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-800 border border-white/10 shadow-inner">
            {khutbah.thumbnailUrl ? (
              <img src={khutbah.thumbnailUrl} className="h-full w-full object-cover" alt="" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#C4A052] to-[#A8873A] flex items-center justify-center">
                <Mic className="h-6 w-6 text-white/50" />
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <h4 className="text-sm font-bold font-cinzel tracking-wider truncate w-40 uppercase">{khutbah.title}</h4>
            <p className="text-[10px] text-slate-400 font-sans truncate w-40 italic">{khutbah.imam}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-6">
             <button onClick={() => skip(-10)} className="text-slate-400 hover:text-[#C4A052] transition-colors p-1">
                <RotateCcw className="h-4 w-4" />
             </button>
             <button 
                onClick={togglePlay} 
                className="h-11 w-11 rounded-full bg-[#C4A052] text-white flex items-center justify-center hover:scale-110 hover:bg-[#A8873A] transition-all shadow-lg active:scale-95"
             >
                {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
             </button>
             <button onClick={() => skip(10)} className="text-slate-400 hover:text-[#C4A052] transition-colors p-1">
                <RotateCw className="h-4 w-4" />
             </button>
          </div>
          
          <div className="flex items-center gap-3 px-1">
            <span className="text-[10px] text-slate-400 font-mono w-9 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 relative group h-4 flex items-center">
              <input 
                type="range" 
                min={0} 
                max={duration || 0} 
                step="0.1"
                value={currentTime} 
                onChange={handleProgressChange}
                className="w-full h-1.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer accent-[#C4A052] hover:h-2 transition-all"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono w-9">{formatTime(duration)}</span>
          </div>
        </div>

        <button onClick={onClear} className="h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all group">
          <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}

/* ── Khutbah Card ──────────────────────────────────────────────── */
function KhutbahCard({ khutbah, onDelete, onEdit, onPlay, isPlaying }: {
  khutbah: Khutbah;
  onDelete: () => void;
  onEdit: () => void;
  onPlay: () => void;
  isPlaying: boolean;
}) {
  return (
    <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row gap-0">
      {/* Thumbnail */}
      <div 
        onClick={onPlay}
        className="relative w-full sm:w-44 shrink-0 aspect-video sm:aspect-auto bg-slate-100 flex items-center justify-center cursor-pointer group overflow-hidden"
      >
        {khutbah.thumbnailUrl ? (
          <img src={khutbah.thumbnailUrl} alt={khutbah.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-all",
          isPlaying ? "bg-black/40" : "bg-black/20 group-hover:bg-black/40"
        )}>
          <div className={cn(
            "h-12 w-12 rounded-full border border-white/30 flex items-center justify-center transition-all",
            isPlaying ? "bg-[#C4A052] scale-110 shadow-lg" : "bg-white/15 group-hover:bg-white/25"
          )}>
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white fill-white" />
            ) : (
              <Play className="h-5 w-5 text-white fill-white ml-0.5" />
            )}
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold font-sans px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {formatDuration(khutbah.duration)}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-cinzel uppercase tracking-wide leading-snug line-clamp-1 mb-2">
            {khutbah.title}
          </h3>
          <p className="text-xs text-slate-500 font-sans line-clamp-2 mb-3 leading-relaxed italic">
            "{khutbah.description}"
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans">
              <MapPin className="h-3.5 w-3.5 text-[#C4A052] shrink-0" />
              <span className="truncate">{khutbah.mosqueName}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans">
              <Calendar className="h-3.5 w-3.5 text-[#C4A052] shrink-0" />
              {new Date(khutbah.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans">
              <span className="text-slate-400">By:</span>
              <span className="font-medium text-slate-600 truncate">{khutbah.imam}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#F4EFE6] hover:bg-[#E8DCC8] rounded-xl text-sm font-semibold text-[#C4A052] transition-all font-sans"
          >
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
  const [khutbahs, setKhutbahs] = useState<Khutbah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("All Khutbahs");
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Khutbah | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [playingKhutbah, setPlayingKhutbah] = useState<Khutbah | null>(null);

  const fetchKhutbahs = async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/khutba");
      setKhutbahs(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch khutbahs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKhutbahs();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await axiosSecure.delete(`/khutba/${deletingId}`);
      toast.success("Khutbah deleted successfully");
      setKhutbahs(p => p.filter(k => k.id !== deletingId));
      setDeletingId(null);
    } catch (error) {
      toast.error("Failed to delete khutbah");
    } finally {
      setIsDeleting(false);
    }
  };

  const thisMonth = new Date().toISOString().slice(0, 7);
  const filtered = filter === "This Month"
    ? khutbahs.filter(k => k.date.startsWith(thisMonth))
    : khutbahs;

  const deletingItem = khutbahs.find(k => k.id === deletingId);

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">

      {showDialog && (
        <KhutbahDialog
          onClose={() => { setShowDialog(false); setEditingItem(null); }}
          onSave={fetchKhutbahs}
          editingItem={editingItem}
        />
      )}

      {deletingId && deletingItem && (
        <DeleteDialog
          title={deletingItem.title}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {playingKhutbah && (
        <KhutbahAudioPlayer 
          key={playingKhutbah.id}
          khutbah={playingKhutbah} 
          onClear={() => setPlayingKhutbah(null)} 
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
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C4A052] hover:bg-[#A8873A] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all font-sans"
        >
          <Plus className="h-4 w-4" />
          Upload Khutbah
        </button>
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-[#C4A052] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
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
              onEdit={() => { setEditingItem(k); setShowDialog(true); }}
              onPlay={() => setPlayingKhutbah(k)}
              isPlaying={playingKhutbah?.id === k.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
