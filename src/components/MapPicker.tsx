"use client";
import { useEffect, useRef, useState } from "react";

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({
  initialLat = 23.8103,
  initialLng = 90.4125,
  onSelect,
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Inject Leaflet CSS once
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!mapContainerRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      // Fix default marker icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current).setView(
        [initialLat, initialLng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on("click", (e: any) => {
        const lat: number = e.latlng.lat;
        const lng: number = e.latlng.lng;

        // Remove previous marker
        if (markerRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (markerRef.current as any).remove();
        }

        const marker = L.marker([lat, lng]).addTo(map);
        markerRef.current = marker;

        const rounded = {
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
        };
        setCoords(rounded);
        onSelect(rounded.lat, rounded.lng);
      });

      mapInstanceRef.current = map;
      setLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full">
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="w-full rounded-2xl overflow-hidden border border-[#C8B99A]"
        style={{ height: 340 }}
      />

      {!loaded && (
        <div className="absolute inset-0 rounded-2xl bg-[#FAF7F2] flex items-center justify-center">
          <p className="text-sm text-slate-400 font-sans animate-pulse">Loading map…</p>
        </div>
      )}

      {/* Coordinate display */}
      {coords ? (
        <div className="mt-3 flex items-center gap-3 text-xs font-sans flex-wrap">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-semibold border border-emerald-200">
            📍 Latitude: {coords.lat}
          </span>
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-semibold border border-emerald-200">
            Longitude: {coords.lng}
          </span>
          <span className="text-slate-400">Click map to move pin</span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400 font-sans">
          👆 Click anywhere on the map to drop a pin and capture coordinates
        </p>
      )}
    </div>
  );
}
