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
    <div className="p-8 min-h-[calc(100vh-64px)] bg-[#0F172A] text-slate-200 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#C4A052] mb-2">
            <Scale className="h-5 w-5" />
            <span className="text-sm font-medium tracking-widest uppercase">Legal Compliance</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-cinzel">Legal Documents</h1>
          <p className="text-slate-400 mt-2">Manage your legal policies, terms of service, and user agreements.</p>
        </div>
        
        <Link href="/legal/create">
          <Button className="bg-[#C4A052] hover:bg-[#A38541] text-white px-6 py-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[#C4A052]/20 transition-all hover:scale-105 active:scale-95 border-none">
            <Plus className="h-5 w-5" />
            <span className="font-bold">Add New Page</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Documents", value: "12", icon: FileText, color: "text-blue-400" },
          { label: "Published", value: "8", icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Drafts", value: "4", icon: Clock, color: "text-amber-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1E293B]/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search by title..." 
              className="pl-11 bg-[#0F172A] border-slate-800 text-slate-200 focus:ring-[#C4A052] h-12 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-800 bg-[#0F172A] text-slate-300 hover:bg-slate-800 h-12 px-5 rounded-xl gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#0F172A]/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5 pl-8">Title</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5">Slug / Key</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5">Version</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5">Last Updated</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5">Status</TableHead>
                <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LEGAL_DOCS.map((doc) => (
                <TableRow key={doc.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors group">
                  <TableCell className="py-5 pl-8 font-medium text-white">{doc.title}</TableCell>
                  <TableCell className="py-5">
                    <code className="text-[#C4A052] bg-[#C4A052]/10 px-2 py-1 rounded text-xs font-mono">{doc.slug}</code>
                  </TableCell>
                  <TableCell className="py-5 text-slate-400">{doc.version}</TableCell>
                  <TableCell className="py-5 text-slate-400">{doc.lastUpdated}</TableCell>
                  <TableCell className="py-5">
                    <Badge className={
                      doc.status === "Published" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                    }>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 text-right pr-8">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-[#C4A052] hover:bg-[#C4A052]/10 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Fallback for mobile/touch */}
                    <div className="md:hidden">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1E293B] border-slate-800 text-slate-200">
                          <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">View</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">Edit</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-400 cursor-pointer text-red-400">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="text-slate-300 font-medium">1 to 4</span> of <span className="text-slate-300 font-medium">12</span> documents
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-slate-800 bg-[#0F172A] text-slate-500 hover:bg-slate-800 disabled:opacity-30" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Button className="h-9 w-9 bg-[#C4A052] text-white p-0 rounded-lg font-bold">1</Button>
              <Button variant="ghost" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 p-0 rounded-lg font-bold">2</Button>
              <Button variant="ghost" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800 p-0 rounded-lg font-bold">3</Button>
            </div>
            <Button variant="outline" size="icon" className="border-slate-800 bg-[#0F172A] text-slate-500 hover:bg-slate-800">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
