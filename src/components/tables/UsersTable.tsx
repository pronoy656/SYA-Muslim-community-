"use client";
import React, { useState } from "react";
import {
  Search, Eye, Ban, Trash2, CheckCircle, X,
  UserCircle, ShieldOff, ShieldCheck, AlertTriangle, Mail, Calendar, BadgeCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type UserType = "Brother" | "Sister";
type UserStatus = "Active" | "Suspended";
type VerifiedStatus = "Verified" | "Pending";
type FilterTab = "All" | "Brothers" | "Sisters";
type DialogType = "details" | "suspend" | "delete" | null;

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  status: UserStatus;
  joined: string;
  verified: VerifiedStatus;
  initial: string;
}

const initialData: User[] = [
  { id: "1",  name: "Ahmed Khan",    email: "ahmed@example.com",   type: "Brother", status: "Active",    joined: "2024-01-15", verified: "Verified", initial: "A" },
  { id: "2",  name: "Fatima Ali",    email: "fatima@example.com",  type: "Sister",  status: "Active",    joined: "2024-02-20", verified: "Verified", initial: "F" },
  { id: "3",  name: "Omar Hassan",   email: "omar@example.com",    type: "Brother", status: "Active",    joined: "2024-03-10", verified: "Pending",  initial: "O" },
  { id: "4",  name: "Aisha Rahman",  email: "aisha@example.com",   type: "Sister",  status: "Active",    joined: "2024-01-25", verified: "Verified", initial: "A" },
  { id: "5",  name: "Ibrahim Malik", email: "ibrahim@example.com", type: "Brother", status: "Suspended", joined: "2023-12-01", verified: "Verified", initial: "I" },
  { id: "6",  name: "Maryam Said",   email: "maryam@example.com",  type: "Sister",  status: "Active",    joined: "2024-04-05", verified: "Pending",  initial: "M" },
  { id: "7",  name: "Yusuf Ahmed",   email: "yusuf@example.com",   type: "Brother", status: "Active",    joined: "2024-02-14", verified: "Verified", initial: "Y" },
  { id: "8",  name: "Zainab Hassan", email: "zainab@example.com",  type: "Sister",  status: "Active",    joined: "2024-03-22", verified: "Verified", initial: "Z" },
  { id: "9",  name: "Khalid Noor",   email: "khalid@example.com",  type: "Brother", status: "Active",    joined: "2024-05-01", verified: "Verified", initial: "K" },
  { id: "10", name: "Sara Malik",    email: "sara@example.com",    type: "Sister",  status: "Suspended", joined: "2024-01-10", verified: "Pending",  initial: "S" },
  { id: "11", name: "Hassan Ali",    email: "hassan@example.com",  type: "Brother", status: "Active",    joined: "2024-06-11", verified: "Verified", initial: "H" },
  { id: "12", name: "Nour Ibrahim",  email: "nour@example.com",    type: "Sister",  status: "Active",    joined: "2024-04-19", verified: "Verified", initial: "N" },
];

const ITEMS_PER_PAGE = 8;

/* ── Shared Modal Wrapper ─────────────────────────────────────── */
function ModalBackdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ── User Avatar Row (reused in all dialogs) ───────────────────── */
function DialogUserHeader({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="bg-[#FAF7F2] border-b border-[#EAE3D5] px-8 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#C4A052] flex items-center justify-center text-white text-lg font-bold shrink-0">
          {user.initial}
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 font-cinzel">{user.name}</h2>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ── 1. Details Dialog ─────────────────────────────────────────── */
function DetailsDialog({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <DialogUserHeader user={user} onClose={onClose} />
      <div className="px-8 py-6 space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Details</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-[#FAF7F2] rounded-2xl">
            <UserCircle className="h-5 w-5 text-[#C4A052] shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Full Name</p>
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#FAF7F2] rounded-2xl">
            <Mail className="h-5 w-5 text-[#C4A052] shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="text-sm font-semibold text-slate-800">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#FAF7F2] rounded-2xl">
            <Calendar className="h-5 w-5 text-[#C4A052] shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Joined</p>
              <p className="text-sm font-semibold text-slate-800">{user.joined}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#FAF7F2] rounded-2xl">
            <BadgeCheck className="h-5 w-5 text-[#C4A052] shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  user.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                )}>{user.status}</span>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  user.type === "Brother" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-500"
                )}>{user.type}</span>
                {user.verified === "Verified" && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 pb-6">
        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] transition-all"
        >
          Close
        </button>
      </div>
    </ModalBackdrop>
  );
}

