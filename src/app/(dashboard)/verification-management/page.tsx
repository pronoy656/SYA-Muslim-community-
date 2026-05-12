"use client";
import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Eye, Users, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";
import UserVerificationDetailModal from "@/components/dashboard/UserVerificationDetailModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  profileImage: string;
  createdAt: string;
}

export default function VerificationManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "VERIFIED">("PENDING");
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        limit: 100,
      };
      
      if (filter === "PENDING") {
        params.isVerified = false;
      } else if (filter === "VERIFIED") {
        params.isVerified = true;
      }

      const res = await axiosSecure.get("/users", { params });
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch verification requests");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openDetails = (id: string) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE3D5] pb-6">
        <div>
          <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
            Verification Management
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-sans">
            Review and approve user verification requests
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-3">
        {(["PENDING", "VERIFIED", "ALL"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-bold transition-all font-sans uppercase tracking-widest",
              filter === tab
                ? "bg-[#C4A052] text-white shadow-lg shadow-[#C4A052]/20"
                : "bg-white border border-[#C8B99A] text-slate-600 hover:bg-[#F4EFE6]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="h-12 w-12 border-4 border-[#C4A052] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-cinzel tracking-widest uppercase text-sm">Scanning Requests...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 font-sans bg-white border border-dashed border-[#EAE3D5] rounded-[40px]">
          <Users className="h-16 w-16 text-slate-100 mb-4" />
          <p className="text-lg font-cinzel tracking-wider uppercase text-slate-500">No {filter === "ALL" ? "" : filter.toLowerCase()} requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-[#EAE3D5] rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-[#C4A052] flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 font-cinzel line-clamp-1 mb-1 uppercase tracking-tight">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-500 font-sans mb-4">{user.email}</p>

                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter mb-6",
                  user.isVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                  {user.isVerified ? "Verified" : "Pending Approval"}
                </div>

                <div className="w-full">
                  <button
                    onClick={() => openDetails(user.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#FAF7F2] text-[#C4A052] border border-[#EAE3D5] rounded-2xl text-xs font-bold hover:bg-[#C4A052] hover:text-white transition-all font-sans uppercase tracking-widest"
                  >
                    <Eye className="h-4 w-4" />
                    Review Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <UserVerificationDetailModal
        userId={selectedUserId || ""}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUserId(null);
        }}
        onActionSuccess={fetchUsers}
      />
    </div>
  );
}