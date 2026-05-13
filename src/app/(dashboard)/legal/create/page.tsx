"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  List, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateLegalPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handlePublish = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Legal document published successfully!");
      router.push("/legal");
    }, 1500);
  };

  return (
    <div className="p-8 min-h-screen bg-[#FCFAF8]">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/legal" 
              className="flex items-center gap-2 text-slate-500 hover:text-[#C4A052] transition-colors mb-3 group font-sans"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Legal Documents</span>
            </Link>
            <h1 className="text-3xl font-normal text-slate-800 font-cinzel tracking-wider uppercase">Create New Page</h1>
            <p className="text-slate-500 mt-2 font-sans text-sm">Draft and publish legally binding documentation for your organization.</p>
          </div>
          
          <div className="flex items-center gap-3 font-sans">
            <Button 
              variant="outline" 
              className="border border-[#C8B99A] bg-white text-slate-600 hover:bg-[#F4EFE6] h-12 px-6 rounded-2xl gap-2 font-semibold shadow-sm transition-all"
              onClick={() => toast.info("Draft saved locally")}
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button 
              className="bg-[#C4A052] hover:bg-[#A8873A] text-white h-12 px-8 rounded-2xl flex items-center gap-2 shadow-sm transition-all font-semibold"
              onClick={handlePublish}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isSaving ? "Publishing..." : "Publish Page"}</span>
            </Button>
          </div>
        </div>

        {/* Main Editor */}
        <div className="bg-white border border-[#EAE3D5] rounded-3xl p-8 shadow-sm font-sans">
          <div className="space-y-8">
            <div>
              <Label htmlFor="title" className="text-slate-700 text-sm font-bold uppercase tracking-wide mb-3 block">Page Title</Label>
              <Input 
                id="title"
                placeholder="e.g., Privacy Policy 2024" 
                className="w-full px-4 py-4 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-lg font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-slate-700 text-sm font-bold uppercase tracking-wide mb-3 block">Page Content</Label>
              <div className="bg-[#FAF7F2] border border-[#E0D4BC] rounded-2xl overflow-hidden focus-within:border-[#C4A052] focus-within:ring-2 focus-within:ring-[#C4A052]/40 transition-colors">
                {/* Fake Toolbar */}
                <div className="flex items-center gap-1 p-2 bg-white border-b border-[#E0D4BC]">
                  <div className="flex items-center gap-1 border-r border-[#E0D4BC] pr-2 mr-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md"><Heading1 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md"><Heading2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md"><Heading3 className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex items-center gap-1 border-r border-[#E0D4BC] pr-2 mr-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md font-bold text-sm">B</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md italic text-sm">I</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md underline text-sm">U</Button>
                  </div>
                  <div className="flex items-center gap-1 border-r border-[#E0D4BC] pr-2 mr-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md"><List className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md"><LinkIcon className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md"><AlignLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md"><AlignCenter className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-[#F4EFE6] rounded-md"><AlignRight className="h-4 w-4" /></Button>
                  </div>
                </div>
                <Textarea 
                  id="content"
                  placeholder="Start typing your document content here..." 
                  className="bg-transparent border-none text-slate-700 min-h-[400px] p-6 focus-visible:ring-0 resize-none leading-relaxed text-base placeholder:text-slate-400"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
