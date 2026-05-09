"use client";
import React, { useState } from "react";
import { LogOut, ChevronDown, Settings, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopBar() {
  const [showSettings, setShowSettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <>
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#EAE3D5] bg-[#FCFAF8] sticky top-0 z-10 h-16 font-cinzel">
        <div className="text-slate-400 text-sm font-medium">
          SYA Admin Portal
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 text-right hover:bg-[#F0EBE1] p-1.5 pr-2 rounded-2xl transition-all outline-none cursor-pointer border border-transparent hover:border-[#EAE3D5]">
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-slate-700 leading-tight">Admin User</div>
                  <div className="text-[10px] font-sans text-slate-500">admin@sya.app</div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA8529] flex items-center justify-center text-white text-sm font-bold shadow-sm border border-[#AA8529]/20">
                  A
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border border-[#EAE3D5] shadow-xl font-sans bg-white">
              <div className="px-3 py-3 mb-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-cinzel">Admin Account</p>
              </div>
              <DropdownMenuItem 
                className="flex items-center gap-3 px-3 py-2.5 text-slate-700 focus:bg-[#FAF7F2] rounded-xl cursor-pointer transition-colors group"
                onClick={() => setShowSettings(true)}
              >
                <div className="h-9 w-9 rounded-xl bg-[#FAF7F2] group-hover:bg-white border border-transparent group-hover:border-[#E0D4BC] flex items-center justify-center shrink-0 transition-all">
                  <Settings className="h-4.5 w-4.5 text-[#C4A052]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">Settings</p>
                  <p className="text-[10px] text-slate-500">Manage your password</p>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#EAE3D5] my-1.5 mx-2" />
              
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 focus:bg-red-50 rounded-xl cursor-pointer transition-colors group">
                <div className="h-9 w-9 rounded-xl bg-red-50 group-hover:bg-white border border-transparent group-hover:border-red-100 flex items-center justify-center shrink-0 transition-all">
                  <LogOut className="h-4.5 w-4.5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-600">Log out</p>
                  <p className="text-[10px] text-red-400">Sign out of your account</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden font-sans" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#FAF7F2] border-b border-[#EAE3D5] px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">Admin Settings</h2>
                <p className="text-xs text-slate-500 mt-1">Update your security preferences</p>
              </div>
              <button onClick={() => setShowSettings(false)} className="h-8 w-8 rounded-full bg-white border border-[#EAE3D5] flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="px-8 py-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..." 
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 transition-all placeholder:text-slate-400" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password..." 
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 transition-all placeholder:text-slate-400" 
                />
              </div>
            </div>
            
            <div className="px-8 pb-8 flex gap-3">
              <button onClick={() => setShowSettings(false)} className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">
                Cancel
              </button>
              <button 
                disabled={!currentPassword || !newPassword}
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setShowSettings(false);
                }} 
                className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

