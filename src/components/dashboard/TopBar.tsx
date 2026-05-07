"use client";
import { Input } from "@/components/ui/input";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-[#EAE3D5] bg-[#FCFAF8] sticky top-0 z-10 h-16 font-cinzel">
      <div className="text-slate-400 text-sm font-medium">
        SYA Admin Portal
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 text-right hover:bg-[#F0EBE1] p-1.5 rounded-lg transition-colors outline-none cursor-pointer">
              <div>
                <div className="text-sm font-semibold text-slate-700">Admin User</div>
                <div className="text-[10px] text-slate-400">admin@sya.app</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-[#C4A052] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                A
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

