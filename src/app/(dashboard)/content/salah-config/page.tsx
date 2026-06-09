"use client";
import React, { useState, useEffect } from "react";
import {
  Book, ChevronDown, ChevronUp, Info, 
  Clock, Edit2, Trash2, Play, Loader2, Search, Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

interface Surah {
  id: number;
  nameSimple: string;
  nameArabic: string;
  revelationPlace: string;
  versesCount: number;
  translatedName: {
    languageName: string;
    name: string;
  };
}

interface SurahListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    code: number;
    status: string;
    data: {
      chapters: Surah[];
    };
  };
}

interface WordByWord {
  arabic: string;
  transliteration: string;
  meaning: string;
}

interface Rakat {
  rakat: number;
  surahNumber: number;
  surahName: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  wordByWord: WordByWord[];
  audioUrl: string | null;
}

interface SalahConfig {
  id: string;
  salahType: string;
  rakats: Rakat[];
  createdAt: string;
  updatedAt: string;
}

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </span>
);

/* ── Rakat Section ────────────────────────────────────────────── */
function RakatSection({ rakat, isEditing }: { rakat: Rakat; isEditing: boolean }) {
  const [surahNumber, setSurahNumber] = useState(rakat.surahNumber);
  const [searchQuery, setSearchQuery] = useState("");
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
     const words = debouncedSearch.trim().split(/\s+/);
     if (debouncedSearch.trim().length >= 3 || words.length >= 2) {
       fetchSurahs(debouncedSearch);
     } else {
       setSurahList([]);
       setShowDropdown(false);
     }
   }, [debouncedSearch]);

   const fetchSurahs = async (query: string) => {
     try {
       setIsSearching(true);
       const response = await axiosSecure.get<SurahListResponse>(`/namaz/surah-list?search=${query}`);
       const chapters = response.data.data.data.chapters;
       
       // Filter chapters based on query (searching in name, translation, and ID)
       const filtered = chapters.filter(s => 
         (s.nameSimple?.toLowerCase() || "").includes(query.toLowerCase()) || 
         (s.translatedName?.name?.toLowerCase() || "").includes(query.toLowerCase()) ||
         s.id?.toString() === query
       );
       setSurahList(filtered);
       setShowDropdown(true);
     } catch (error) {
       console.error("Failed to fetch surahs", error);
     } finally {
       setIsSearching(false);
     }
   };

   const handleSelectSurah = (surah: Surah) => {
     setSurahNumber(surah.id);
     setSearchQuery(surah.nameSimple);
     setShowDropdown(false);
   };

   return (
     <div className="relative pl-8 border-l-2 border-[#F4EFE6] space-y-6">
       {/* Rakat Indicator Pin */}
       <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-white border-4 border-[#C4A052] shadow-sm" />

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-1">
           <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
             Rakat {rakat.rakat} 
             <span className="h-1 w-1 rounded-full bg-[#C4A052]" />
             Surah {rakat.surahName}
           </h4>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             Surah Number: {rakat.surahNumber}
           </p>
         </div>
         {rakat.audioUrl && (
           <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors">
             <Play className="h-3 w-3 fill-emerald-600" /> Play Recitation
           </button>
         )}
       </div>

       {/* Input Fields for Surah Number and Search - Only visible in editing mode */}
       {isEditing && (
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
           <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pl-1">
               <Hash className="h-3 w-3 text-[#C4A052]" /> Surah Number
             </label>
             <input 
               type="number" 
               value={surahNumber}
               onChange={(e) => setSurahNumber(parseInt(e.target.value) || 0)}
               placeholder="e.g. 112" 
               className="w-full px-4 py-2.5 rounded-xl border border-[#E0D4BC] bg-[#FCFAF8] text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans"
             />
           </div>
           <div className="space-y-1.5 relative">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pl-1">
               <Search className="h-3 w-3 text-[#C4A052]" /> Search Surah / Ayah
             </label>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onFocus={() => {
                   const words = searchQuery.trim().split(/\s+/);
                   if (searchQuery.trim().length >= 3 || words.length >= 2) setShowDropdown(true);
                 }}
                 placeholder="Search by name or translation..." 
                 className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E0D4BC] bg-[#FCFAF8] text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans"
               />
               {isSearching && (
                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
                   <Loader2 className="h-3.5 w-3.5 text-[#C4A052] animate-spin" />
                 </div>
               )}
             </div>

             {/* Dropdown for Search Results */}
             {showDropdown && surahList.length > 0 && (
               <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#EAE3D5] rounded-xl shadow-xl max-h-60 overflow-y-auto">
                 {surahList.map((surah) => (
                   <div 
                     key={surah.id}
                     onClick={() => handleSelectSurah(surah)}
                     className="px-4 py-2.5 hover:bg-[#F4EFE6] cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
                   >
                     <div>
                       <p className="text-xs font-bold text-slate-700">{surah.nameSimple}</p>
                       <p className="text-[10px] text-slate-400">{surah.translatedName?.name}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-sm font-bold text-[#C4A052] font-sans" dir="rtl">{surah.nameArabic}</p>
                       <p className="text-[9px] font-bold text-slate-400">#{surah.id}</p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
             {showDropdown && searchQuery && surahList.length === 0 && !isSearching && (
               <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#EAE3D5] rounded-xl shadow-xl p-4 text-center">
                 <p className="text-xs text-slate-400 italic">No matches found</p>
               </div>
             )}
           </div>
         </div>
       )}

      <div className="bg-[#FCFAF8]/50 border border-[#EAE3D5] rounded-[2rem] p-7 space-y-6 hover:bg-white hover:shadow-md transition-all duration-300">
        {/* Arabic Text Display */}
        <div className="text-right py-4">
          <p className="text-3xl font-bold text-slate-800 leading-[3rem] font-sans" dir="rtl">
            {rakat.arabicText}
          </p>
        </div>

        {/* Transliteration & Translation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-[#EAE3D5]/40">
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-[#C4A052] uppercase tracking-[0.2em]">Transliteration</span>
            <p className="text-sm text-slate-700 font-medium italic leading-relaxed">
              {rakat.transliteration}
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Translation</span>
            <p className="text-sm text-slate-600 leading-relaxed">
              {rakat.translation}
            </p>
          </div>
        </div>

        {/* Word by Word Analysis */}
        <div className="pt-6 border-t border-[#EAE3D5]/40">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-6 w-6 rounded-lg bg-[#F4EFE6] flex items-center justify-center">
              <Info className="h-3 w-3 text-[#C4A052]" />
            </div>
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Word by Word Breakdown
            </h5>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {rakat.wordByWord.map((word, wIdx) => (
              <div key={wIdx} className="bg-white border border-[#EAE3D5] rounded-2xl p-3 text-center min-w-[80px] hover:border-[#C4A052] transition-colors group/word shadow-sm">
                <p className="text-xl font-bold text-slate-800 mb-1 group-hover/word:text-[#C4A052] transition-colors" dir="rtl">{word.arabic}</p>
                <div className="space-y-0.5">
                  <p className="text-[9px] text-[#C4A052] font-bold uppercase tracking-tighter">{word.transliteration}</p>
                  <p className="text-[10px] text-slate-400 font-medium italic">{word.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Salah Config Card ────────────────────────────────────────── */
function SalahConfigCard({ config, onDelete }: { 
  config: SalahConfig; 
  onDelete: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white border border-[#EAE3D5] rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden font-sans group">
      {/* Header Section */}
      <div className="p-7">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-[1.25rem] bg-[#F4EFE6] flex items-center justify-center shrink-0 group-hover:bg-[#C4A052] transition-all duration-500">
              <Book className="h-7 w-7 text-[#C4A052] group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-800 font-cinzel uppercase tracking-wider">
                  {config.salahType}
                </h3>
                <Badge className="bg-[#F4EFE6] text-[#C4A052] border-none px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                  {config.rakats.length} Rakats
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> 
                Last updated: {new Date(config.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); if(!isExpanded) setIsExpanded(true); }}
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-xl transition-all shadow-sm",
                isEditing ? "bg-[#C4A052] text-white" : "bg-slate-50 text-slate-400 hover:bg-[#C4A052] hover:text-white"
              )}
              title={isEditing ? "Save Config" : "Edit Config"}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="Delete Config"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-xl transition-all shadow-sm ml-2",
                isExpanded ? "bg-[#C4A052] text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-7 pb-8 space-y-8 animate-in slide-in-from-top-4 duration-500 ease-out">
          <div className="h-px bg-gradient-to-r from-transparent via-[#EAE3D5] to-transparent opacity-60" />
          
          <div className="space-y-10">
            {config.rakats.map((rakat, idx) => (
              <RakatSection key={idx} rakat={rakat} isEditing={isEditing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SalahConfigPage() {
  const [salahConfigs, setSalahConfigs] = useState<SalahConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSalahConfigs = async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/namaz/salah-config");
      setSalahConfigs(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch salah configs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalahConfigs();
  }, []);

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">
      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6">
        <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
          Salah Configuration
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-sans">
          Review and verify configured Salah types, Rakats, and Surah details
        </p>
      </div>

      {/* Content grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-[#C4A052] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 ">
          {salahConfigs.length === 0 ? (
            <div className="text-center py-24 text-slate-400 font-sans">
              No salah configurations found.
            </div>
          ) : (
            salahConfigs.map(config => (
              <SalahConfigCard 
                key={config.id} 
                config={config} 
                onDelete={() => toast.info(`Deleting ${config.salahType} Salah config...`)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
