"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Users, Plus, Edit2, Trash2, X,
  Calendar, Hash, Loader2, UserCircle, CircleUserRound,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";

/* ── Types ─────────────────────────────────────────────────────── */
interface Group {
  id: string;
  name: string;
  description: string;
  userType: "BROTHER" | "SISTER";
  category: string;
  memberCount: number;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Create Group Dialog ──────────────────────────────────────── */
function CreateGroupDialog({ onClose, onSuccess }: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    userType: "BROTHER" as "BROTHER" | "SISTER",
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    setLoading(true);
    try {
      await axiosSecure.post("/groups", {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || "Uncategorized",
        userType: formData.userType,
      });
      toast.success("Group created successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg mx-4 overflow-hidden font-sans" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 pt-8 pb-2">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide leading-snug">
              Create New Group
            </h2>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors ml-4 shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Group Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Quran Study Circle"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this group about?"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g. Education"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Audience</label>
            <div className="flex gap-2">
              {(["BROTHER", "SISTER"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: type })}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-xs font-bold transition-all border-2",
                    formData.userType === type
                      ? type === "BROTHER"
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-pink-100 border-pink-300 text-pink-700"
                      : "bg-[#FAF7F2] border-[#E0D4BC] text-slate-400 hover:border-[#C4A052]/50"
                  )}
                >
                  {type === "BROTHER" ? "Brothers" : "Sisters"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !formData.name.trim()}
            className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#C4A052]/20 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Dialog ─────────────────────────────────────── */
function DeleteDialog({ name, onClose, onConfirm, loading }: { name: string; onClose: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm mx-4 overflow-hidden font-sans" onClick={(e) => e.stopPropagation()}>
        <div className="px-8 py-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5 text-red-500">
            <Trash2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2 tracking-tight">Delete Group</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-slate-700">"{name}"</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="px-8 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">Cancel</button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 py-3 text-sm font-semibold bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Group Card ────────────────────────────────────────────────── */
function GroupCard({ group, onEdit, onDelete }: {
  group: Group;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-[#EAE3D5] rounded-[32px] shadow-sm  transition-all overflow-hidden group flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-[#C4A052] to-[#E8C97A]" />

      <div className="p-7 flex-1">
        <div className="flex items-start justify-between mb-6">
          <div className="h-14 w-14 rounded-2xl bg-[#F4EFE6] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            {group.userType === "BROTHER" ? (
              <UserCircle className="h-7 w-7 text-[#C4A052]" />
            ) : (
              <CircleUserRound className="h-7 w-7 text-[#C4A052]" />
            )}
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500"
          )}>
            {group.userType}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 font-cinzel uppercase tracking-tight leading-snug line-clamp-2 mb-2">
          {group.name}
        </h3>
        <p className="text-sm text-slate-500 font-sans line-clamp-2 mb-6 leading-relaxed h-10">
          {group.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-slate-50">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Hash className="h-3 w-3" /> Members
            </p>
            <p className="text-sm font-bold text-slate-700">{group.memberCount.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> Created
            </p>
            <p className="text-sm font-bold text-slate-700">{new Date(group.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="inline-flex items-center px-3 py-1 bg-[#F4EFE6] rounded-xl text-[10px] font-bold text-[#C4A052] font-sans uppercase tracking-widest">
          {group.category}
        </div>
      </div>

      <div className="px-7 pb-7 flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FAF7F2] hover:bg-[#E8DCC8] border border-[#EAE3D5] rounded-2xl text-xs font-bold text-[#C4A052] transition-all font-sans uppercase tracking-widest"
        >
          <Edit2 className="h-3 w-3" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="h-10 w-10 flex items-center justify-center rounded-2xl bg-red-50 hover:bg-red-100 text-red-400 transition-all border border-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function GroupsManagement() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const fetchGroups = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/groups?page=${page}&limit=${limit}`);
      setGroups(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups(currentPage);
  }, [fetchGroups, currentPage]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await axiosSecure.delete(`/groups/${deletingId}`);
      toast.success("Group deleted successfully");
      fetchGroups(currentPage);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete group");
    } finally {
      setDeleteLoading(false);
    }
  };

  const deletingName = groups.find((g) => g.id === deletingId)?.name ?? "";

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">
      {/* Dialogs */}
      {showCreateDialog && (
        <CreateGroupDialog
          onClose={() => setShowCreateDialog(false)}
          onSuccess={() => fetchGroups(currentPage)}
        />
      )}
      
      {deletingId && (
        <DeleteDialog
          name={deletingName}
          loading={deleteLoading}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
            Group Management
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-sans italic">
            Manage and monitor community groups and study circles
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#C4A052] hover:bg-[#A8873A] text-white text-xs font-bold rounded-2xl shadow-lg shadow-[#C4A052]/20 transition-all font-sans shrink-0 uppercase tracking-widest"
        >
          <Plus className="h-4 w-4" />
          Create New Group
        </button>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="h-12 w-12 border-4 border-[#C4A052] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-cinzel tracking-widest uppercase text-sm">Loading Groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 font-sans bg-white border border-dashed border-[#EAE3D5] rounded-[40px]">
          <Users className="h-16 w-16 text-slate-100 mb-4" />
          <p className="text-lg font-cinzel tracking-wider uppercase text-slate-500">No groups found.</p>
          <button 
            onClick={() => setShowCreateDialog(true)}
            className="mt-4 text-[#C4A052] font-bold text-sm hover:underline font-sans"
          >
            Create your first group
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onEdit={() => toast.info("Edit functionality coming soon")}
                onDelete={() => setDeletingId(group.id)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-12 border-t border-slate-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-white border border-[#EAE3D5] text-slate-400 hover:text-[#C4A052] hover:border-[#C4A052] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "h-10 w-10 rounded-xl text-sm font-bold transition-all",
                      currentPage === i + 1
                        ? "bg-[#C4A052] text-white shadow-lg shadow-[#C4A052]/20"
                        : "bg-white border border-[#EAE3D5] text-slate-500 hover:border-[#C4A052] hover:text-[#C4A052]"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-white border border-[#EAE3D5] text-slate-400 hover:text-[#C4A052] hover:border-[#C4A052] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
