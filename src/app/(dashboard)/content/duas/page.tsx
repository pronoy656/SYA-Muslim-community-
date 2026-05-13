"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Plus, X, MapPin, Calendar, User, Mic,
  Play, Edit2, Trash2, Upload, FileAudio,
  Clock, AlertTriangle, FileImage, Loader2,
  Pause, RotateCcw, RotateCw, Heart, Music
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";

interface Dua {
  id: string;
  title: string;
  waqt: string;
  details: string;
  audioUrl: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

type FilterTab = "All Duas" | "By Waqt";

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
          <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Delete Dua</h3>
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

/* ── Upload/Edit Dua Dialog ─────────────────────────────────────── */
function DuaDialog({ onClose, onSave, editingItem }: {
  onClose: () => void;
  onSave: () => void;
  editingItem?: Dua | null;
}) {
  const [title, setTitle] = useState(editingItem?.title || "");
  const [waqt, setWaqt] = useState(editingItem?.waqt || "");
  const [details, setDetails] = useState(editingItem?.details || "");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const audioRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("waqt", waqt);
      formData.append("details", details);
      
      if (audioFile) formData.append("audio", audioFile);

      if (editingItem) {
        await axiosSecure.patch(`/duas/${editingItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Dua updated successfully");
      } else {
        await axiosSecure.post("/duas", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Dua created successfully");
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = title && waqt && details && (editingItem || audioFile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden font-sans max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 pt-7 pb-2 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">
              {editingItem ? "Edit Dua" : "Add New Dua"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {editingItem ? "Update the existing dua details" : "Add a new spiritual dua to the collection"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors ml-4 shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Heart className="h-4 w-4 text-[#C4A052]" /> Dua Title
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Dua for waking up" className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C4A052]" /> Waqt / Category
            </label>
            <select 
              value={waqt} 
              onChange={e => setWaqt(e.target.value)} 
              className={inputClass}
            >
              <option value="">Select Waqt</option>
              <option value="Fajr">Fajr</option>
              <option value="Dhuhr">Dhuhr</option>
              <option value="Asr">Asr</option>
              <option value="Maghrib">Maghrib</option>
              <option value="Isha">Isha</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Dua Details (Arabic / Translation)</label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Enter the full text of the dua..."
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileAudio className="h-4 w-4 text-[#C4A052]" /> Audio Recording
            </label>
            <div 
              onClick={() => audioRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all",
                audioFile ? "border-emerald-500 bg-emerald-50" : "border-[#D4C4A8] bg-[#FAF7F2] hover:border-[#C4A052]"
              )}
            >
              <input 
                type="file" 
                ref={audioRef} 
                className="hidden" 
                accept="audio/*" 
                onChange={e => setAudioFile(e.target.files?.[0] || null)} 
              />
              <Upload className="h-6 w-6 mx-auto mb-2 text-slate-400" />
              <p className="text-xs font-semibold text-slate-600">
                {audioFile ? audioFile.name : "Choose MP3/WAV Audio"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Upload a clear recording of the dua</p>
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
            {editingItem ? "Update Dua" : "Create Dua"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Dua Card (Inline Player Design) ────────────────────────────── */
function DuaCard({ dua, onDelete, onEdit, isPlaying, onPlayToggle }: {
  dua: Dua;
  onDelete: () => void;
  onEdit: () => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => onPlayToggle());
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

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
    <div className="relative bg-[#FCFAF8] border border-[#EAE3D5] rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col items-center p-8 group">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={dua.audioUrl} 
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={onPlayToggle}
      />

      {/* Top Right Actions */}
      <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="text-slate-300 hover:text-[#C4A052] transition-colors p-1">
          <Edit2 className="h-4 w-4" />
        </button>
        <button onClick={onDelete} className="text-slate-300 hover:text-red-400 transition-colors p-1">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Category Header */}
      <h4 className="text-[#C4A052] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
        {dua.waqt} RECITATION
      </h4>

      {/* Typography Content */}
      <div className="text-center w-full space-y-6 mb-8 flex-1 flex flex-col justify-center">
        {/* We use dua.title as the main display text since we don't have separate Arabic */}
        <h2 className="text-2xl font-bold text-slate-800 leading-snug">
          {dua.title}
        </h2>
        
        <p className="text-sm text-slate-500 italic max-w-xs mx-auto leading-relaxed">
          "{dua.details}"
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#EAE3D5] mb-8 opacity-60" />

      {/* Audio Controls */}
      <div className="w-full space-y-5">
        {/* Seek Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-medium w-8 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative group/slider h-4 flex items-center">
            <input 
              type="range" 
              min={0} 
              max={duration || 0} 
              step="0.1"
              value={currentTime} 
              onChange={handleProgressChange}
              className="w-full h-1.5 bg-[#EAE3D5] rounded-full appearance-none cursor-pointer accent-[#C4A052] hover:h-2 transition-all relative z-10"
              style={{
                background: `linear-gradient(to right, #C4A052 ${(currentTime / (duration || 1)) * 100}%, #EAE3D5 ${(currentTime / (duration || 1)) * 100}%)`
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium w-8 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-8">
          <button onClick={() => skip(-10)} className="text-slate-300 hover:text-[#C4A052] transition-colors">
            <RotateCcw className="h-5 w-5" />
          </button>
          
          <button 
            onClick={onPlayToggle}
            className="h-14 w-14 rounded-full bg-[#2D3748] hover:bg-[#1A202C] text-white flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-white" />
            ) : (
              <Play className="h-6 w-6 fill-white ml-1" />
            )}
          </button>

          <button onClick={() => skip(10)} className="text-slate-300 hover:text-[#C4A052] transition-colors">
            <RotateCw className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </span>
);

/* ── Main Page ─────────────────────────────────────────────────── */
export default function DuasPage() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Dua | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [playingDuaId, setPlayingDuaId] = useState<string | null>(null);

  const fetchDuas = async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/duas");
      setDuas(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch duas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDuas();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await axiosSecure.delete(`/duas/${deletingId}`);
      toast.success("Dua deleted successfully");
      setDuas(p => p.filter(d => d.id !== deletingId));
      setDeletingId(null);
    } catch (error) {
      toast.error("Failed to delete dua");
    } finally {
      setIsDeleting(false);
    }
  };

  const deletingItem = duas.find(d => d.id === deletingId);

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">

      {showDialog && (
        <DuaDialog
          onClose={() => { setShowDialog(false); setEditingItem(null); }}
          onSave={fetchDuas}
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

      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6">
        <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
          Daily Duas Management
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-sans">
          Curate and manage essential spiritual supplications for the community
        </p>
      </div>

      {/* Add button */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C4A052] hover:bg-[#A8873A] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all font-sans"
        >
          <Plus className="h-4 w-4" />
          Add New Dua
        </button>
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-[#C4A052] animate-spin" />
        </div>
      ) : duas.length === 0 ? (
        <div className="text-center py-24 text-slate-400 font-sans">
          No duas found. Start by adding one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {duas.map(d => (
            <DuaCard
              key={d.id}
              dua={d}
              onDelete={() => setDeletingId(d.id)}
              onEdit={() => { setEditingItem(d); setShowDialog(true); }}
              isPlaying={playingDuaId === d.id}
              onPlayToggle={() => setPlayingDuaId(playingDuaId === d.id ? null : d.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
