"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix Leaflet's default marker icons (they break under bundlers).
const pinIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface LatLng {
  lat: number;
  lng: number;
}

// Approximate country centers for the initial map view.
const COUNTRY_CENTERS: Record<string, LatLng> = {
  AE: { lat: 25.2048, lng: 55.2708 }, // Dubai
  SA: { lat: 24.7136, lng: 46.6753 }, // Riyadh
  QA: { lat: 25.2854, lng: 51.531 }, // Doha
  KW: { lat: 29.3759, lng: 47.9774 }, // Kuwait City
  BH: { lat: 26.2285, lng: 50.586 }, // Manama
  OM: { lat: 23.588, lng: 58.3829 }, // Muscat
};

function ClickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    // Animated fly-in so the customer can visually verify the pin location.
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

export function MapPicker({
  country,
  value,
  onChange,
}: {
  country: string;
  value: LatLng | null;
  onChange: (p: LatLng | null) => void;
}) {
  // Render the map only on the client (Leaflet needs window).
  const [ready, setReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const center = useMemo<LatLng>(() => {
    if (value) return value;
    return COUNTRY_CENTERS[country] ?? COUNTRY_CENTERS.AE;
  }, [country, value]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        // Retry without high accuracy — Windows laptops often fail precise
        // GPS/Wi-Fi positioning but succeed with a coarse ISP-level fix.
        if (err.code === 2 || err.code === 3) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
              setLocating(false);
            },
            () => {
              setLocating(false);
              alert(
                "We couldn't detect your location. Please try again in a moment. (" +
                  err.message +
                  ")"
              );
            },
            { enableHighAccuracy: false, timeout: 20_000, maximumAge: 300_000 }
          );
          return;
        }
        alert(
          "We couldn't get your location. Please try again in a moment. (" +
            err.message +
            ")"
        );
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 }
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-navy/60">
          Delivery pin <span className="text-destructive">*</span>
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={useMyLocation}
            className="rounded-full text-xs"
          >
            <Crosshair className="me-1.5 size-3.5" />
            {locating ? "Locating…" : "Use my location"}
          </Button>
        </div>
      </div>

      <div className="relative h-64 overflow-hidden rounded-xl border border-border">
        {ready ? (
          <MapContainer
            center={center}
            zoom={value ? 16 : 11}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            ref={(m) => {
              mapRef.current = m ?? null;
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onPick={onChange} />
            {/* Street-level zoom once a pin exists; country view otherwise. */}
            <Recenter center={center} zoom={value ? 16 : 11} />
            {value && <Marker position={value} icon={pinIcon} draggable eventHandlers={{ dragend: (e) => {
              const p = e.target as L.Marker;
              const ll = p.getLatLng();
              onChange({ lat: ll.lat, lng: ll.lng });
            } }} />}
          </MapContainer>
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary/40 text-sm text-navy/50">
            Loading map…
          </div>
        )}
        {!value && ready && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center">
            <span className="rounded-full bg-navy/80 px-3 py-1 text-[10px] text-cream">
              Tap the map to drop your delivery pin
            </span>
          </div>
        )}
      </div>

    </div>
  );
}

/** Google Maps link for a pin (used by admins/couriers). */
export function googleMapsLink(p: LatLng): string {
  return `https://www.google.com/maps?q=${p.lat},${p.lng}`;
}
