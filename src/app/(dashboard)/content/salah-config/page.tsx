"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Book, ChevronDown, ChevronUp, Info, 
  Clock, Edit2, Play, Loader2, Search, Hash, Save, CheckCircle2,
  Pause, Volume2
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

interface Verse {
  verseNumber: number;
  verseKey: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  audioUrl: string | null;
}

interface Rakat {
  rakat: number;
  surahNumber: number;
  surahName: string;
  verses: Verse[];
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
function RakatSection({ 
  rakat, 
  isEditing, 
  onSurahChange 
}: { 
  rakat: Rakat; 
  isEditing: boolean;
  onSurahChange: (surahNumber: number) => void;
}) {
  const [surahNumber, setSurahNumber] = useState(rakat.surahNumber);
  const [searchQuery, setSearchQuery] = useState("");
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [playingVerseKey, setPlayingVerseKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayToggle = (verse: Verse) => {
    if (playingVerseKey === verse.verseKey) {
      // Already playing this verse, so pause it
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingVerseKey(null);
    } else {
      // Playing a new verse or nothing was playing
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (verse.audioUrl) {
        audioRef.current = new Audio(verse.audioUrl);
        audioRef.current.play().catch(e => {
          console.error("Failed to play audio", e);
          toast.error("Failed to play recitation");
          setPlayingVerseKey(null);
        });
        
        audioRef.current.onended = () => {
          setPlayingVerseKey(null);
        };
        
        setPlayingVerseKey(verse.verseKey);
      }
    }
  };

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
     onSurahChange(surah.id);
   };

   const handleNumberChange = (num: number) => {
     setSurahNumber(num);
     onSurahChange(num);
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
               onChange={(e) => handleNumberChange(parseInt(e.target.value) || 0)}
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

       <div className="space-y-4">
        {rakat.verses.map((verse) => {
          const isPlaying = playingVerseKey === verse.verseKey;
          
          return (
            <div 
              key={verse.verseKey} 
              className={cn(
                "border rounded-[2rem] p-7 space-y-6 transition-all duration-500 relative overflow-hidden",
                isPlaying 
                  ? "bg-white border-[#C4A052] shadow-lg scale-[1.01] z-10" 
                  : "bg-[#FCFAF8]/50 border-[#EAE3D5] hover:bg-white hover:shadow-md"
              )}
            >
              {/* Playing indicator background glow */}
              {isPlaying && (
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C4A052] animate-pulse" />
              )}

              {/* Verse Header with Number and Audio */}
              <div className="flex items-center justify-between border-b border-[#EAE3D5]/40 pb-4">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "h-8 w-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors duration-500",
                    isPlaying ? "bg-[#C4A052] text-white shadow-md shadow-[#C4A052]/20" : "bg-[#F4EFE6] text-[#C4A052]"
                  )}>
                    {verse.verseNumber}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Verse {verse.verseKey}
                    </span>
                    {isPlaying && (
                      <span className="text-[9px] font-bold text-[#C4A052] uppercase animate-pulse">
                        Currently Playing
                      </span>
                    )}
                  </div>
                </div>
                {verse.audioUrl && (
                  <button 
                    onClick={() => handlePlayToggle(verse)}
                    className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm",
                      isPlaying 
                        ? "bg-[#C4A052] text-white rotate-180" 
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    )}
                    title={isPlaying ? "Pause Recitation" : "Play Verse Recitation"}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 fill-white" />
                    ) : (
                      <Play className="h-4 w-4 fill-emerald-600 ml-0.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Arabic Text Display */}
              <div className="text-right">
                <p className={cn(
                  "text-3xl font-bold leading-[3.5rem] font-sans transition-colors duration-500",
                  isPlaying ? "text-slate-900" : "text-slate-800"
                )} dir="rtl">
                  {verse.arabicText}
                </p>
              </div>

              {/* Transliteration & Translation Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-[#EAE3D5]/40">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#C4A052] uppercase tracking-[0.2em]">Transliteration</span>
                    {isPlaying && <Volume2 className="h-3 w-3 text-[#C4A052] animate-bounce" />}
                  </div>
                  <p className={cn(
                    "text-sm font-medium italic leading-relaxed transition-colors duration-500",
                    isPlaying ? "text-[#C4A052]" : "text-slate-700"
                  )}>
                    {verse.transliteration}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Translation</span>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {verse.translation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
     </div>
   );
}

/* ── Salah Config Card ────────────────────────────────────────── */
function SalahConfigCard({ config, onUpdate }: { 
  config: SalahConfig; 
  onUpdate: (updatedConfig: SalahConfig) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedRakats, setEditedRakats] = useState(config.rakats);

  const handleSurahChange = (rakatNumber: number, surahNumber: number) => {
    setEditedRakats(prev => prev.map(r => 
      r.rakat === rakatNumber ? { ...r, surahNumber } : r
    ));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload = {
        rakats: editedRakats.map(r => ({
          rakat: r.rakat,
          surahNumber: r.surahNumber
        }))
      };

      const response = await axiosSecure.put(`/namaz/salah-config/${config.salahType}`, payload);
      
      if (response.data.success) {
        toast.success(`${config.salahType} Salah config saved successfully`);
        onUpdate(response.data.data);
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

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
                isEditing ? "bg-amber-100 text-[#C4A052] border border-[#C4A052]" : "bg-slate-50 text-slate-400 hover:bg-[#C4A052] hover:text-white"
              )}
              title={isEditing ? "Save Config" : "Edit Config"}
            >
              <Edit2 className="h-4 w-4" />
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
              <RakatSection 
                key={idx} 
                rakat={rakat} 
                isEditing={isEditing} 
                onSurahChange={(surahNumber) => handleSurahChange(rakat.rakat, surahNumber)}
              />
            ))}
          </div>

          {/* Save Button - Only visible in edit mode */}
          {isEditing && (
            <div className="flex justify-center pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-10 py-4 bg-[#C4A052] hover:bg-[#A8873A] text-white font-bold rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save {config.salahType} Configuration
                  </>
                )}
              </button>
            </div>
          )}
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

  const handleUpdateConfig = (updatedConfig: SalahConfig) => {
    setSalahConfigs(prev => prev.map(c => 
      c.salahType === updatedConfig.salahType ? updatedConfig : c
    ));
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
                onUpdate={handleUpdateConfig}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
