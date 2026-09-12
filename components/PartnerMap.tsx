"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  STATE_COORDINATES,
  INDIA_CENTER,
  INDIA_DEFAULT_ZOOM,
  findNearestState,
  haversineDistanceKm,
} from "../lib/data/stateCoordinates";
import { PARTNERS, PartnerRecord } from "../lib/data/partners";
import { useProfile } from "../lib/profileContext";
import { t } from "../lib/i18n";

// MapLibre GL JS types — imported dynamically
type MapLibreMap = any;
type MapLibreMarker = any;
type MapLibrePopup = any;

// Category → pin color mapping
const CATEGORY_COLORS: Record<string, string> = {
  SCA: "#166534",          // forest green — primary channel
  PSB: "#1e40af",          // blue
  RRB: "#92400e",          // amber-brown
  "NBFC-MFI": "#7c3aed",  // violet
  "Co-operative Bank": "#0e7490", // teal
  "Small Finance Bank": "#be185d", // rose
  "Cooperative Society": "#ea580c", // orange
  "Other / SIDBI": "#6b7280",     // gray
};

interface PartnerMapProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
  onLocateUser: (lat: number, lng: number) => void;
}

/**
 * Interactive Mapbox GL JS map showing NSFDC channel partners
 * pinned at state capital locations.
 *
 * Gracefully degrades to a message if NEXT_PUBLIC_MAPBOX_TOKEN is not set.
 */
