"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useProfile } from "../../lib/profileContext";
import {
  PARTNERS,
  INDIAN_STATES_AND_UTS,
  DIRECTORY_RECONCILIATION,
  PartnerRecord,
} from "../../lib/data/partners";

export default function PartnersPage() {
  const { profile } = useProfile();

  // Filters state (defaults to user's state)
  const [selectedState, setSelectedState] = useState<string>(profile.state || "All States & UTs");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Filtered partners (mobile-first, straightforward)
  const filteredPartners = useMemo(() => {
    return PARTNERS.filter((partner) => {
      // State filter
      if (
        selectedState !== "All States & UTs" &&
        partner.state !== selectedState &&
        partner.state !== "National / Multi-state" &&
        partner.category !== "PSB"
      ) {
        return false;
      }

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
            className="inline-flex items-center gap-1 text-forest hover:text-ink font-bold py-1 px-2 -ml-2 rounded-lg"
          >
            ← Back to Documents
          </Link>
          <span className="text-forest">Where to Apply</span>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-ink sm:text-3xl leading-snug">
            Where to apply for your loan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-forest font-semibold">
            आधिकारिक सरकारी कार्यालय एवं बैंक संपर्क
          </p>
          <p className="mt-2 text-xs text-ink/70 leading-relaxed">
            NSFDC does not take loan forms directly at its head office. You can apply online through the official <strong>PM-SURAJ</strong> portal or visit your state government loan agency.
          </p>
        </div>

        {/* PRIMARY ACTION: Online Portal Card (Huge tap-friendly button) */}
        <div className="mb-6 rounded-3xl border-2 border-forest bg-white p-5 sm:p-6 shadow-soft">
          <span className="inline-block rounded-full bg-forest text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider mb-2">
            Recommended Digital Option
          </span>
          <h2 className="text-lg sm:text-xl font-black text-ink leading-snug">
            Apply online on the official PM-SURAJ portal
          </h2>
          <p className="mt-1 text-xs text-ink/70 leading-relaxed">
            Central Government portal for Scheduled Caste entrepreneurs. Your digital application is automatically forwarded to your state agency.
          </p>

          <a
            href="https://pmsuraj.dosje.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink min-h-[52px]"
          >
            <span>Open PM-SURAJ Portal</span>
            <span aria-hidden>↗</span>
          </a>
        </div>

        {/* SECONDARY OPTION: Physical State Offices */}
        <div className="mb-6 rounded-3xl border border-ink/10 bg-white p-5 sm:p-6 shadow-soft">
          <h2 className="text-base font-black text-ink">
            Or apply in person: Partner offices in your state
          </h2>
          <p className="mt-1 text-xs text-ink/65 mb-4">
            Select your state to see local government development corporations and rural banks.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-ink/70 mb-1">
                Select your State:
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full rounded-xl border border-ink/20 bg-cream/40 p-3 text-sm font-bold text-ink focus:border-forest focus:bg-white focus:outline-none min-h-[48px]"
              >
                {INDIAN_STATES_AND_UTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bank or agency name..."
                className="w-full rounded-xl border border-ink/20 bg-cream/40 p-3 text-xs font-semibold text-ink focus:border-forest focus:bg-white focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Quick stats and toggle */}
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-ink/60">
            <span>
              Found <strong className="text-forest">{filteredPartners.length}</strong> official offices
            </span>

            {/* Subtle Demo Mode Switch */}
            <div className="flex items-center gap-2">
              <span className="text-[11px]">Demo Mode:</span>
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
        </div>

        {/* Demo Mode Notice Banner */}
        {demoMode && (
          <div className="mb-6 rounded-2xl border-2 border-amber-500 bg-amber-50 p-4 text-xs text-amber-900">
            <span className="font-black uppercase block mb-0.5">
              ⚠️ SIMULATED - DEMO ONLY DATA:
            </span>
            <span className="leading-relaxed">
              Queue times and branch capacity displayed below are synthetic for hackathon testing. Official registers do not publish live branch queue numbers.
            </span>
          </div>
        )}

        {/* Partner Cards (Stacked Cleanly for Mobile) */}
        <div className="space-y-3">
          {filteredPartners.map((partner) => (
            <PartnerCardMobile key={partner.id} partner={partner} demoMode={demoMode} />
          ))}

          {filteredPartners.length === 0 && (
            <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-xs text-ink/60">
              No offices found for this search. Try choosing &quot;All States &amp; UTs&quot;.
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
}: {
  partner: PartnerRecord;
  demoMode: boolean;
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

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-5 shadow-sm transition">
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
          <strong className="text-ink">Area / State:</strong> {partner.state}
        </div>
        <div className="text-[11px] text-ink/60">{partner.locationScope}</div>
      </div>

      {demoMode && partner.simulatedData && (
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-900">
          <div className="flex justify-between">
            <span>[Simulated Turnaround]:</span>
            <span className="font-bold">{partner.simulatedData.estTurnaroundDays} days</span>
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-ink/5 flex items-center justify-between text-[10px] text-ink/50">
        <a
          href={partner.sourceRegisterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest underline font-semibold"
        >
          Official PDF Register ↗
        </a>
        <span>Verified 2026</span>
      </div>
    </div>
  );
}
