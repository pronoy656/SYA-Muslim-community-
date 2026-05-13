"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  AlertTriangle,
  Loader2
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
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";

interface LegalDoc {
  slug: string;
  title: string;
  updatedAt?: string;
}

export default function LegalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<LegalDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/legal");
      setDocuments(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch legal documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async () => {
    if (!deletingSlug) return;
    try {
      setIsDeleting(true);
      await axiosSecure.delete(`/legal/${deletingSlug}`);
      toast.success("Document deleted successfully");
      setDocuments(p => p.filter(d => d.slug !== deletingSlug));
      setDeletingSlug(null);
    } catch (error) {
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-[#FCFAF8] text-slate-800 font-sans">
      
      {/* Delete Confirmation */}
      {deletingSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeletingSlug(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Delete Document</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Delete <span className="font-semibold text-slate-700">"{documents.find(d => d.slug === deletingSlug)?.title}"</span>?{" "}
                This <span className="text-red-500 font-semibold">cannot be undone</span>.
              </p>
            </div>
            <div className="px-8 pb-8 flex gap-3">
              <button onClick={() => setDeletingSlug(null)} className="flex-1 py-3 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all disabled:opacity-50">
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-[#C4A052] animate-spin" />
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
              No documents found.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#FAF7F2]">
                <TableRow className="border-[#EAE3D5] hover:bg-transparent">
                  <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6 pl-10">Title</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6">Slug / Key</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6">Status</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] py-6 text-right pr-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.slug} className="border-[#EAE3D5] hover:bg-[#FAF7F2]/50 transition-colors group">
                    <TableCell className="py-6 pl-10 font-bold text-slate-800 font-cinzel tracking-wide text-base">{doc.title}</TableCell>
                    <TableCell className="py-6">
                      <code className="text-[#C4A052] bg-[#FAF7F2] border border-[#E0D4BC] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold">{doc.slug}</code>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 rounded-lg px-3 py-1 text-[10px] font-bold shadow-none">
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 text-right pr-10">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Link href={`/legal/create?slug=${doc.slug}`}>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-[#C4A052] hover:bg-[#C4A052]/10 rounded-xl transition-all">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingSlug(doc.slug)} className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
