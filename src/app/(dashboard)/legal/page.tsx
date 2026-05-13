"use client";

import React, { useState } from "react";
import { 
  Scale, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LEGAL_DOCS = [
  {
    id: 1,
    title: "Privacy Policy",
    slug: "privacy-policy",
    lastUpdated: "Oct 12, 2023",
    status: "Published",
    version: "v2.4",
  },
  {
    id: 2,
    title: "Terms of Service",
    slug: "terms-of-service",
    lastUpdated: "Sep 28, 2023",
    status: "Draft",
    version: "v1.1",
  },
  {
    id: 3,
    title: "Cookie Policy",
    slug: "cookie-policy",
    lastUpdated: "Aug 05, 2023",
    status: "Published",
    version: "v1.0",
  },
  {
    id: 4,
    title: "End User License Agreement",
    slug: "eula",
    lastUpdated: "Jul 20, 2023",
    status: "Draft",
    version: "v3.0",
  },
];

export default function LegalPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-[#FCFAF8] text-slate-800 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[#C4A052] mb-2">
            <Scale className="h-5 w-5" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">Legal Compliance</span>
          </div>
          <h1 className="text-4xl font-normal text-slate-900 font-cinzel tracking-widest uppercase">Legal Documents</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-xl">Manage your legal policies, terms of service, and user agreements with a unified administrative oversight.</p>
        </div>
        
        <Link href="/legal/create">
          <Button className="bg-[#C4A052] hover:bg-[#A38541] text-white px-8 py-7 rounded-2xl flex items-center gap-2 shadow-xl shadow-[#C4A052]/20 transition-all hover:scale-105 active:scale-95 border-none font-bold uppercase tracking-widest text-xs">
            <Plus className="h-5 w-5" />
            Add New Page
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Documents", value: "12", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Published", value: "8", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Drafts", value: "4", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#EAE3D5] p-6 rounded-[2rem] shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-4xl font-normal text-slate-900 mt-1 font-cinzel">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
              <stat.icon className="h-7 w-7" />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white border border-[#EAE3D5] rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[#EAE3D5] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FAF7F2]/30">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by title..." 
              className="pl-12 bg-[#FAF7F2] border-[#E0D4BC] text-slate-800 placeholder:text-slate-400 focus:ring-[#C4A052] h-14 rounded-2xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[#E0D4BC] bg-white text-slate-600 hover:bg-[#FAF7F2] h-14 px-7 rounded-2xl gap-3 font-bold text-xs uppercase tracking-widest transition-all">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#FAF7F2]">
              <TableRow className="border-[#EAE3D5] hover:bg-transparent">
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6 pl-10">Title</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6">Slug / Key</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6">Version</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6">Last Updated</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6">Status</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6 text-right pr-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LEGAL_DOCS.map((doc) => (
                <TableRow key={doc.id} className="border-[#EAE3D5] hover:bg-[#FAF7F2]/50 transition-colors group">
                  <TableCell className="py-6 pl-10 font-bold text-slate-800 font-cinzel tracking-wide">{doc.title}</TableCell>
                  <TableCell className="py-6">
                    <code className="text-[#C4A052] bg-[#FAF7F2] border border-[#E0D4BC] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold">{doc.slug}</code>
                  </TableCell>
                  <TableCell className="py-6 text-slate-500 text-sm">{doc.version}</TableCell>
                  <TableCell className="py-6 text-slate-500 text-sm">{doc.lastUpdated}</TableCell>
                  <TableCell className="py-6">
                    <Badge className={
                      doc.status === "Published" 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 rounded-lg px-3 py-1 text-[10px] font-bold" 
                      : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 rounded-lg px-3 py-1 text-[10px] font-bold"
                    }>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-right pr-10">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-[#FAF7F2] rounded-xl transition-all">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-[#C4A052] hover:bg-[#C4A052]/10 rounded-xl transition-all">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-[#EAE3D5] flex items-center justify-between bg-[#FAF7F2]/20">
          <p className="text-xs text-slate-400 font-medium">
            Showing <span className="text-slate-800 font-bold">1 to 4</span> of <span className="text-slate-800 font-bold">12</span> documents
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="border-[#E0D4BC] bg-white text-slate-400 hover:bg-[#FAF7F2] rounded-xl h-10 w-10" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              <Button className="h-10 w-10 bg-[#C4A052] text-white p-0 rounded-xl font-bold text-xs shadow-lg shadow-[#C4A052]/20">1</Button>
              <Button variant="ghost" className="h-10 w-10 text-slate-500 hover:text-[#C4A052] hover:bg-[#C4A052]/10 p-0 rounded-xl font-bold text-xs">2</Button>
              <Button variant="ghost" className="h-10 w-10 text-slate-500 hover:text-[#C4A052] hover:bg-[#C4A052]/10 p-0 rounded-xl font-bold text-xs">3</Button>
            </div>
            <Button variant="outline" size="icon" className="border-[#E0D4BC] bg-white text-slate-400 hover:bg-[#FAF7F2] rounded-xl h-10 w-10">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
