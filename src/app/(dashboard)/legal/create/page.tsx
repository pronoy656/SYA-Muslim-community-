"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Info
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
    <div className="p-8 min-h-[calc(100vh-64px)] bg-[#0F172A] text-slate-200 font-sans">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link 
            href="/legal" 
            className="flex items-center gap-2 text-slate-400 hover:text-[#C4A052] transition-colors mb-3 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Legal Documents</span>
          </Link>
          <h1 className="text-4xl font-bold text-white font-cinzel">Create New Page</h1>
          <p className="text-slate-400 mt-2">Draft and publish legally binding documentation for your organization.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-slate-800 bg-[#1E293B] text-slate-300 hover:bg-slate-800 h-12 px-6 rounded-xl gap-2"
            onClick={() => toast.info("Draft saved locally")}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            className="bg-[#C4A052] hover:bg-[#A38541] text-white h-12 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-[#C4A052]/20 transition-all hover:scale-105 active:scale-95 border-none"
            onClick={handlePublish}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="font-bold">{isSaving ? "Publishing..." : "Publish Page"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-3 block">Page Title</Label>
                <Input 
                  id="title"
                  placeholder="e.g., Privacy Policy 2024" 
                  className="bg-[#0F172A] border-slate-800 text-white text-xl font-medium h-14 rounded-2xl px-6 focus:ring-[#C4A052] focus:border-[#C4A052]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-3 block">Page Content</Label>
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden focus-within:border-[#C4A052] transition-colors">
                  {/* Fake Toolbar */}
                  <div className="flex items-center gap-1 p-2 bg-[#1E293B] border-b border-slate-800">
                    <div className="flex items-center gap-1 border-r border-slate-800 pr-2 mr-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"><Heading1 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"><Heading2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"><Heading3 className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex items-center gap-1 border-r border-slate-800 pr-2 mr-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md font-bold text-sm">B</Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md italic text-sm">I</Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md underline text-sm">U</Button>
                    </div>
                    <div className="flex items-center gap-1 border-r border-slate-800 pr-2 mr-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"><List className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"><LinkIcon className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"><AlignLeft className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"><AlignCenter className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md"><AlignRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <Textarea 
                    id="content"
                    placeholder="Start typing your document content here..." 
                    className="bg-transparent border-none text-slate-300 min-h-[400px] p-6 focus-visible:ring-0 resize-none leading-relaxed text-lg"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-[#C4A052]" />
              Document Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-slate-400 text-xs font-bold uppercase mb-2 block">Slug / URL Key</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs">/legal/</span>
                  <Input 
                    placeholder="privacy-policy" 
                    className="pl-16 bg-[#0F172A] border-slate-800 text-slate-200 h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-400 text-xs font-bold uppercase mb-2 block">Version</Label>
                <Input 
                  placeholder="v1.0" 
                  className="bg-[#0F172A] border-slate-800 text-slate-200 h-10 rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-300">Publicly visible</span>
                  <div className="h-6 w-11 bg-[#C4A052] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Requires acceptance</span>
                  <div className="h-6 w-11 bg-slate-700 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 h-4 w-4 bg-slate-400 rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#C4A052]/5 border border-[#C4A052]/20 rounded-3xl p-6">
            <h3 className="text-[#C4A052] font-bold mb-2 text-sm">Quick Tip</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Use Markdown-like formatting for better clarity. Remember to update the version number whenever you make significant changes to published policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