/* ── 2. Suspend Dialog ─────────────────────────────────────────── */
function SuspendDialog({
  user, onClose, onConfirm,
}: { user: User; onClose: () => void; onConfirm: () => void }) {
  const isSuspended = user.status === "Suspended";
  return (
    <ModalBackdrop onClose={onClose}>
      <DialogUserHeader user={user} onClose={onClose} />
      <div className="px-8 py-8 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-5">
          {isSuspended ? (
            <ShieldCheck className="h-8 w-8 text-amber-500" />
          ) : (
            <ShieldOff className="h-8 w-8 text-amber-500" />
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">
          {isSuspended ? "Unsuspend Account" : "Suspend Account"}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {isSuspended
            ? `Are you sure you want to restore access for ${user.name}? They will be able to log in again.`
            : `Are you sure you want to suspend ${user.name}? They will lose access until reinstated.`}
        </p>
      </div>
      <div className="px-8 pb-6 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 text-sm font-semibold bg-amber-500 text-white rounded-2xl hover:bg-amber-600 transition-all"
        >
          {isSuspended ? "Yes, Unsuspend" : "Yes, Suspend"}
        </button>
      </div>
    </ModalBackdrop>
  );
}

/* ── 3. Delete Dialog ──────────────────────────────────────────── */
function DeleteDialog({
  user, onClose, onConfirm,
}: { user: User; onClose: () => void; onConfirm: () => void }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <DialogUserHeader user={user} onClose={onClose} />
      <div className="px-8 py-8 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Delete Account</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-slate-700">{user.name}</span>?
          This action <span className="text-red-500 font-semibold">cannot be undone</span>.
        </p>
      </div>
      <div className="px-8 pb-6 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 text-sm font-semibold bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all"
        >
          Yes, Delete
        </button>
      </div>
    </ModalBackdrop>
  );
}

/* ── Main Table ────────────────────────────────────────────────── */
export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(null);

  const openDialog = (user: User, type: DialogType) => {
    setSelectedUser(user);
    setDialogType(type);
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setDialogType(null);
  };

  const handleSuspend = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" }
          : u
      )
    );
    closeDialog();
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    closeDialog();
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Brothers" && u.type === "Brother") ||
      (activeFilter === "Sisters" && u.type === "Sister");
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">

      {/* ── Dialogs ── */}
      {selectedUser && dialogType === "details" && (
        <DetailsDialog user={selectedUser} onClose={closeDialog} />
      )}
      {selectedUser && dialogType === "suspend" && (
        <SuspendDialog user={selectedUser} onClose={closeDialog} onConfirm={handleSuspend} />
      )}
      {selectedUser && dialogType === "delete" && (
        <DeleteDialog user={selectedUser} onClose={closeDialog} onConfirm={handleDelete} />
      )}

      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6">
        <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">User Management</h1>
        <p className="text-slate-500 mt-2 text-sm font-sans">Manage and monitor user accounts</p>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 bg-white border border-[#C8B99A] rounded-2xl shadow-sm flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-11 h-12 bg-transparent border-0 text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(["All", "Brothers", "Sisters"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveFilter(tab); setCurrentPage(1); }}
              className={cn(
                "px-5 py-3 text-sm font-semibold rounded-2xl transition-all font-sans",
                activeFilter === tab
                  ? "bg-[#C4A052] text-white shadow-sm"
                  : "bg-white border border-[#C8B99A] text-slate-600 hover:bg-[#F4EFE6]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D5]">
                {["Name", "Email", "Type", "Status", "Joined", "Verified", "Actions"].map((col) => (
                  <th key={col} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {paginated.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#C4A052] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {user.initial}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 font-sans">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-sans">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-sans",
                      user.type === "Brother" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-500"
                    )}>{user.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-sans",
                      user.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    )}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-sans">{user.joined}</td>
                  <td className="px-6 py-4">
                    {user.verified === "Verified" ? (
                      <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold font-sans">
                        <CheckCircle className="h-4 w-4" /> Verified
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400 font-sans">Pending</span>
                    )}
                  </td>

                  {/* Actions — each button opens its OWN dialog */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {/* View Details */}
                      <button
                        onClick={() => openDialog(user, "details")}
                        title="View Details"
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-[#C4A052] hover:bg-[#F4EFE6] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {/* Suspend */}
                      <button
                        onClick={() => openDialog(user, "suspend")}
                        title={user.status === "Suspended" ? "Unsuspend" : "Suspend"}
                        className={cn(
                          "h-8 w-8 flex items-center justify-center rounded-lg transition-colors",
                          user.status === "Suspended"
                            ? "text-emerald-500 hover:bg-emerald-50"
                            : "text-amber-500 hover:bg-amber-50"
                        )}
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => openDialog(user, "delete")}
                        title="Delete"
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-5 border-t border-[#EAE3D5] flex items-center justify-between bg-white">
          <span className="text-sm text-slate-500 font-sans">
            Showing {filtered.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
          </span>
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-5 py-2 text-sm font-semibold border border-[#EAE3D5] rounded-xl text-slate-600 hover:bg-[#F4EFE6] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-sans"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-5 py-2 text-sm font-semibold bg-[#C4A052] text-white rounded-xl hover:bg-[#A8873A] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-sans shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
