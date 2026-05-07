"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Video,
  MapPin,
  HelpCircle,
  Bell,
  BarChart2,
  ChevronRight,
  BookOpen,
  FolderOpen,
  Layers,
  LucideIcon,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────── */
interface NavLeaf {
  type: "leaf";
  href: string;
  label: string;
  Icon: LucideIcon;
}

interface NavGroup {
  type: "group";
  key: string;
  label: string;
  Icon: LucideIcon;
  children: (NavLeaf | NavGroup)[];
}

type NavItem = NavLeaf | NavGroup;

/* ── Navigation Tree ────────────────────────────────────────────── */
const navTree: NavItem[] = [
  { type: "leaf", href: "/overview",               label: "Dashboard",             Icon: LayoutDashboard },
  { type: "leaf", href: "/users",                  label: "User Management",       Icon: Users },
  { type: "leaf", href: "/verification-management",label: "Verification Management", Icon: ShieldCheck },

  { type: "leaf", href: "/groups", label: "Groups", Icon: FolderOpen },

  {
    type: "group",
    key: "content",
    label: "Content",
    Icon: Layers,
    children: [
      { type: "leaf", href: "/content/learning", label: "Learning", Icon: BookOpen },
      { type: "leaf", href: "/content/jumma-khutbah", label: "Jummah Khutbah", Icon: Video },
    ],
  },


  { type: "leaf", href: "/nearby-mosques",   label: "Nearby Mosques",    Icon: MapPin },
  { type: "leaf", href: "/ask-imam-question", label: "Ask an Imam",   Icon: HelpCircle },
  { type: "leaf", href: "/notifications", label: "Push Notifications",Icon: Bell },
  { type: "leaf", href: "/analytics",     label: "Analytics",         Icon: BarChart2 },
];

/* ── Helpers ────────────────────────────────────────────────────── */
/** Returns true if any descendant leaf matches pathname */
function groupContainsPath(group: NavGroup, path: string): boolean {
  return group.children.some((child) =>
    child.type === "leaf"
      ? path === child.href || path.startsWith(child.href + "/")
      : groupContainsPath(child, path)
  );
}

/* ── Leaf Item ──────────────────────────────────────────────────── */
function NavLeafItem({
  item,
  pathname,
  depth = 0,
}: {
  item: NavLeaf;
  pathname: string;
  depth?: number;
}) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 py-2.5 text-sm transition-all rounded-xl font-semibold",
        depth === 0 ? "px-4" : depth === 1 ? "px-3 pl-10" : "px-3 pl-14",
        isActive
          ? "bg-[#C4A052] text-white shadow-md"
          : "text-slate-600 hover:bg-[#F0EBE1] hover:text-slate-900"
      )}
    >
      <item.Icon
        className={cn(
          "shrink-0",
          depth === 0 ? "h-5 w-5" : "h-4 w-4",
          isActive ? "text-white" : "text-slate-400"
        )}
      />
      <span className={depth > 0 ? "text-xs" : "text-sm"}>{item.label}</span>
    </Link>
  );
}

/* ── Group Item (recursive, collapsible) ────────────────────────── */
function NavGroupItem({
  item,
  pathname,
  depth = 0,
}: {
  item: NavGroup;
  pathname: string;
  depth?: number;
}) {
  const isChildActive = groupContainsPath(item, pathname);
  const [open, setOpen] = useState(isChildActive);

  // Auto-open if navigated into a child
  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  return (
    <div>
      {/* Collapsible trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center gap-3 py-2.5 text-sm transition-all rounded-xl font-semibold",
          depth === 0 ? "px-4" : depth === 1 ? "px-3 pl-10" : "px-3 pl-14",
          isChildActive
            ? "text-[#C4A052] bg-[#F4EFE6]"
            : "text-slate-600 hover:bg-[#F0EBE1] hover:text-slate-900"
        )}
      >
        <item.Icon
          className={cn(
            "shrink-0",
            depth === 0 ? "h-5 w-5" : "h-4 w-4",
            isChildActive ? "text-[#C4A052]" : "text-slate-400"
          )}
        />
        <span className={cn("flex-1 text-left", depth > 0 ? "text-xs" : "text-sm")}>
          {item.label}
        </span>
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform duration-200 shrink-0",
            isChildActive ? "text-[#C4A052]" : "text-slate-400",
            open ? "rotate-90" : ""
          )}
        />
      </button>

      {/* Children */}
      {open && (
        <div className={cn("mt-1 space-y-1", depth === 0 ? "ml-2" : "ml-4")}>
          {/* Left accent line */}
          <div className="relative pl-3 border-l-2 border-[#EAE3D5] ml-4 space-y-1">
            {item.children.map((child) =>
              child.type === "leaf" ? (
                <NavLeafItem
                  key={child.href}
                  item={child}
                  pathname={pathname}
                  depth={depth + 1}
                />
              ) : (
                <NavGroupItem
                  key={child.key}
                  item={child}
                  pathname={pathname}
                  depth={depth + 1}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────── */
export default function Sidebar({ active }: { active?: string }) {
  const pathname = usePathname();
  const current = active ?? pathname ?? "";

  return (
    <aside className="h-screen w-64 bg-[#FCFAF8] text-slate-600 border-r border-slate-200 fixed left-0 top-0 flex flex-col font-cinzel">
      {/* Brand */}
      <div className="p-6 pb-4 border-b border-slate-200/60 shrink-0">
        <h1 className="text-2xl font-semibold text-[#D4AF37] uppercase tracking-wider">SYA ADMIN</h1>
        <p className="text-xs text-slate-500 mt-1">Dashboard Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navTree.map((item) =>
          item.type === "leaf" ? (
            <NavLeafItem key={item.href} item={item} pathname={current} depth={0} />
          ) : (
            <NavGroupItem key={item.key} item={item} pathname={current} depth={0} />
          )
        )}
      </nav>

      {/* Admin profile */}
      <div className="p-4 border-t border-slate-200/60 shrink-0">
        <div className="flex items-center gap-3 p-3 bg-[#F4EFE6] rounded-xl">
          <Avatar className="h-10 w-10 bg-[#C4A052]">
            <AvatarFallback className="bg-[#C4A052] text-white font-semibold">A</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-800 truncate">Admin User</span>
            <span className="text-xs text-slate-500 truncate">admin@sya.app</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
