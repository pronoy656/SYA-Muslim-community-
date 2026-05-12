"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, Play, FileText, Calendar, Mail, User, ShieldCheck, Image as ImageIcon } from "lucide-react";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  profileImage: string;
  verificationImage: string;
  verificationVideo: string;
  dateOfBirth: string;
  revertDate: string;
  createdAt: string;
}

interface UserVerificationDetailModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onActionSuccess: () => void;
}

export default function UserVerificationDetailModal({
  userId,
  isOpen,
  onClose,
  onActionSuccess,
}: UserVerificationDetailModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/users/${userId}`);
      setUser(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch user details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (isApprove: boolean) => {
    setActionLoading(true);
    try {
      if (isApprove) {
        await axiosSecure.patch(`/users/${userId}`, { isVerified: true, status: "ACTIVE" });
        toast.success("User verified successfully");
      } else {
        await axiosSecure.patch(`/users/${userId}`, { status: "SUSPENDED" });
        toast.success("User verification rejected");
      }
      onActionSuccess();
      onClose();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col font-sans animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#C4A052] flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
              ) : (
                user?.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 font-cinzel">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500">{user?.email}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                  user?.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {user?.status === "PENDING" ? "Pending Verification" : "Verified"}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-10 w-10 border-4 border-[#C4A052] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 font-cinzel tracking-widest uppercase text-sm">Fetching Details...</p>
            </div>
          ) : user && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column: User Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <InfoCard icon={User} label="Role" value={user.role} />
                    <InfoCard icon={Calendar} label="Date of Birth" value={new Date(user.dateOfBirth).toLocaleDateString()} />
                    <InfoCard icon={ShieldCheck} label="Revert Date" value={new Date(user.revertDate).toLocaleDateString()} />
                    <InfoCard icon={FileText} label="Account Created" value={new Date(user.createdAt).toLocaleDateString()} />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Verification Note</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Please review the provided identification media carefully. Ensure the face in the video matches the profile photo and identification image.
                  </p>
                </div>
              </div>

              {/* Right Column: Verification Media */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Verification Media</h3>
                
                {user.status !== "PENDING" ? (
                  <div className="flex flex-col items-center justify-center py-12 px-8 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">Media Locked</h4>
                    <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
                      Verification documents are permanently hidden after a user is successfully verified for privacy and security.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Identification Photo</label>
                      <div className="aspect-video bg-slate-100 rounded-[24px] border border-slate-200 overflow-hidden relative group">
                        {user.verificationImage ? (
                          <img src={user.verificationImage} alt="Verification" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-2">
                            <ImageIcon className="h-8 w-8 text-slate-300" />
                            <span className="text-[10px] text-slate-400">No image provided</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                          <button 
                            onClick={() => window.open(user.verificationImage, '_blank')}
                            className="px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-lg"
                          >
                            View Full Size
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Video Preview */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Verification Video</label>
                      <div className="aspect-video bg-slate-900 rounded-[24px] overflow-hidden relative group">
                        {user.verificationVideo ? (
                          <video 
                            src={user.verificationVideo} 
                            controls 
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-2">
                            <Play className="h-8 w-8 text-white/20" />
                            <span className="text-[10px] text-white/40">No video provided</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!loading && user && user.status === "PENDING" && (
          <div className="px-8 py-6 border-t border-slate-100 bg-[#FAF7F2] flex items-center justify-end gap-3">
            <button
              disabled={actionLoading}
              onClick={() => handleAction(false)}
              className="px-6 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject Request
            </button>
            <button
              disabled={actionLoading}
              onClick={() => handleAction(true)}
              className="px-8 py-3 bg-[#C4A052] text-white rounded-2xl text-sm font-bold hover:bg-[#A8873A] shadow-lg shadow-[#C4A052]/20 transition-all flex items-center gap-2"
            >
              {actionLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Approve Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
      <div className="h-10 w-10 bg-[#FAF7F2] text-[#C4A052] rounded-xl flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}
