"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Eye, Ban, Trash2, CheckCircle, X, Users,
  UserCircle, ShieldOff, ShieldCheck, AlertTriangle, Mail, Calendar, BadgeCheck, Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";
import UserStats from "@/components/dashboard/UserStats";

/* ── Types ─────────────────────────────────────────────────────── */
type UserRole = "SUPER_ADMIN" | "ADMIN" | "BROTHER" | "SISTER";
type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
type DialogType = "details" | "suspend" | "delete" | "verify" | null;


interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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
        <div className="h-12 w-12 rounded-full bg-[#C4A052] overflow-hidden flex items-center justify-center text-white text-lg font-bold shrink-0">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            user.name.charAt(0)
          )}
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
              <p className="text-sm font-semibold text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#FAF7F2] rounded-2xl">
            <BadgeCheck className="h-5 w-5 text-[#C4A052] shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Status & Role</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                  user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                )}>{user.status}</span>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                  user.role === "BROTHER" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-500"
                )}>{user.role}</span>
                {user.isVerified && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 ml-1">
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
  const isSuspended = user.status === "SUSPENDED";
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

function VerifyDialog({
  user, onClose, onConfirm,
}: { user: User; onClose: () => void; onConfirm: () => void }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <DialogUserHeader user={user} onClose={onClose} />
      <div className="px-8 py-8 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
          <ShieldCheck className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Verify User</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Are you sure you want to verify <span className="font-semibold text-slate-700">{user.name}</span>?
          This will grant them verified status in the community.
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
          className="flex-1 py-3 text-sm font-semibold bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all"
        >
          Yes, Verify
        </button>
      </div>
    </ModalBackdrop>
  );
}

/* ── Main Table ────────────────────────────────────────────────── */
export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState(null);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRole, setActiveRole] = useState<"ALL" | UserRole>("ALL");
  const [activeStatus, setActiveStatus] = useState<"ALL" | UserStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogType, setDialogType] = useState<DialogType>(null);

  const fetchMetrics = async () => {
    try {
      const res = await axiosSecure.get("/users/metrics");
      setMetrics(res.data.data);
    } catch (err) {
      console.error("Failed to fetch metrics", err);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
        searchTerm: searchQuery || undefined,
      };

      if (activeRole !== "ALL") params.role = activeRole;
      if (activeStatus !== "ALL") params.status = activeStatus;

      const res = await axiosSecure.get("/users", { params });
      setUsers(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, activeRole, activeStatus]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const openDialog = (user: User, type: DialogType) => {
    setSelectedUser(user);
    setDialogType(type);
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setDialogType(null);
  };

  const handleVerify = async () => {
    if (!selectedUser) return;
    try {
      await axiosSecure.patch(`/users/${selectedUser.id}`, { isVerified: true });
      toast.success("User verified successfully");
      fetchUsers();
      fetchMetrics();
      closeDialog();
    } catch (err) {
      toast.error("Failed to verify user");
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    try {
      await axiosSecure.patch(`/users/${selectedUser.id}`, { status: newStatus });
      toast.success(`User ${newStatus === "ACTIVE" ? "unsuspended" : "suspended"} successfully`);
      fetchUsers();
      fetchMetrics();
      closeDialog();
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await axiosSecure.delete(`/users/${selectedUser.id}`);
      toast.success("User deleted successfully");
      fetchUsers();
      fetchMetrics();
      closeDialog();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

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
      {selectedUser && dialogType === "verify" && (
        <VerifyDialog user={selectedUser} onClose={closeDialog} onConfirm={handleVerify} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE3D5] pb-6">
        <div>
          <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">User Management</h1>
          <p className="text-slate-500 mt-2 text-sm font-sans">Manage and monitor user accounts</p>
        </div>
      </div>

      {/* Stat Cards */}
      <UserStats metrics={metrics} />

      {/* Search + Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1 bg-white border border-[#C8B99A] rounded-2xl shadow-sm flex items-center overflow-hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-11 h-12 bg-transparent border-0 text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans text-sm w-full"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-[#C8B99A] p-1 rounded-2xl shadow-sm">
            {(["ALL", "BROTHER", "SISTER"] as const).map((role) => (
              <button
                key={role}
                onClick={() => { setActiveRole(role); setCurrentPage(1); }}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-xl transition-all font-sans uppercase tracking-tight",
                  activeRole === role
                    ? "bg-[#C4A052] text-white shadow-sm"
                    : "text-slate-500 hover:bg-[#F4EFE6]"
                )}
              >
                {role === "ALL" ? "All Roles" : role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white border border-[#C8B99A] p-1 rounded-2xl shadow-sm">
            {(["ALL", "ACTIVE", "PENDING", "SUSPENDED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => { setActiveStatus(status); setCurrentPage(1); }}
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-xl transition-all font-sans uppercase tracking-tight",
                  activeStatus === status
                    ? "bg-[#C4A052] text-white shadow-sm"
                    : "text-slate-500 hover:bg-[#F4EFE6]"
                )}
              >
                {status === "ALL" ? "All Status" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-4 border-[#C4A052] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-[#C4A052] font-cinzel tracking-widest uppercase">Loading Users</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D5]">
                {["Name", "Email", "Role", "Status", "Joined", "Verified", "Actions"].map((col) => (
                  <th key={col} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {!loading && users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-12 w-12 text-slate-200" />
                      <p className="text-slate-400 font-sans italic">No users found matching your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#C4A052] overflow-hidden flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            user.name.charAt(0)
                          )}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 font-sans">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-sans">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter font-sans",
                        user.role === "BROTHER" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-500"
                      )}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter font-sans",
                        user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : 
                        user.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"
                      )}>{user.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-sans">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified ? (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold font-sans">
                          <CheckCircle className="h-4 w-4" /> Verified
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 font-sans italic">Pending</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDialog(user, "details")}
                          title="View Details"
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-[#C4A052] hover:bg-[#F4EFE6] transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {!user.isVerified && (
                          <button
                            onClick={() => openDialog(user, "verify")}
                            title="Verify User"
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openDialog(user, "suspend")}
                          title={user.status === "SUSPENDED" ? "Unsuspend" : "Suspend"}
                          className={cn(
                            "h-8 w-8 flex items-center justify-center rounded-lg transition-colors",
                            user.status === "SUSPENDED"
                              ? "text-emerald-500 hover:bg-emerald-50"
                              : "text-amber-500 hover:bg-amber-50"
                          )}
                        >
                          <Ban className="h-4 w-4" />
                        </button>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 0 && (
          <div className="px-6 py-5 border-t border-[#EAE3D5] flex items-center justify-between bg-[#FAF7F2]">
            <span className="text-sm text-slate-500 font-sans">
              Showing {users.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} users
            </span>
            <div className="flex items-center gap-3">
              <button
                disabled={meta.page === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-5 py-2 text-sm font-semibold border border-[#EAE3D5] rounded-xl text-slate-600 bg-white hover:bg-[#F4EFE6] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-sans"
              >
                Previous
              </button>
              <div className="flex items-center gap-1 px-2">
                <span className="text-xs font-bold text-slate-400 font-sans uppercase">Page</span>
                <span className="h-8 w-8 flex items-center justify-center bg-[#C4A052] text-white rounded-lg text-xs font-bold font-sans">{meta.page}</span>
                <span className="text-xs font-bold text-slate-400 font-sans uppercase">of {meta.totalPages}</span>
              </div>
              <button
                disabled={meta.page === meta.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                className="px-5 py-2 text-sm font-semibold bg-[#C4A052] text-white rounded-xl hover:bg-[#A8873A] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-sans shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
