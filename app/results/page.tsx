"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "../../lib/profileContext";
import { evaluateSchemes, SchemeMatchResult } from "../../lib/matchingEngine";

export default function ResultsPage() {
  const router = useRouter();
  const { profile, setSelectedSchemeId } = useProfile();
  const [showOtherOptions, setShowOtherOptions] = useState<boolean>(false);

  const allResults = evaluateSchemes(profile);

  // Identify Best Match:
  // Primary potential match (prefer MFS for <= 1.4L business, TL for > 1.4L, ELS for education)
  const potentialMatches = allResults.filter((r) => r.status === "potential_match");
  const conditionalMatches = allResults.filter((r) => r.status === "conditional_match");
  const ineligibleMatches = allResults.filter((r) => r.status === "not_a_match");

  let bestMatch: SchemeMatchResult | undefined = potentialMatches[0];
  let otherMatches: SchemeMatchResult[] = potentialMatches.slice(1);

  if (!bestMatch && conditionalMatches.length > 0) {
    bestMatch = conditionalMatches[0];
    otherMatches = conditionalMatches.slice(1);
  }

  // Action handlers
  const handleProceed = (route: string, schemeId: string) => {
    setSelectedSchemeId(schemeId);
    router.push(route);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Simple Top Navigation */}
        <div className="mb-4 flex items-center justify-between text-xs font-bold text-ink/70">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1 text-forest hover:text-ink font-bold py-1 px-2 -ml-2 rounded-lg"
          >
            ← Change Answers
          </Link>
          <span className="text-forest">Result Overview</span>
        </div>

        {/* User Summary Pill */}
        <div className="mb-6 rounded-2xl bg-sand/60 border border-ink/10 p-3.5 text-xs text-ink/80 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span>Looking for: </span>
            <strong className="text-ink">
              {profile.purpose === "education" ? "Education loan" : "Business loan"} (~₹{profile.requestedAmount.toLocaleString("en-IN")})
            </strong>
            <span className="ml-2 text-forest font-semibold">in {profile.state}</span>
          </div>
          <Link href="/assessment" className="text-forest underline text-[11px] font-bold">
            Edit
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl font-black text-ink sm:text-3xl leading-snug">
            We found the best government scheme for you
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-forest font-semibold">
            आपकी आवश्यकता के अनुसार सबसे उपयुक्त योजना
          </p>
        </div>

        {/* 1. BEST MATCH CARD (Prominently Highlighted) */}
        {bestMatch ? (
          <div className="rounded-3xl border-2 border-forest bg-white p-6 sm:p-8 shadow-soft relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-forest text-white px-3 py-1 text-xs font-black tracking-wide uppercase mb-4">
              <span>★</span>
              <span>Best Match For You</span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-black text-ink leading-snug">
                {bestMatch.scheme.name} ({bestMatch.scheme.id})
              </h2>
              <span className="text-xs sm:text-sm font-bold text-forest">
                {bestMatch.scheme.hindiName}
              </span>
            </div>

            {/* Plain language explanation */}
            <div className="mt-4 rounded-2xl bg-cream/70 p-4 border border-ink/10 text-xs sm:text-sm text-ink/85 leading-relaxed">
              <span className="font-bold text-ink block mb-1">Why this fits your need:</span>
              {getPlainReason(bestMatch, profile)}
            </div>

            {/* Simplified Key Financial Info (Readable Cards) */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl border border-ink/10 p-3 bg-white">
                <span className="block text-[11px] text-ink/50 font-bold uppercase">Loan Available</span>
                <span className="block text-base sm:text-lg font-black text-forest mt-0.5">
                  Up to ₹{bestMatch.calculatedAssistance.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-ink/50">90% of your requirement</span>
              </div>

              <div className="rounded-xl border border-ink/10 p-3 bg-white">
                <span className="block text-[11px] text-ink/50 font-bold uppercase">Interest Rate</span>
                <span className="block text-base sm:text-lg font-black text-ink mt-0.5">
                  {(bestMatch.scheme.interestRate * 100).toFixed(1)}% per year
                </span>
                <span className="text-[10px] text-forest font-semibold">Low government rate</span>
              </div>

              <div className="rounded-xl border border-ink/10 p-3 bg-white">
                <span className="block text-[11px] text-ink/50 font-bold uppercase">Payment Frequency</span>
                <span className="block text-base sm:text-lg font-black text-ink mt-0.5">
                  {bestMatch.scheme.instalmentFrequency}
                </span>
                <span className="text-[10px] text-ink/50">
                  {bestMatch.scheme.id === "MFS" ? "Pay every 3 months" : "Monthly EMI"}
                </span>
              </div>

              <div className="rounded-xl border border-ink/10 p-3 bg-white">
                <span className="block text-[11px] text-ink/50 font-bold uppercase">Grace Period</span>
                <span className="block text-base sm:text-lg font-black text-ink mt-0.5">
                  {bestMatch.scheme.moratoriumMonths} Months
                </span>
                <span className="text-[10px] text-ink/50">Pay nothing for 3 months</span>
              </div>
            </div>

            {/* Two Clear Primary Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleProceed("/calculator", bestMatch!.scheme.id)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink min-h-[52px]"
              >
                <span>Check My Repayment (EMI)</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleProceed("/readiness", bestMatch!.scheme.id)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-forest/30 bg-white px-6 py-3.5 text-sm font-bold text-forest transition hover:bg-forest/5 min-h-[48px]"
              >
                <span>See Documents You Need to Prepare</span>
                <span>→</span>
              </button>
            </div>

            {/* Offline Apply Office in User's State */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => handleProceed("/partners", bestMatch!.scheme.id)}
                className="text-xs font-bold text-ink/70 hover:text-forest underline py-1"
              >
                Where to apply in {profile.state} →
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-rose-200 bg-white p-6 text-center text-ink/70">
            <h2 className="text-lg font-bold text-rose-800">No Direct Match Found</h2>
            <p className="mt-2 text-xs text-ink/70 leading-relaxed">
              Based on the income or community provided, this request is outside NSFDC baseline parameters (family income must be within ₹5,00,000/year).
            </p>
            <Link
              href="/assessment"
              className="mt-4 inline-block rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white"
            >
              Update Answers
            </Link>
          </div>
        )}

        {/* 2. OTHER OPTIONS SECTION (Kept simple and non-overwhelming) */}
        {otherMatches.length > 0 && (
          <div className="mt-10 border-t border-ink/10 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-ink">Other options you may consider</h3>
                <span className="text-xs text-ink/60">Alternative government assistance schemes</span>
              </div>
              <button
                type="button"
                onClick={() => setShowOtherOptions(!showOtherOptions)}
                className="text-xs font-bold text-forest hover:text-ink underline py-1"
              >
                {showOtherOptions ? "Hide" : `Show (${otherMatches.length})`}
              </button>
            </div>

            {showOtherOptions && (
              <div className="mt-4 space-y-4">
                {otherMatches.map((alt) => (
                  <div
                    key={alt.scheme.id}
                    className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-ink">
                          {alt.scheme.name} ({alt.scheme.id})
                        </h4>
                        <span className="text-xs text-forest">{alt.scheme.hindiName}</span>
                      </div>
                      <span className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-bold text-ink/70">
                        {(alt.scheme.interestRate * 100).toFixed(1)}% rate
                      </span>
                    </div>

                    <p className="text-xs text-ink/70 leading-relaxed">
                      {alt.scheme.description}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleProceed("/calculator", alt.scheme.id)}
                        className="rounded-xl border border-forest/30 bg-cream px-3 py-2 text-xs font-bold text-forest hover:bg-sand"
                      >
                        Calculate Repayment
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProceed("/readiness", alt.scheme.id)}
                        className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-ink/70 hover:bg-sand"
                      >
                        Check Documents
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calm Government Disclaimer Note */}
        <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-xs text-ink/80 leading-relaxed text-center sm:text-left">
          <span className="font-bold text-ink">Please note:</span> This recommendation is based on official government guidelines. You will need to submit your documents at the official State Channelizing Agency or on the <strong>PM-SURAJ portal</strong> for final loan sanction.
        </div>
      </div>
    </div>
  );
}

function getPlainReason(match: SchemeMatchResult, profile: any): string {
  const scheme = match.scheme;
  if (scheme.id === "MFS") {
    return `Your stated requirement of ₹${profile.requestedAmount.toLocaleString("en-IN")} fits within the Micro Finance Scheme limit (up to ₹1.4 Lakh). It offers low interest (6.5% p.a.) with quarterly repayments so you don't have monthly repayment pressure.`;
  }
  if (scheme.id === "AMY") {
    return `You need micro-credit for your business activity. This scheme can be accessed quickly through accredited local microfinance partners.`;
  }
  if (scheme.id === "TL") {
    return `Your business plan is around ₹${profile.requestedAmount.toLocaleString("en-IN")}. The Term Loan scheme provides larger capital (up to ₹45 Lakh) with long repayment tenures up to 7 years.`;
  }
  if (scheme.id === "UNY") {
    return `Your requirement fits the Udyam Nidhi Yojana (up to ₹5 Lakh), which can be availed through your local cooperative bank or society.`;
  }
  if (scheme.id === "ELS") {
    return `You are seeking financial assistance for recognized higher technical or professional education. This scheme provides concessional loans up to ₹40 Lakh, and repayment only begins after your course is completed.`;
  }
  return `This scheme matches your stated purpose and income criteria.`;
}
