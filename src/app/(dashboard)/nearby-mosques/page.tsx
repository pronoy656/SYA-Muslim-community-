"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Plus, X, MapPin, Phone, Globe, Clock,
  Edit2, Trash2, AlertTriangle, Search,
  Navigation, ExternalLink, Loader2, ImageIcon, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";
import Image from "next/image";

// Load map only on client side (no SSR)
const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah?: string;
  [key: string]: string | undefined;
}

interface Mosque {
  id: string;
  mosqueName: string;
  address: string;
  area: string;
  phoneNumber?: string;
  website?: string;
  description?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  mapLink?: string;
  distanceInKm?: number;
  prayerTimes: PrayerTimes;
  updatedAt?: string;
}

const PRAYER_LABELS = [
  { key: "fajr",    label: "Fajr" },
  { key: "dhuhr",  label: "Dhuhr" },
  { key: "asr",    label: "Asr" },
  { key: "maghrib",label: "Maghrib" },
  { key: "isha",   label: "Isha" },
  { key: "jummah", label: "Jummah" },
] as const;

const PRAYER_COLORS: Record<string, string> = {
  fajr:    "bg-sky-50 text-sky-600",
  dhuhr:   "bg-amber-50 text-amber-600",
  asr:     "bg-orange-50 text-orange-500",
  maghrib: "bg-rose-50 text-rose-500",
  isha:    "bg-indigo-50 text-indigo-600",
  jummah:  "bg-emerald-50 text-emerald-600",
};

/* ── Shared input style ─────────────────────────────────────────── */
const inputClass = "w-full px-4 py-3 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all font-sans";

