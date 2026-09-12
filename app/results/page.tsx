"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "../../lib/profileContext";
import {
  evaluateSchemes,
  rankMatches,
  isAssessmentComplete,
  SchemeMatchResult,
} from "../../lib/matchingEngine";

export default function ResultsPage() {
  const router = useRouter();
  const { profile, setSelectedSchemeId } = useProfile();
  const [showOtherOptions, setShowOtherOptions] = useState<boolean>(false);

  // A1: Guard incomplete assessment — don't show fake ₹0 results
  const assessmentComplete = isAssessmentComplete(profile);

  if (!assessmentComplete) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-cream px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border-2 border-amber-400 bg-white p-6 sm:p-8 shadow-soft text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <svg className="h-8 w-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h1 className="text-2xl font-black text-ink sm:text-3xl leading-snug">
              Complete Your Assessment First
            </h1>
            <p className="mt-2 text-sm text-ink/70 leading-relaxed max-w-md mx-auto">
              We need a few details — your community, purpose, income, and loan amount — before we can find the right government scheme for you.
            </p>
            <p className="mt-1 text-xs text-forest font-semibold">
              पहले अपना आकलन पूरा करें, फिर हम आपके लिए सही योजना खोजेंगे।
            </p>

            {/* Show which fields are missing */}
            <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-3 text-left text-xs text-amber-900">
              <span className="font-bold block mb-1.5">Missing information:</span>
              <ul className="space-y-1 list-disc list-inside">
                {profile.community === undefined && <li>Community / caste category</li>}
                {profile.purpose === undefined && <li>Purpose (business or education)</li>}
                {profile.annualFamilyIncome <= 0 && <li>Annual family income</li>}
                {profile.requestedAmount <= 0 && <li>Requested loan amount</li>}
              </ul>
            </div>

            <Link
              href="/assessment"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-8 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink min-h-[52px]"
            >
              <span>Start Assessment</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allResults = evaluateSchemes(profile);

  // A4: Use deterministic ranking instead of naive potentialMatches[0]
  const { bestMatch, otherMatches } = rankMatches(allResults, profile.requestedAmount);

  // Collect ineligible results for no-match explanation
  const ineligibleMatches = allResults.filter((r) => r.status === "not_a_match");

  // Action handlers
  const handleProceed = (route: string, schemeId: string) => {
    setSelectedSchemeId(schemeId);
    router.push(route);
  };

  /**
   * A5: Build dynamic moratorium/grace period display text.
   * For ELS, the moratorium covers course duration + 1 year, which varies.
   * For other schemes, show the actual month count from scheme data.
   */
  function getMoratoriumDisplay(match: SchemeMatchResult): {
    headline: string;
    subtitle: string;
  } {
    const scheme = match.scheme;

    if (scheme.id === "ELS") {
      // ELS moratorium varies by course duration — don't show a fixed number
      return {
        headline: "Course + 1 Year",
        subtitle: scheme.moratoriumNote || "Repayment begins after course completion plus 1 year grace period.",
      };
    }

    if (scheme.moratoriumMonths > 0) {
      return {
        headline: `${scheme.moratoriumMonths} Months`,
        subtitle: scheme.moratoriumNote || `No repayment required for the first ${scheme.moratoriumMonths} months.`,
      };
    }

    return {
      headline: "None",
      subtitle: "Standard instalment schedule from commencement.",
    };
  }

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
              {profile.purpose === "education" ? "Education loan" : profile.purpose === "business" ? "Business loan" : "Financial assistance"}
              {profile.requestedAmount > 0 && ` (~₹${profile.requestedAmount.toLocaleString("en-IN")})`}
            </strong>
            {profile.state && <span className="ml-2 text-forest font-semibold">in {profile.state}</span>}
          </div>
          <Link href="/assessment" className="text-forest underline text-[11px] font-bold">
            Edit
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl font-black text-ink sm:text-3xl leading-snug">
            {bestMatch ? "We found the best government scheme for you" : "No Direct Match Found"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-forest font-semibold">
            आपकी आवश्यकता के अनुसार सबसे उपयुक्त योजना
          </p>
        </div>

        {/* 1. BEST MATCH CARD (Prominently Highlighted) */}
        {bestMatch ? (() => {
          const moratorium = getMoratoriumDisplay(bestMatch);
          return (
            <div className="rounded-3xl border-2 border-forest bg-white p-6 sm:p-8 shadow-soft relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-forest text-white px-3 py-1 text-xs font-black tracking-wide uppercase mb-4">
                <svg className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
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

                {/* A5: Dynamic moratorium — no hardcoded "Pay nothing for 3 months" */}
                <div className="rounded-xl border border-ink/10 p-3 bg-white">
                  <span className="block text-[11px] text-ink/50 font-bold uppercase">Grace Period</span>
                  <span className="block text-base sm:text-lg font-black text-ink mt-0.5">
                    {moratorium.headline}
                  </span>
                  <span className="text-[10px] text-ink/50">{moratorium.subtitle}</span>
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
                  Where to apply{profile.state ? ` in ${profile.state}` : ""} →
                </button>
              </div>
            </div>
          );
        })() : (
          /* Improved no-match experience with specific reasons */
          <div className="rounded-3xl border border-rose-200 bg-white p-6 sm:p-8 shadow-soft">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-100 mb-3">
                <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h2 className="text-xl font-black text-rose-800">No Direct Match Found</h2>
              <p className="mt-2 text-xs text-ink/70 leading-relaxed max-w-md mx-auto">
                Based on the information you provided, your profile does not meet the baseline requirements for any NSFDC scheme at this time.
              </p>
            </div>

            {/* Show specific reasons why the user doesn't qualify */}
            {ineligibleMatches.length > 0 && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-900 mb-4">
                <span className="font-bold block mb-2">Why you may not be eligible:</span>
                <ul className="space-y-1.5 list-disc list-inside">
                  {(() => {
                    // Deduplicate reasons across schemes
                    const allReasons = new Set<string>();
                    ineligibleMatches.forEach((m) => {
                      m.reasons.forEach((r) => allReasons.add(r));
                    });
                    return Array.from(allReasons).map((reason, idx) => (
                      <li key={idx} className="leading-relaxed">{reason}</li>
                    ));
                  })()}
                </ul>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-ink/60 mb-4">
                You can update your answers to check again, or visit an NSFDC office for guidance.
              </p>
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-ink min-h-[48px]"
              >
                <span>Update Your Answers</span>
                <span>→</span>
              </Link>
            </div>
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

function getPlainReason(match: SchemeMatchResult, profile: { requestedAmount: number; purpose?: string }): string {
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

