"use client";
import React, { useState } from "react";
import {
  Users, Plus, Edit2, Trash2, BookOpen, X,
  Calendar, Hash, Globe, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

type GroupTab = "Community Groups" | "Learning Content";

interface Group {
  id: string;
  name: string;
  members: number;
  created: string;
  type: "Public" | "Private";
  category: string;
}

interface Content {
  id: string;
  title: string;
  category: string;
  published: string;
  views: number;
}

const initialGroups: Group[] = [
  { id: "1", name: "Young Professionals Network", members: 234, created: "2024-01-15", type: "Public",  category: "Networking" },
  { id: "2", name: "Sisters Study Circle",         members: 156, created: "2024-02-20", type: "Private", category: "Education" },
  { id: "3", name: "Youth Islamic Education",      members: 389, created: "2024-03-10", type: "Public",  category: "Education" },
  { id: "4", name: "Quran Memorisation Group",     members: 98,  created: "2024-03-25", type: "Private", category: "Quran" },
  { id: "5", name: "Brothers Fitness & Sunnah",    members: 142, created: "2024-04-05", type: "Public",  category: "Lifestyle" },
  { id: "6", name: "New Muslims Support",          members: 67,  created: "2024-04-18", type: "Private", category: "Support" },
];

const initialContent: Content[] = [
  { id: "1", title: "Understanding Salah — A Beginner's Guide", category: "Prayer",    published: "2024-01-10", views: 1240 },
  { id: "2", title: "Ramadan Preparation Checklist",            category: "Fasting",   published: "2024-02-05", views: 3870 },
  { id: "3", title: "The Importance of Zakah in Islam",         category: "Pillars",   published: "2024-02-28", views: 980  },
  { id: "4", title: "Sunnah Acts for Daily Life",               category: "Lifestyle", published: "2024-03-15", views: 2150 },
  { id: "5", title: "How to Perform Wudu Correctly",            category: "Prayer",    published: "2024-04-01", views: 5620 },
  { id: "6", title: "Raising Muslim Children in the West",      category: "Family",    published: "2024-04-20", views: 1890 },
];

/* ── Create Group Dialog ──────────────────────────────────────── */
function CreateGroupDialog({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (group: Group) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [userType, setUserType] = useState<"Brothers" | "Sisters">("Brothers");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      id: Date.now().toString(),
      name: name.trim(),
      members: 0,
      created: new Date().toISOString().split("T")[0],
      type: userType === "Sisters" ? "Private" : "Public",
      category: category || "Other",
    });
    onClose();
  };

  const inputClass = "w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden font-sans" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 pt-8 pb-2">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide leading-snug">
              Create New Community Group
            </h2>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors ml-4 shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-5">
          {/* Group Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Group Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name..."
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose and goals of this group..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category..."
              className={inputClass}
            />
          </div>

          {/* User Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">User Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(["Brothers", "Sisters"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setUserType(t)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold border-2 transition-all",
                    userType === t
                      ? t === "Sisters"
                        ? "border-pink-400 bg-pink-50 text-pink-500"
                        : "border-blue-400 bg-blue-50 text-blue-600"
                      : "border-[#E0D4BC] bg-[#FAF7F2] text-slate-500 hover:border-[#C4A052]/50"
                  )}
                >
                  {t}
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
            disabled={!name.trim()}
            className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Group Dialog ─────────────────────────────────────────── */
function EditGroupDialog({ group, onClose, onSave }: {
  group: Group;
  onClose: () => void;
  onSave: (updated: Group) => void;
}) {
  const [name, setName] = useState(group.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden font-sans" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#FAF7F2] border-b border-[#EAE3D5] px-8 py-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 font-cinzel uppercase tracking-wide">Edit Group</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-8 py-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Group Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#C8B99A] text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#FAF7F2] rounded-2xl">
              <p className="text-xs text-slate-400">Members</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{group.members}</p>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-2xl">
              <p className="text-xs text-slate-400">Type</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{group.type}</p>
            </div>
          </div>
        </div>
        <div className="px-8 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">Cancel</button>
          <button onClick={() => { onSave({ ...group, name }); onClose(); }} className="flex-1 py-3 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Dialog ─────────────────────────────────────── */
function DeleteDialog({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden font-sans" onClick={(e) => e.stopPropagation()}>
        <div className="px-8 py-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
            <Trash2 className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Delete Group</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-slate-700">"{name}"</span>?
            This <span className="text-red-500 font-semibold">cannot be undone</span>.
          </p>
        </div>
        <div className="px-8 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 text-sm font-semibold bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all">Yes, Delete</button>
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
    <div className="bg-white border border-[#EAE3D5] rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden group">
      {/* Card top accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#C4A052] to-[#E8C97A]" />

      <div className="p-6">
        {/* Icon + Name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-[#F4EFE6] flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 text-[#C4A052]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-800 font-cinzel uppercase tracking-wide leading-snug line-clamp-2">
              {group.name}
            </h3>
            <span className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold mt-1 font-sans",
              group.type === "Public" ? "text-emerald-600" : "text-slate-400"
            )}>
              {group.type === "Public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {group.type}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-sans">
            <Hash className="h-4 w-4 text-[#C4A052]" />
            <span><span className="font-semibold text-slate-700">{group.members.toLocaleString()}</span> members</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-sans">
            <Calendar className="h-4 w-4 text-[#C4A052]" />
            <span>Created: <span className="font-semibold text-slate-700">{group.created}</span></span>
          </div>
          <div className="inline-flex items-center px-2.5 py-1 bg-[#F4EFE6] rounded-lg text-xs font-semibold text-[#C4A052] font-sans">
            {group.category}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F4EFE6] hover:bg-[#E8DCC8] rounded-2xl text-sm font-semibold text-[#C4A052] transition-all font-sans"
          >
            <Edit2 className="h-4 w-4" />
            Edit
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

/* ── Content Card ──────────────────────────────────────────────── */
function ContentCard({ content, onDelete }: { content: Content; onDelete: () => void }) {
  const categoryColors: Record<string, string> = {
    Prayer: "bg-blue-50 text-blue-600",
    Fasting: "bg-amber-50 text-amber-600",
    Pillars: "bg-purple-50 text-purple-600",
    Lifestyle: "bg-emerald-50 text-emerald-600",
    Family: "bg-pink-50 text-pink-500",
    Quran: "bg-teal-50 text-teal-600",
  };
  return (
    <div className="bg-white border border-[#EAE3D5] rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-[#C4A052] to-[#E8C97A]" />
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-[#F4EFE6] flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6 text-[#C4A052]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-800 font-cinzel uppercase tracking-wide leading-snug line-clamp-2">
              {content.title}
            </h3>
            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-semibold mt-1 font-sans", categoryColors[content.category] ?? "bg-slate-100 text-slate-500")}>
              {content.category}
            </span>
          </div>
        </div>
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-sans">
            <Calendar className="h-4 w-4 text-[#C4A052]" />
            <span>Published: <span className="font-semibold text-slate-700">{content.published}</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-sans">
            <Globe className="h-4 w-4 text-[#C4A052]" />
            <span><span className="font-semibold text-slate-700">{content.views.toLocaleString()}</span> views</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F4EFE6] hover:bg-[#E8DCC8] rounded-2xl text-sm font-semibold text-[#C4A052] transition-all font-sans">
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button onClick={onDelete} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function GroupsAndContent() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const deletingName = groups.find((g) => g.id === deletingId)?.name ?? "";

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">
      {/* Dialogs */}
      {showCreateDialog && (
        <CreateGroupDialog
          onClose={() => setShowCreateDialog(false)}
          onCreate={(g) => setGroups((p) => [g, ...p])}
        />
      )}
      {editingGroup && (
        <EditGroupDialog
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSave={(updated) => {
            setGroups((p) => p.map((g) => (g.id === updated.id ? updated : g)));
            setEditingGroup(null);
          }}
        />
      )}
      {deletingId && (
        <DeleteDialog
          name={deletingName}
          onClose={() => setDeletingId(null)}
          onConfirm={() => { setGroups((p) => p.filter((g) => g.id !== deletingId)); setDeletingId(null); }}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
            Group Management
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-sans">
            Manage and monitor community groups
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C4A052] hover:bg-[#A8873A] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all font-sans shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create New Group
        </button>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <div className="text-center py-24 text-slate-400 font-sans">
          No groups yet. Click "Create New Group" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={() => setEditingGroup(group)}
              onDelete={() => setDeletingId(group.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}



