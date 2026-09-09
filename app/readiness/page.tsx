"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "../../lib/profileContext";
import { DOCUMENTS_DATA, DocumentItem } from "../../lib/data/documents";
import { SCHEMES } from "../../lib/data/schemes";

export default function ReadinessPage() {
  const router = useRouter();
  const { profile, selectedSchemeId, setSelectedSchemeId, documentStatuses, setDocumentStatus } =
    useProfile();

  const currentScheme = SCHEMES.find((s) => s.id === selectedSchemeId) || SCHEMES[0];

  // Filter documents: Baseline (COMMON) + Selected Scheme
  const relevantDocs = DOCUMENTS_DATA.filter(
    (doc) => doc.schemeId === "COMMON" || doc.schemeId === currentScheme.id
  );

  const baselineDocs = relevantDocs.filter((d) => d.mandatory);
  const additionalDocs = relevantDocs.filter((d) => !d.mandatory);

  const readyCount = relevantDocs.filter((d) => documentStatuses[d.id] === "ready").length;
  const totalCount = relevantDocs.length;
  const scorePct = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Simple Top Navigation */}
        <div className="mb-4 flex items-center justify-between text-xs font-bold text-ink/70 no-print">
          <Link
            href="/results"
            className="inline-flex items-center gap-1 text-forest hover:text-ink font-bold py-1 px-2 -ml-2 rounded-lg"
          >
            ← Back to Results
          </Link>
          <span className="text-forest">Documents</span>
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-ink sm:text-3xl leading-snug">
              What papers do you need?
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-forest font-semibold">
              आवेदन के लिए आवश्यक दस्तावेज़
            </p>
            <p className="mt-2 text-xs text-ink/70 leading-relaxed">
              Check which papers you already have ready before you visit the government office.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink/20 bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-sm hover:bg-sand min-h-[44px] no-print shrink-0"
          >
            <span>🖨️ Print / Save List</span>
          </button>
        </div>

        {/* Simple Scheme Switcher (Tap chips) */}
        <div className="mb-6 no-print">
          <span className="block text-xs font-bold text-ink/60 mb-2">
            Showing papers for:
          </span>
          <div className="flex flex-wrap gap-2">
            {SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                type="button"
                onClick={() => setSelectedSchemeId(scheme.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition min-h-[40px] ${
                  selectedSchemeId === scheme.id
                    ? "bg-forest text-white shadow-sm"
                    : "bg-white border border-ink/15 text-ink/75 hover:bg-sand"
                }`}
              >
                {scheme.id} · {scheme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Readiness Progress Card */}
        <div className="mb-6 rounded-3xl border border-forest/30 bg-white p-5 sm:p-6 shadow-soft print-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-forest uppercase tracking-wider block">
                Your Readiness Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-ink">{scorePct}%</span>
                <span className="text-xs font-bold text-ink/70">Ready</span>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-xs font-extrabold text-forest">
                {readyCount} of {totalCount} Papers Ready
              </span>
              <span className="text-[11px] text-ink/50 block mt-0.5">
                {scorePct >= 80 ? "✓ You can apply now" : "Keep preparing missing papers"}
              </span>
            </div>
          </div>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-sand">
            <div
              style={{ width: `${scorePct}%` }}
              className={`h-full transition-all duration-300 ${
                scorePct >= 80 ? "bg-forest" : "bg-gold"
              }`}
            />
          </div>
        </div>

        {/* DigiLocker tip in plain language */}
        <div className="mb-6 rounded-2xl border border-gold/30 bg-gold/15 p-4 text-xs text-ink flex items-start gap-3 no-print">
          <span className="text-xl">💡</span>
          <div>
            <span className="font-extrabold text-ink">Free Government Service:</span>
            <p className="mt-0.5 text-ink/80 leading-relaxed">
              You do not need to pay middlemen or touts to get your caste or income certificate. In most states, you can get verified copies online via <strong>DigiLocker</strong> or at your nearest official <strong>CSC (Common Service Center)</strong>.
            </p>
          </div>
        </div>

        {/* 1. Essential Papers Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-base font-black text-ink">
            1. Essential papers everyone needs (मुख्य दस्तावेज़)
          </h2>

          {baselineDocs.map((doc) => (
            <DocCard
              key={doc.id}
              item={doc}
              status={documentStatuses[doc.id] || "missing"}
              onSetStatus={(status) => setDocumentStatus(doc.id, status)}
            />
          ))}
        </div>

        {/* 2. Business or Course Papers Section */}
        {additionalDocs.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-base font-black text-ink">
              2. Business / Activity details (कार्य विवरण)
            </h2>

            {additionalDocs.map((doc) => (
              <DocCard
                key={doc.id}
                item={doc}
                status={documentStatuses[doc.id] || "missing"}
                onSetStatus={(status) => setDocumentStatus(doc.id, status)}
              />
            ))}
          </div>
        )}

        {/* Next Step Router Button */}
        <div className="mt-8 flex flex-col gap-3 no-print">
          <button
            type="button"
            onClick={() => router.push("/partners")}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink min-h-[52px]"
          >
            <span>Next: Where to Apply in {profile.state}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DocCard({
  item,
  status,
  onSetStatus,
}: {
  item: DocumentItem;
  status: "ready" | "in_progress" | "missing";
  onSetStatus: (status: "ready" | "in_progress" | "missing") => void;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition print-card ${
        status === "ready"
          ? "border-forest bg-forest/5"
          : status === "in_progress"
          ? "border-gold/60"
          : "border-ink/10"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-black text-ink leading-snug">
              {item.title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                status === "ready"
                  ? "bg-forest text-white"
                  : status === "in_progress"
                  ? "bg-gold text-ink"
                  : "bg-sand text-ink/60"
              }`}
            >
              {status === "ready" ? "✓ Ready" : status === "in_progress" ? "⏳ Applied" : "Pending"}
            </span>
          </div>
          <span className="text-xs font-semibold text-forest mt-0.5 block">
            {item.hindiTitle}
          </span>
          <p className="mt-1 text-xs text-ink/70 leading-relaxed">{item.purpose}</p>

          <div className="mt-2 text-[11px] text-ink/60 bg-cream/60 p-2 rounded-lg border border-ink/5">
            <strong className="text-ink">Where to get it:</strong> {item.howToObtain}
          </div>
        </div>

        {/* Big Tap Buttons for Mobile (Min 44px) */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-ink/10 no-print">
          <button
            type="button"
            onClick={() => onSetStatus("ready")}
            className={`flex items-center justify-center rounded-xl py-2 px-1 text-xs font-bold transition min-h-[44px] ${
              status === "ready"
                ? "bg-forest text-white shadow-sm"
                : "bg-cream text-ink/75 hover:bg-forest/10 border border-ink/10"
            }`}
          >
            <span>✓ I have it</span>
          </button>

          <button
            type="button"
            onClick={() => onSetStatus("in_progress")}
            className={`flex items-center justify-center rounded-xl py-2 px-1 text-xs font-bold transition min-h-[44px] ${
              status === "in_progress"
                ? "bg-gold text-ink shadow-sm font-black"
                : "bg-cream text-ink/75 hover:bg-gold/10 border border-ink/10"
            }`}
          >
            <span>⏳ Applied</span>
          </button>

          <button
            type="button"
            onClick={() => onSetStatus("missing")}
            className={`flex items-center justify-center rounded-xl py-2 px-1 text-xs font-bold transition min-h-[44px] ${
              status === "missing"
                ? "bg-ink text-white shadow-sm"
                : "bg-cream text-ink/75 hover:bg-sand border border-ink/10"
            }`}
          >
            <span>✕ Need it</span>
          </button>
        </div>
      </div>
    </div>
  );
}
