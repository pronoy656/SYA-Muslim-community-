"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Plus, X, BookOpen, Clock, Play, Edit2, Trash2,
  Upload, FileVideo, AlertTriangle, Calendar, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";

interface LearningContent {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  durationInSeconds: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}

const CATEGORIES = ["Fiqh", "Hadith", "Quran", "Seerah", "Aqidah", "General"];

const categoryColors: Record<string, string> = {
  "Fiqh":    "bg-sky-50 text-sky-600",
  "Hadith":  "bg-amber-50 text-amber-600",
  "Quran":   "bg-emerald-50 text-emerald-600",
  "Seerah":  "bg-rose-50 text-rose-500",
  "Aqidah":  "bg-indigo-50 text-indigo-600",
  "General": "bg-slate-100 text-slate-500",
};

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
          <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Delete Content</h3>
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

/* ── Create/Edit Dialog ────────────────────────────────────────── */
function LearningDialog({ onClose, onSave, editingItem }: {
  onClose: () => void;
  onSave: () => void;
  editingItem?: LearningContent | null;
}) {
  const [title, setTitle] = useState(editingItem?.title || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [category, setCategory] = useState(editingItem?.category || "");
  const [duration, setDuration] = useState(editingItem?.durationInSeconds?.toString() || "");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  const handleFile = (file: File) => {
    if (file.type.startsWith("video/")) {
      setVideoFile(file);
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        setDuration(Math.round(video.duration).toString());
        URL.revokeObjectURL(video.src);
      };
    } else {
      toast.error("Please upload a valid video file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("durationInSeconds", duration);
      
      if (videoFile) {
        formData.append("video", videoFile);
      }

      if (editingItem) {
        await axiosSecure.patch(`/learning-contents/${editingItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Learning content updated successfully");
      } else {
        await axiosSecure.post("/learning-contents", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Learning content created successfully");
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = title && description && category && (editingItem || videoFile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden font-sans max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 pt-8 pb-2 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">
              {editingItem ? "Edit Learning Content" : "Create New Learning"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {editingItem ? "Update the existing content details" : "Add new educational content for the community"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors ml-4 shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-5 overflow-y-auto flex-1">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "py-2.5 rounded-xl text-xs font-semibold border-2 transition-all",
                    category === cat
                      ? "border-[#C4A052] bg-[#F4EFE6] text-[#C4A052]"
                      : "border-[#E0D4BC] bg-[#FAF7F2] text-slate-500 hover:border-[#C4A052]/50"
                  )}
                >
                  {cat}
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

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter content description..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 block">Video Upload</label>
              {duration && (
                <span className="text-[10px] font-mono text-[#C4A052] bg-[#C4A052]/10 px-2 py-0.5 rounded-full">
                  Duration: {formatDuration(parseInt(duration))}
                </span>
              )}
            </div>
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
              ) : editingItem?.videoUrl ? (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-3">
                    <FileVideo className="h-6 w-6 text-sky-600" />
                  </div>
                  <p className="text-sm font-semibold text-sky-700 text-center px-4">Video already uploaded</p>
                  <p className="text-xs text-sky-500 mt-1">Click to replace with new video</p>
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
        <div className="px-8 pb-8 pt-4 flex gap-3 shrink-0 border-t border-[#EAE3D5]">
          <button onClick={onClose} className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSubmit || isSubmitting}
            className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingItem ? "Update Content" : "Create Learning"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Video Player Modal ────────────────────────────────────────── */
function VideoModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8" onClick={onClose}>
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
      >
        <X className="h-8 w-8" />
      </button>
      
      <div 
        className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <video 
          src={url} 
          controls 
          autoPlay 
          className="w-full h-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <h3 className="text-white font-cinzel text-lg tracking-wide uppercase">{title}</h3>
        </div>
      </div>
    </div>
  );
}

/* ── Learning Card ─────────────────────────────────────────────── */
function LearningCard({ item, onDelete, onEdit, onPlay }: {
  item: LearningContent;
  onDelete: () => void;
  onEdit: () => void;
  onPlay: () => void;
}) {
  return (
    <div className="bg-white border border-[#EAE3D5] rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group/card">
      <div className="h-1.5 bg-gradient-to-r from-[#C4A052] to-[#E8C97A]" />

      {/* Video thumbnail area */}
      <div 
        onClick={onPlay}
        className="mx-6 mt-6 aspect-video bg-[#1C1C1E] rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#111]" />
        {item.videoUrl ? (
          <>
            <video 
              src={item.videoUrl} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            />
            <div className="h-14 w-14 rounded-full bg-[#C4A052]/90 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C4A052] transition-all relative z-10 shadow-xl">
              <Play className="h-6 w-6 text-white fill-white ml-1" />
            </div>
            
            {/* Hover overlay text */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-0">
              <span className="text-white font-semibold text-sm tracking-widest uppercase mt-20">Click to Play</span>
            </div>
          </>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-2">
            <FileVideo className="h-8 w-8 text-white/30" />
            <span className="text-xs text-white/30 font-sans">No video available</span>
          </div>
        )}
        <div className="absolute bottom-2 right-3 bg-black/60 text-white text-[10px] font-semibold font-sans px-2 py-0.5 rounded-md flex items-center gap-1 z-20">
          <Clock className="h-2.5 w-2.5" />
          {formatDuration(item.durationInSeconds)}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Category badge */}
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sans mb-3 self-start",
          categoryColors[item.category] ?? "bg-slate-100 text-slate-500"
        )}>
          {item.category}
        </span>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 font-cinzel uppercase tracking-wide leading-snug line-clamp-2 mb-2 group-hover/card:text-[#C4A052] transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 font-sans line-clamp-2 mb-4 leading-relaxed italic">
          "{item.description}"
        </p>

        {/* Date & Stats */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-sans">
            <Calendar className="h-3 w-3" />
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400">
            <span>{item.likesCount} Likes</span>
            <span>{item.commentsCount} Comments</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-5">
          <button 
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F4EFE6] hover:bg-[#E8DCC8] rounded-2xl text-sm font-semibold text-[#C4A052] transition-all font-sans"
          >
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="h-10 w-10 flex items-center justify-center rounded-2xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all shrink-0"
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
  const [items, setItems] = useState<LearningContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<LearningContent | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<LearningContent | null>(null);

  const fetchLearningContents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/learning-contents");
      setItems(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch learning contents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningContents();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await axiosSecure.delete(`/learning-contents/${deletingId}`);
      toast.success("Learning content deleted successfully");
      setItems(p => p.filter(i => i.id !== deletingId));
      setDeletingId(null);
    } catch (error) {
      toast.error("Failed to delete content");
    } finally {
      setIsDeleting(false);
    }
  };

  const deletingItem = items.find(i => i.id === deletingId);

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">

      {showDialog && (
        <LearningDialog
          onClose={() => { setShowDialog(false); setEditingItem(null); }}
          onSave={fetchLearningContents}
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

      {playingVideo && (
        <VideoModal 
          url={playingVideo.videoUrl} 
          title={playingVideo.title} 
          onClose={() => setPlayingVideo(null)} 
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
            Manage educational videos and Islamic knowledge content
          </p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C4A052] hover:bg-[#A8873A] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all font-sans shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Learning
        </button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 flex-wrap">
        {CATEGORIES.map((cat) => {
          const count = items.filter(i => i.category === cat).length;
          if (!count) return null;
          return (
            <div key={cat} className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold font-sans",
              categoryColors[cat]
            )}>
              {cat}: {count}
            </div>
          );
        })}
        <div className="ml-auto text-xs text-slate-400 font-sans">
          {items.length} total {items.length === 1 ? "item" : "items"}
        </div>
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-[#C4A052] animate-spin" />
        </div>
      ) : items.length === 0 ? (
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
              onEdit={() => { setEditingItem(item); setShowDialog(true); }}
              onPlay={() => setPlayingVideo(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