/* ── Delete Dialog ─────────────────────────────────────────────── */
function DeleteDialog({ name, onClose, onConfirm, isDeleting }: {
  name: string; onClose: () => void; onConfirm: () => void; isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 font-sans overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-8 py-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-cinzel mb-2">Delete Mosque</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Delete <span className="font-semibold text-slate-700">"{name}"</span>?{" "}
            This <span className="text-red-500 font-semibold">cannot be undone</span>.
          </p>
        </div>
        <div className="px-8 pb-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all disabled:opacity-50">
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Map Modal ─────────────────────────────────────────────────── */
function MapModal({ onClose, onSelect }: {
  onClose: () => void;
  onSelect: (lat: number, lng: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden font-sans" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 font-cinzel">Pick Location on Map</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click anywhere on the map to place a pin</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-6 pb-6">
          <MapPicker
            onSelect={(lat, lng) => {
              onSelect(lat, lng);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Add/Edit Mosque Dialog ─────────────────────────────────────────── */
function MosqueDialog({ onClose, onSave, editingItem }: {
  onClose: () => void;
  onSave: () => void;
  editingItem?: Mosque | null;
}) {
  const [mosqueName, setMosqueName] = useState(editingItem?.mosqueName || "");
  const [address, setAddress] = useState(editingItem?.address || "");
  const [area, setArea] = useState(editingItem?.area || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [lat, setLat] = useState<number | null>(editingItem?.latitude ?? null);
  const [lng, setLng] = useState<number | null>(editingItem?.longitude ?? null);
  const [showMap, setShowMap] = useState(false);
  const [phone, setPhone] = useState(editingItem?.phoneNumber || "");
  const [website, setWebsite] = useState(editingItem?.website || "");
  const [pt, setPt] = useState<PrayerTimes>(
    editingItem?.prayerTimes || { fajr: "", dhuhr: "", asr: "", maghrib: "", isha: "", jummah: "" }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editingItem?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = mosqueName.trim() && address.trim() && area.trim();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("mosqueName", mosqueName.trim());
      formData.append("address", address.trim());
      formData.append("area", area.trim());
      if (phone.trim()) formData.append("phoneNumber", phone.trim());
      if (website.trim()) formData.append("website", website.trim());
      if (description.trim()) formData.append("description", description.trim());

      // location as GeoJSON Point string
      if (lat != null && lng != null) {
        formData.append(
          "location",
          JSON.stringify({ type: "Point", coordinates: [lng, lat] })
        );
      }

      // prayerTimes as JSON string
      formData.append("prayerTimes", JSON.stringify(pt));

      // image file (optional)
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingItem) {
        await axiosSecure.patch(`/mosques/${editingItem.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Mosque updated successfully");
      } else {
        await axiosSecure.post("/mosques", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Mosque created successfully");
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save mosque");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showMap && (
        <MapModal
          onClose={() => setShowMap(false)}
          onSelect={(la, ln) => { setLat(la); setLng(ln); }}
        />
      )}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden font-sans flex flex-col max-h-[92vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 pt-7 pb-3 flex items-start justify-between shrink-0">
            <div>
              <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">
                {editingItem ? "Edit Mosque" : "Add Mosque"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {editingItem ? "Update details for the mosque" : "Add a new mosque to the directory"}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500 ml-4 shrink-0"><X className="h-5 w-5" /></button>
          </div>

          {/* Form */}
          <div className="px-8 py-4 space-y-4 overflow-y-auto flex-1">

            {/* Image Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[#C4A052]" /> Mosque Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-36 rounded-2xl border-2 border-dashed border-[#E0D4BC] bg-[#FAF7F2] flex items-center justify-center cursor-pointer hover:border-[#C4A052] hover:bg-[#F4EFE6] transition-all overflow-hidden"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Mosque preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-semibold">Click to change</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-xs font-medium">Click to upload mosque image</span>
                    <span className="text-[10px]">JPG, PNG, JPEG (max 1)</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Mosque Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C4A052]" /> Mosque Name <span className="text-red-400">*</span>
              </label>
              <input value={mosqueName} onChange={e => setMosqueName(e.target.value)} placeholder="e.g. Central Masjid" className={inputClass} />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Address <span className="text-red-400">*</span></label>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 12 Mosque Lane, City Centre" className={inputClass} />
            </div>

            {/* Area + Location — 2 cols */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Area / District <span className="text-red-400">*</span></label>
                <input value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Northside" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-[#C4A052]" /> Location
                </label>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all font-sans text-left",
                    lat != null
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-[#E0D4BC] bg-[#FAF7F2] text-slate-400 hover:border-[#C4A052] hover:text-[#C4A052]"
                  )}
                >
                  <Navigation className="h-4 w-4 shrink-0" />
                  {lat != null
                    ? `${lat.toFixed(5)}, ${lng?.toFixed(5)}`
                    : "Click to pick on map..."}
                </button>
              </div>
            </div>

            {/* Phone + Website — 2 cols */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#C4A052]" /> Phone Number
                </label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880 00 0000 0000" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-[#C4A052]" /> Website
                </label>
                <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#C4A052]" /> Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of the mosque (optional)"
                rows={3}
                className={cn(inputClass, "resize-none")}
              />
            </div>

            {/* Prayer Times */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C4A052]" /> Prayer Times
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRAYER_LABELS.map(({ key, label }) => (
                  <div key={key} className={cn(
                    "flex items-center p-1.5 rounded-xl border border-[#E0D4BC] bg-[#FAF7F2] focus-within:ring-2 focus-within:ring-[#C4A052]/40 focus-within:border-[#C4A052] transition-all"
                  )}>
                    <div className={cn(
                      "w-[84px] shrink-0 text-center text-[10px] font-bold py-1.5 rounded-lg font-sans uppercase tracking-wider",
                      PRAYER_COLORS[key]
                    )}>
                      {label}
                    </div>
                    <input
                      type="time"
                      value={pt[key] || ""}
                      onChange={e => setPt(prev => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 w-full min-w-0 bg-transparent text-slate-700 text-sm font-semibold focus:outline-none font-sans px-3 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-7 pt-4 flex gap-3 shrink-0 border-t border-[#EAE3D5]">
            <button onClick={onClose} className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all">Cancel</button>
            <button
              onClick={handleSave}
              disabled={!canSubmit || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingItem ? "Update Mosque" : "Add Mosque"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Mosque Card ───────────────────────────────────────────────── */
function MosqueCard({ mosque, onDelete, onEdit }: {
  mosque: Mosque;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const hasImage = mosque.image && mosque.image.trim() !== "";
  const hasDistance = mosque.distanceInKm !== undefined && mosque.distanceInKm > 0;

  return (
    <div className="bg-white border border-[#EAE3D5] rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Image or gradient bar */}
      {hasImage ? (
        <div className="relative h-36 overflow-hidden">
          <img
            src={mosque.image!}
            alt={mosque.mosqueName}
            className="w-full h-full object-cover"
            onError={e => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.classList.add("fallback-bar");
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {hasDistance && (
            <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm font-sans">
              {mosque.distanceInKm!.toFixed(1)} km away
            </span>
          )}
        </div>
      ) : (
        <div className="relative h-1.5 bg-gradient-to-r from-[#C4A052] to-[#E8C97A]">
          {hasDistance && (
            <span className="absolute -bottom-6 right-3 bg-[#F4EFE6] text-[#C4A052] text-[10px] font-semibold px-2.5 py-1 rounded-full font-sans">
              {mosque.distanceInKm!.toFixed(1)} km away
            </span>
          )}
        </div>
      )}

      <div className={cn("p-6", !hasImage && hasDistance && "pt-8")}>
        {/* Name + area badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#F4EFE6] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="h-5 w-5 text-[#C4A052]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-cinzel uppercase tracking-wide leading-snug">
                {mosque.mosqueName}
              </h3>
              <span className="inline-flex items-center mt-1 px-2.5 py-0.5 bg-[#F4EFE6] text-[#C4A052] text-[10px] font-semibold rounded-lg font-sans">
                {mosque.area}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <p className="text-xs text-slate-500 font-sans mb-2 leading-relaxed pl-1">
          📍 {mosque.address}
        </p>

        {/* Description */}
        {mosque.description && (
          <p className="text-xs text-slate-400 font-sans mb-3 leading-relaxed pl-1 line-clamp-2 italic">
            {mosque.description}
          </p>
        )}

        {/* Contact row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {mosque.phoneNumber && (
            <a href={`tel:${mosque.phoneNumber}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#C4A052] transition-colors font-sans">
              <Phone className="h-3.5 w-3.5" />
              {mosque.phoneNumber}
            </a>
          )}
          {mosque.website && (
            <a href={mosque.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#C4A052] transition-colors font-sans">
              <Globe className="h-3.5 w-3.5" />
              Website
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
          {mosque.mapLink && (
            <a
              href={mosque.mapLink}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#C4A052] transition-colors font-sans"
            >
              <Navigation className="h-3.5 w-3.5" />
              Directions
            </a>
          )}
        </div>

        {/* Prayer Times grid */}
        <div className="grid grid-cols-3 gap-1.5 mb-5">
          {PRAYER_LABELS.map(({ key, label }) => (
            <div key={key} className={cn("rounded-xl p-2 text-center", PRAYER_COLORS[key].split(" ")[0])}>
              <p className={cn("text-[9px] font-bold uppercase tracking-wide font-sans", PRAYER_COLORS[key].split(" ")[1])}>{label}</p>
              <p className={cn("text-[11px] font-semibold mt-0.5 font-sans", PRAYER_COLORS[key].split(" ")[1])}>
                {mosque.prayerTimes?.[key] || "—"}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F4EFE6] hover:bg-[#E8DCC8] rounded-2xl text-sm font-semibold text-[#C4A052] transition-all font-sans">
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="h-10 w-10 flex items-center justify-center rounded-2xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function NearbyMosquesPage() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Mosque | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const fetchMosques = async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/mosques");
      setMosques(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load mosques");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMosques();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await axiosSecure.delete(`/mosques/${deletingId}`);
      toast.success("Mosque deleted successfully");
      setMosques(p => p.filter(m => m.id !== deletingId));
      setDeletingId(null);
    } catch (error) {
      toast.error("Failed to delete mosque");
    } finally {
      setIsDeleting(false);
    }
  };

  const deletingMosque = mosques.find(m => m.id === deletingId);

  const filtered = mosques.filter(m =>
    m.mosqueName?.toLowerCase().includes(search.toLowerCase()) ||
    m.area?.toLowerCase().includes(search.toLowerCase()) ||
    m.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">

      {showDialog && (
        <MosqueDialog
          onClose={() => { setShowDialog(false); setEditingItem(null); }}
          onSave={fetchMosques}
          editingItem={editingItem}
        />
      )}

      {deletingId && deletingMosque && (
        <DeleteDialog
          name={deletingMosque.mosqueName}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">Nearby Mosques</h1>
          <p className="text-slate-500 mt-2 text-sm font-sans">Manage and discover mosques in the community</p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#C4A052] hover:bg-[#A8873A] text-white text-sm font-semibold rounded-2xl shadow-sm transition-all font-sans shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Mosque
        </button>
      </div>

      {/* Search */}
      <div className="relative bg-white border border-[#C8B99A] rounded-2xl shadow-sm flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, area or address..."
          className="pl-11 pr-4 h-12 w-full bg-transparent border-0 text-slate-700 placeholder:text-slate-400 focus:outline-none font-sans text-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="pr-4 text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400 font-sans">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {mosques.length} mosques
        </p>
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-[#C4A052] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-slate-400 font-sans">
          {search ? `No mosques found for "${search}".` : "No mosques yet. Click \"Add Mosque\" to add one."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(mosque => (
            <MosqueCard
              key={mosque.id}
              mosque={mosque}
              onDelete={() => setDeletingId(mosque.id)}
              onEdit={() => { setEditingItem(mosque); setShowDialog(true); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
