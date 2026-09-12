"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useProfile } from "../../lib/profileContext";
import { t } from "../../lib/i18n";
import {
  PARTNERS,
  INDIAN_STATES_AND_UTS,
  DIRECTORY_RECONCILIATION,
  PartnerRecord,
} from "../../lib/data/partners";
import { SCHEMES } from "../../lib/data/schemes";
import { STATE_COORDINATES } from "../../lib/data/stateCoordinates";
import dynamic from "next/dynamic";

// Dynamically import the map to avoid SSR issues with MapLibre
const PartnerMap = dynamic(() => import("../../components/PartnerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full animate-pulse rounded-3xl bg-forest/5 flex items-center justify-center border border-forest/10">
      <span className="text-forest/40 font-bold text-sm">Loading map...</span>
    </div>
  ),
});
export default function PartnersPage() {
  const { profile, selectedSchemeId } = useProfile();
  const locale = profile.locale || "en";

  // Filters state (defaults to user's state if available)
  const [selectedState, setSelectedState] = useState<string>(profile.state || "All States & UTs");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [demoMode, setDemoMode] = useState<boolean>(false);

  const currentScheme = SCHEMES.find((s) => s.id === selectedSchemeId);

  // Filtered partners (mobile-first, straightforward)
  const filteredPartners = useMemo(() => {
    return PARTNERS.filter((partner) => {
      // BUG 1 & 2 Fix: Strict state matching.
      // If a specific state is selected, ONLY partners with that EXACT state are shown.
      // No bypass for PSBs or National records to ensure zero cross-state cards.
      if (selectedState && selectedState !== "All States & UTs" && selectedState !== "National / Multi-state") {
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (normalize(partner.state) !== normalize(selectedState)) {
          return false;
        }
      }

      // Search filter runs AFTER state filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = partner.name.toLowerCase().includes(q);
        const matchesState = partner.state.toLowerCase().includes(q);
        if (!matchesName && !matchesState) return false;
      }

      return true;
    });
  }, [selectedState, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Simple Top Navigation */}
        <div className="mb-4 flex items-center justify-between text-xs font-bold text-ink/70">
          <Link
            href="/readiness"
            className="inline-flex items-center gap-1 text-forest hover:text-ink font-bold py-1 px-2 -ml-2 rounded-lg min-h-[44px]"
          >
            ← Back to Documents
          </Link>
          <span className="text-forest">{t("nav.partners", locale)}</span>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-ink sm:text-3xl leading-snug">
            {t("partners.title", locale)}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-forest font-semibold">
            {t("partners.subtitle", locale)}
          </p>
          <p className="mt-2 text-xs text-ink/70 leading-relaxed">
            {t("partners.intro", locale).split('PM-SURAJ').map((part, i, arr) => 
              <React.Fragment key={i}>
                {part}{i !== arr.length - 1 && <strong>PM-SURAJ</strong>}
              </React.Fragment>
            )}
          </p>
        </div>

        {/* GEO-SPATIAL MAP */}
        <div className="mb-6">
          <PartnerMap
            selectedState={selectedState}
            onStateSelect={setSelectedState}
            onLocateUser={(lat, lng) => {
              // Map handles location pinning internally
            }}
          />
          <div className="mt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("partners.search_placeholder", locale)}
              className="w-full rounded-xl border border-ink/20 bg-white p-3 text-xs font-semibold text-ink shadow-sm focus:border-forest focus:outline-none min-h-[44px]"
              aria-label="Search partner name"
            />
          </div>
        </div>

        {/* PRIMARY ACTION: Online Portal Card (Huge tap-friendly button) */}
        <div className="mb-6 rounded-3xl border-2 border-forest bg-white p-5 sm:p-6 shadow-soft">
          <span className="inline-block rounded-full bg-forest text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider mb-2">
            {t("partners.digital_option", locale)}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-ink leading-snug">
            {t("partners.apply_online", locale)}
          </h2>
          <p className="mt-1 text-xs text-ink/70 leading-relaxed">
            {t("partners.apply_desc", locale)}
          </p>

          <a
            href="https://pmsuraj.dosje.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink min-h-[52px]"
          >
            <span>{t("partners.open_portal", locale)}</span>
            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>

        {/* Quick stats */}
        <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3 text-xs text-ink/60">
          <span>
            {t("partners.found_offices", locale, { count: filteredPartners.length })}
            {selectedState !== "All States & UTs" && <> {t("partners.in_state", locale, { state: selectedState })}</>}
          </span>

          {/* Demo Mode Switch */}
          <div className="flex items-center gap-2">
            <span className="text-[11px]">{t("partners.demo_mode", locale)}</span>
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                demoMode ? "bg-amber-600" : "bg-ink/20"
              }`}
              aria-pressed={demoMode}
              aria-label="Toggle demo mode"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  demoMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        {demoMode && (
          <div className="mb-6 rounded-2xl border-2 border-amber-500 bg-amber-50 p-4 text-xs text-amber-900">
            <span className="font-black uppercase block mb-0.5">
              <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> SIMULATED - DEMO ONLY DATA:
            </span>
            <span className="leading-relaxed">
              Queue times and branch capacity displayed below are synthetic for hackathon testing. Official registers do not publish live branch queue numbers.
            </span>
          </div>
        )}



        {/* Partner Cards (Stacked Cleanly for Mobile) */}
        <div className="space-y-3">
          {filteredPartners.map((partner) => (
            <PartnerCardMobile
              key={partner.id}
              partner={partner}
              demoMode={demoMode}
              currentSchemeId={selectedSchemeId}
              locale={locale}
            />
          ))}

          {filteredPartners.length === 0 && (
            <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-xs text-ink/60">
              {t("partners.no_offices", locale)}
            </div>
          )}
        </div>

        {/* Directory Audit Note */}
        <div className="mt-8 rounded-2xl bg-cream/70 border border-ink/10 p-4 text-center text-[11px] text-ink/60 leading-relaxed">
          {DIRECTORY_RECONCILIATION.note}
        </div>
      </div>
    </div>
  );
}

function PartnerCardMobile({
  partner,
  demoMode,
  currentSchemeId,
  locale,
}: {
  partner: PartnerRecord;
  demoMode: boolean;
  currentSchemeId: string;
  locale: "en" | "hi" | "te";
}) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "SCA":
        return "State Government Loan Agency (SCA)";
      case "RRB":
        return "Regional Rural Bank (RRB)";
      case "PSB":
        return "Public Sector Bank";
      case "NBFC-MFI":
        return "Microfinance Institution";
      case "Co-operative Bank":
        return "Cooperative Bank";
      default:
        return partner.category;
    }
  };

  const getSchemeCompatibility = (): string[] => {
    const compat: string[] = [];
    if (partner.category === "SCA" || partner.category === "PSB") {
      compat.push("MFS", "TL", "ELS");
    }
    if (partner.category === "NBFC-MFI") {
      compat.push("AMY");
    }
    if (partner.category === "RRB") {
      compat.push("MFS", "TL");
    }
    if (partner.category === "Co-operative Bank" || partner.category === "Small Finance Bank" || partner.category === "Cooperative Society") {
      compat.push("UNY");
    }
    return compat;
  };

  const schemeCompat = getSchemeCompatibility();
  const isCompatibleWithSelected = schemeCompat.includes(currentSchemeId);

  // BUG 3 Fix: Construct contextual directions query
  // Extract city from locationScope (e.g., "National Network (Head Office: Chennai)")
  let city = "";
  const hqMatch = partner.locationScope.match(/Head Office:\s*([^)]+)/i);
  if (hqMatch && hqMatch[1]) {
    city = hqMatch[1].trim();
  }
  
  const destinationQuery = encodeURIComponent(
    `${partner.name}, ${city ? city + ", " : ""}${partner.state}, India`
  );

  return (
    <div className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition print-card ${
      isCompatibleWithSelected ? "border-forest/30" : "border-ink/10"
    }`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-extrabold text-forest">
          {getCategoryLabel(partner.category)}
        </span>
        <span className="text-[10px] text-ink/40 font-mono">{partner.id}</span>
      </div>

      <h3 className="text-sm font-black text-ink leading-snug mt-1">
        {partner.name}
      </h3>

      <div className="mt-2 text-xs text-ink/70 space-y-0.5">
        <div>
          <strong className="text-ink">{t("partners.area_state", locale)}</strong> {partner.state}
        </div>
        <div className="text-[11px] text-ink/60">{partner.locationScope}</div>
      </div>

      {/* Scheme Compatibility Badge */}
      <div className="mt-2 flex flex-wrap gap-1">
        {schemeCompat.map((sid) => (
          <span
            key={sid}
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
              sid === currentSchemeId
                ? "bg-forest text-white"
                : "bg-sand/60 text-ink/50"
            }`}
          >
            {sid}
          </span>
        ))}
      </div>

      {demoMode && partner.simulatedData && (
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-900">
          <div className="flex justify-between">
            <span>[Simulated Turnaround]:</span>
            <span className="font-bold">{partner.simulatedData.estTurnaroundDays} days</span>
          </div>
        </div>
      )}

      {STATE_COORDINATES[partner.state] && (
        <div className="mt-3">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-forest/10 px-3 py-2 text-[11px] font-bold text-forest hover:bg-forest/20 transition"
          >
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> {t("partners.get_directions", locale, { city: city || STATE_COORDINATES[partner.state].capital })}
          </a>
          <p className="mt-1.5 text-[9px] text-ink/40 leading-tight">
            {t("partners.approx_area", locale)}
          </p>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-ink/5 flex items-center justify-between text-[10px] text-ink/50">
        <a
          href={partner.sourceRegisterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest underline font-semibold"
        >
          {t("partners.official_register", locale)}
        </a>
        <span>Verified 2026</span>
      </div>
    </div>
  );
}