export default function PartnerMap({
  selectedState,
  onStateSelect,
  onLocateUser,
}: PartnerMapProps) {
  const { profile } = useProfile();
  const locale = profile.locale || "en";
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const userMarkerRef = useRef<MapLibreMarker | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const maplibreglRef = useRef<any>(null);

  // Group partners by state for pin aggregation
  const partnersByState = React.useMemo(() => {
    const grouped: Record<string, PartnerRecord[]> = {};
    for (const p of PARTNERS) {
      // Skip "National / Multi-state" for pin placement
      if (p.state === "National / Multi-state") continue;
      if (!grouped[p.state]) grouped[p.state] = [];
      grouped[p.state].push(p);
    }
    return grouped;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // already initialized

    let cancelled = false;

    (async () => {
      try {
        const maplibreglModule = await import("maplibre-gl");
        // @ts-ignore
        const maplibregl = maplibreglModule.default || maplibreglModule;
        // @ts-ignore
        await import("maplibre-gl/dist/maplibre-gl.css");

        if (cancelled) return;
        maplibreglRef.current = maplibregl;

        const map = new maplibregl.Map({
          container: mapContainerRef.current!,
          style: "https://tiles.openfreemap.org/styles/liberty",
          center: [INDIA_CENTER.lng, INDIA_CENTER.lat],
          zoom: INDIA_DEFAULT_ZOOM,
          minZoom: 3,
          maxZoom: 12,
          attributionControl: false,
        });

        map.addControl(
          new maplibregl.AttributionControl({ compact: true }),
          "bottom-left"
        );
        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "bottom-right"
        );

        map.on("load", () => {
          if (cancelled) return;
          mapRef.current = map;
          setMapLoaded(true);
          addPartnerPins(map, maplibregl);
        });

        map.on("error", (e: any) => {
          console.error("MapLibre error:", e);
        });
      } catch (err) {
        console.error("Failed to load MapLibre GL JS:", err);
        setMapError("load-failed");
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add partner pins to map
  const addPartnerPins = useCallback(
    (map: MapLibreMap, maplibregl: any) => {
      // Clear existing markers
      for (const m of markersRef.current) m.remove();
      markersRef.current = [];

      for (const [state, partners] of Object.entries(partnersByState)) {
        const coord = STATE_COORDINATES[state];
        if (!coord) continue;

        // Count by category
        const categoryCounts: Record<string, number> = {};
        for (const p of partners) {
          categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        }

        // Determine primary category (most partners)
        const primaryCategory = Object.entries(categoryCounts).sort(
          (a, b) => b[1] - a[1]
        )[0][0];
        const pinColor = CATEGORY_COLORS[primaryCategory] || "#166534";

        // Create custom marker element
        const el = document.createElement("div");
        el.className = "partner-map-pin";
        el.style.cssText = `
          width: 32px; height: 32px; border-radius: 50%;
          background: ${pinColor}; border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; font-size: 11px; font-weight: 900;
          color: white; transition: transform 0.15s ease;
        `;
        el.textContent = String(partners.length);
        el.title = `${state}: ${partners.length} partner(s)`;

        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.25)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });

        // Build popup HTML
        const categoryLines = Object.entries(categoryCounts)
          .map(([cat, count]) => {
            const dotColor = CATEGORY_COLORS[cat] || "#6b7280";
            return `<div style="display:flex;align-items:center;gap:4px;font-size:11px;margin-top:2px;">
              <span style="width:8px;height:8px;border-radius:50%;background:${dotColor};flex-shrink:0;"></span>
              <span>${count} ${cat}</span>
            </div>`;
          })
          .join("");

        const popupHtml = `
          <div style="font-family:system-ui,sans-serif;min-width:140px;">
            <div style="font-size:13px;font-weight:800;margin-bottom:4px;">${state}</div>
            <div style="font-size:11px;color:#666;margin-bottom:6px;">${coord.capital} area</div>
            ${categoryLines}
            <div style="margin-top:8px;font-size:11px;font-weight:700;color:#166534;cursor:pointer;" class="popup-select-state" data-state="${state}">
              View partners →
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: 20,
          closeButton: false,
          maxWidth: "200px",
        }).setHTML(popupHtml);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([coord.lng, coord.lat])
          .setPopup(popup)
          .addTo(map);

        // Handle popup click to select state
        popup.on("open", () => {
          setTimeout(() => {
            const btn = document.querySelector(
              `.popup-select-state[data-state="${state}"]`
            );
            if (btn) {
              btn.addEventListener("click", () => {
                onStateSelect(state);
                popup.remove();
              });
            }
          }, 50);
        });

        // Click marker → select state
        el.addEventListener("click", () => {
          onStateSelect(state);
          map.flyTo({
            center: [coord.lng, coord.lat],
            zoom: 7,
            duration: 800,
          });
        });

        markersRef.current.push(marker);
      }
    },
    [partnersByState, onStateSelect]
  );

  // Fly to selected state when it changes
  const preventStateFlyTo = useRef(false);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (preventStateFlyTo.current) {
      preventStateFlyTo.current = false;
      return;
    }

    if (
      selectedState === "All States & UTs" ||
      selectedState === "National / Multi-state"
    ) {
      mapRef.current.flyTo({
        center: [INDIA_CENTER.lng, INDIA_CENTER.lat],
        zoom: INDIA_DEFAULT_ZOOM,
        duration: 800,
      });
      return;
    }

    const coord = STATE_COORDINATES[selectedState];
    if (coord) {
      mapRef.current.flyTo({
        center: [coord.lng, coord.lat],
        zoom: 7,
        duration: 800,
      });
    }
  }, [selectedState, mapLoaded]);

  // Handle "Use My Location"
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocating(false);

        // Find nearest state
        const nearest = findNearestState(latitude, longitude);
        if (nearest) {
          preventStateFlyTo.current = true;
          onStateSelect(nearest.state);
          onLocateUser(latitude, longitude);
        }

        // Add user marker on map
        if (mapRef.current && mapLoaded && maplibreglRef.current) {
          const maplibregl = maplibreglRef.current;
          
          // Remove old user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          const el = document.createElement("div");
          el.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" fill="#3b82f6" stroke="white" stroke-width="3" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"/>
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
          `;
          el.style.width = "24px";
          el.style.height = "24px";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";

          userMarkerRef.current = new maplibregl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);

          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 10,
            duration: 1000,
          });
        }
      },
      (err) => {
        setLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError(t("map.denied", locale));
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError(t("map.unavailable", locale));
            break;
          default:
            setLocationError(t("map.error", locale));
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [mapLoaded, onLocateUser, onStateSelect, locale]);

  // ─── No-token fallback ───
  if (mapError === "no-token") {
    return (
      <div className="rounded-3xl border-2 border-dashed border-forest/30 bg-forest/5 p-6 text-center">
        <svg className="h-6 w-6 mb-2 block mx-auto text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h2 className="text-base font-black text-ink mb-1">
          {t("map.interactive", locale)}
        </h2>
        <p className="text-xs text-ink/60 max-w-md mx-auto leading-relaxed mb-3">
          {t("map.no_token", locale)}
        </p>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white transition hover:bg-ink min-h-[44px] disabled:opacity-50"
        >
          {locating ? (
            <>
              <span className="animate-spin">◌</span>
              <span>{t("map.locating", locale)}</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{t("map.use_location", locale)}</span>
            </>
          )}
        </button>
        {locationError && (
          <p className="mt-2 text-xs text-rose-600 font-semibold">
            {locationError}
          </p>
        )}
      </div>
    );
  }

  // ─── Map container ───
  return (
    <div className="rounded-3xl border border-ink/10 bg-white overflow-hidden shadow-soft">
      {/* Location controls above map */}
      <div className="flex items-center gap-2 px-4 py-3 bg-cream/60 border-b border-ink/10">
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-3.5 py-2 text-xs font-bold text-white transition hover:bg-ink min-h-[40px] disabled:opacity-50 shrink-0"
        >
          {locating ? (
            <>
              <span className="animate-spin text-sm">◌</span>
              <span>{t("map.locating", locale)}</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4 shrink-0 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{t("map.use_location", locale)}</span>
            </>
          )}
        </button>

        <span className="text-[11px] text-ink/40 font-bold">{t("map.or", locale)}</span>

        <span className="text-[11px] text-ink/60">
          {t("map.select_state", locale)}
        </span>
      </div>

      {locationError && (
        <div className="px-4 py-2 bg-rose-50 border-b border-rose-200 text-xs text-rose-700 font-semibold">
          {locationError}
        </div>
      )}

      {/* Map */}
      <div
        ref={mapContainerRef}
        className="w-full"
        style={{ height: "300px" }}
      />

      {/* Data integrity notice (BUG 6 fix) */}
      <div className="px-4 py-2 bg-amber-50/60 border-t border-amber-200/50 flex items-start gap-2">
        <span className="text-amber-600 text-xs mt-0.5 shrink-0">ⓘ</span>
        <span className="text-[10px] text-amber-800 leading-relaxed">
          {t("map.notice", locale)}
        </span>
      </div>
    </div>
  );
}
