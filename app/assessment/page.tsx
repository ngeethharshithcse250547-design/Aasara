"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfile } from "../../lib/profileContext";
import { INDIAN_STATES_AND_UTS } from "../../lib/data/partners";
import { CommunityCategory } from "../../lib/matchingEngine";
import { t } from "../../lib/i18n";

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream p-8 text-center text-ink/70">Loading assessment...</div>}>
      <AssessmentContent />
    </Suspense>
  );
}

function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, updateProfile } = useProfile();
  const locale = profile.locale || "en";

  // Step 1 to 6
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Voice Assistant Drawer
  const [voiceOpen, setVoiceOpen] = useState<boolean>(false);
  const [naturalText, setNaturalText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<string>("");

  // Non-SC notice dismissed
  const [nonScDismissed, setNonScDismissed] = useState(false);

  useEffect(() => {
    // If opened with voice mode query
    if (searchParams.get("mode") === "voice") {
      setVoiceOpen(true);
    }
  }, [searchParams]);

  // Voice handler
  const handleVoiceListen = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please tap the choices below.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus("Listening... Please speak your need, income, and state.");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNaturalText(transcript);
      parseAndApplyVoice(transcript);
      setIsListening(false);
      setVoiceStatus(`Heard: "${transcript}"`);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceStatus("Could not hear clearly. You can speak again or tap the choices.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const parseAndApplyVoice = (text: string) => {
    const lower = text.toLowerCase();
    const updates: Record<string, any> = {};

    if (lower.includes("education") || lower.includes("college") || lower.includes("study") || lower.includes("btech")) {
      updates.purpose = "education";
    } else {
      updates.purpose = "business";
    }

    const lakhMatches = [...lower.matchAll(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|lacs)/g)];
    if (lakhMatches.length > 0) {
      const amount = parseFloat(lakhMatches[0][1]) * 100000;
      updates.requestedAmount = Math.round(amount);
      updates.projectOrCourseCost = Math.round(amount);
      if (lakhMatches.length > 1) {
        updates.annualFamilyIncome = Math.round(parseFloat(lakhMatches[1][1]) * 100000);
      }
    }

    for (const stateName of INDIAN_STATES_AND_UTS) {
      if (stateName !== "All States & UTs" && lower.includes(stateName.toLowerCase())) {
        updates.state = stateName;
        break;
      }
    }
    if (!updates.state) {
      if (lower.includes("up") || lower.includes("varanasi") || lower.includes("lucknow")) updates.state = "Uttar Pradesh";
      if (lower.includes("maharashtra") || lower.includes("mumbai")) updates.state = "Maharashtra";
      if (lower.includes("bihar")) updates.state = "Bihar";
    }

    updateProfile(updates);
    setVoiceStatus("Details saved! We updated your answers. You can continue below.");
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/results");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleCommunitySelect = (community: CommunityCategory) => {
    const isSC = community === "SC";
    updateProfile({
      community,
      isScheduledCaste: isSC,
    });
    // If non-SC, show the notice before advancing
    if (!isSC) {
      setNonScDismissed(false);
    } else {
      handleNext();
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-xl">
        {/* Top Simple Header & Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-ink/70 mb-2">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-forest hover:text-ink font-bold py-1 px-2 -ml-2 rounded-lg min-h-[44px]"
              aria-label="Go back"
            >
              {t("assess.back", locale)}
            </button>
            <span>
              {t("assess.question_of", locale, { current: String(currentStep), total: String(totalSteps) })}
            </span>
            <button
              type="button"
              onClick={() => setVoiceOpen(!voiceOpen)}
              className="inline-flex items-center gap-1 text-xs font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-lg hover:bg-forest/20 min-h-[44px]"
              aria-label={voiceOpen ? "Close voice assistant" : "Open voice assistant"}
            >
              <svg className="h-4 w-4 shrink-0 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> {voiceOpen ? t("assess.close_voice", locale) : t("assess.use_voice", locale)}
            </button>
          </div>

          {/* Accessible Step Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-sand" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
            <div
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              className="h-full bg-forest transition-all duration-300"
            />
          </div>
        </div>

        {/* Optional Voice Assistant Box */}
        {voiceOpen && (
          <div className="mb-6 rounded-2xl border border-forest/30 bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest uppercase tracking-wider">
                {t("voice.title", locale)}
              </span>
              <button
                type="button"
                onClick={() => setVoiceOpen(false)}
                className="text-xs text-ink/50 hover:text-ink font-bold min-h-[44px] min-w-[44px] grid place-items-center"
                aria-label="Close voice assistant"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs text-ink/70">
              {t("voice.hint", locale)}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleVoiceListen}
                disabled={isListening}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition min-h-[48px] ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-forest text-white hover:bg-ink"
                }`}
              >
                <span className="flex items-center gap-1.5">{isListening ? <><span className="h-2 w-2 rounded-full bg-white animate-pulse"></span> {t("voice.listening", locale)}</> : <><svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> {t("voice.tap_speak", locale)}</>}</span>
              </button>
            </div>
            {voiceStatus && (
              <p className="mt-2 text-xs font-semibold text-forest bg-forest/5 p-2 rounded-lg">
                {voiceStatus}
              </p>
            )}
          </div>
        )}

        {/* ONE QUESTION AT A TIME CARDS */}

        {/* QUESTION 1: Community / Category */}
        {currentStep === 1 && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Question 1
            </span>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl leading-snug">
              {t("assess.q1.title", locale)}
            </h1>
            <p className="mt-3 text-xs text-ink/70 leading-relaxed">
              {t("assess.q1.hint", locale)}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {[
                { key: "SC" as CommunityCategory, label: t("assess.q1.sc", locale), icon: "✓", hindiLabel: "अनुसूचित जाति" },
                { key: "ST" as CommunityCategory, label: t("assess.q1.st", locale), icon: "✓", hindiLabel: "अनुसूचित जनजाति" },
                { key: "Other" as CommunityCategory, label: t("assess.q1.other", locale), icon: "○", hindiLabel: "अन्य समुदाय" },
                { key: "prefer_not_to_say" as CommunityCategory, label: t("assess.q1.prefer_not", locale), icon: "—", hindiLabel: "बताना नहीं चाहते" },
              ].map((opt) => {
                const isSelected = profile.community === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleCommunitySelect(opt.key)}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold transition min-h-[58px] ${
                      isSelected
                        ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/20"
                        : "border-ink/15 hover:bg-sand/30 text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl" aria-hidden="true">{opt.icon}</span>
                      <div>
                        <span className="block text-base font-extrabold">{opt.label}</span>
                        <span className="block text-xs font-normal text-ink/60">{opt.hindiLabel}</span>
                      </div>
                    </div>
                    <span className="text-ink/40" aria-hidden="true">→</span>
                  </button>
                );
              })}
            </div>

            {/* Non-SC notice */}
            {profile.community && profile.community !== "SC" && !nonScDismissed && (
              <div className="mt-4 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-xs text-amber-900">
                <span className="font-extrabold flex items-center gap-1.5 mb-1"><svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Important Information</span>
                <p className="leading-relaxed">
                  {t("assess.q1.non_sc_note", locale)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNonScDismissed(true);
                    handleNext();
                  }}
                  className="mt-3 w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-700 min-h-[44px]"
                >
                  I understand, continue exploring →
                </button>
              </div>
            )}
          </div>
        )}

        {/* QUESTION 2: Caste Certificate */}
        {currentStep === 2 && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Question 2
            </span>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl leading-snug">
              {t("assess.q2.title", locale)}
            </h1>
            <p className="mt-3 text-xs text-ink/70 leading-relaxed">
              {t("assess.q2.hint", locale)}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {[
                { key: "in_hand" as const, label: t("assess.q2.in_hand", locale), icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, hindiLabel: "हाँ, मेरे पास प्रमाण पत्र है" },
                { key: "applied" as const, label: t("assess.q2.applied", locale), icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, hindiLabel: "आवेदन कर दिया है, मिलना बाकी है" },
                { key: "not_available" as const, label: t("assess.q2.not_available", locale), icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, hindiLabel: "अभी नहीं है (हम बताएंगे कैसे प्राप्त करें)" },
              ].map((opt) => {
                const isSelected = profile.casteCertificateStatus === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      updateProfile({ casteCertificateStatus: opt.key });
                      handleNext();
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold transition min-h-[58px] ${
                      isSelected
                        ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/20"
                        : "border-ink/15 hover:bg-sand/30 text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl" aria-hidden="true">{opt.icon}</span>
                      <div>
                        <span className="block text-base font-extrabold">{opt.label}</span>
                        <span className="block text-xs font-normal text-ink/60">{opt.hindiLabel}</span>
                      </div>
                    </div>
                    <span className="text-ink/40" aria-hidden="true">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 3: Purpose */}
        {currentStep === 3 && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Question 3
            </span>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl leading-snug">
              {t("assess.q3.title", locale)}
            </h1>

            <div className="mt-6 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  updateProfile({ purpose: "business" });
                  handleNext();
                }}
                className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left font-bold transition min-h-[72px] ${
                  profile.purpose === "business"
                    ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/20"
                    : "border-ink/15 hover:bg-sand/30 text-ink"
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest/10 text-forest" aria-hidden="true">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </span>
                <div>
                  <span className="block text-base font-extrabold">{t("assess.q3.business", locale)}</span>
                  <span className="block text-xs font-normal text-ink/65 mt-0.5">
                    {t("assess.q3.business_hint", locale)}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateProfile({ purpose: "education" });
                  handleNext();
                }}
                className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left font-bold transition min-h-[72px] ${
                  profile.purpose === "education"
                    ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/20"
                    : "border-ink/15 hover:bg-sand/30 text-ink"
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest/10 text-forest" aria-hidden="true">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                </span>
                <div>
                  <span className="block text-base font-extrabold">{t("assess.q3.education", locale)}</span>
                  <span className="block text-xs font-normal text-ink/65 mt-0.5">
                    {t("assess.q3.education_hint", locale)}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 4: Amount Needed */}
        {currentStep === 4 && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Question 4
            </span>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl leading-snug">
              {t("assess.q4.title", locale)}
            </h1>
            <p className="mt-2 text-xs text-ink/70">
              {t("assess.q4.hint", locale)}
            </p>

            {/* Quick selectable ranges — NO pre-selected default */}
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[
                { label: "Up to ₹50,000", amount: 45000, desc: "Small shop / tools / raw material" },
                { label: "₹50,000 to ₹1.4 Lakh", amount: 120000, desc: "Most popular for small businesses (MFS)" },
                { label: "₹1.4 Lakh to ₹5 Lakh", amount: 300000, desc: "Vehicles, machines, medium setup (UNY)" },
                { label: "₹5 Lakh to ₹20 Lakh+", amount: 1000000, desc: "Large unit, workshop, higher course" },
              ].map((range) => {
                // Only highlight if user has actually selected — requestedAmount > 0
                const isChosen =
                  profile.requestedAmount > 0 &&
                  profile.requestedAmount >= range.amount * 0.7 &&
                  profile.requestedAmount <= range.amount * 1.5;
                return (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => {
                      updateProfile({
                        requestedAmount: range.amount,
                        projectOrCourseCost: range.amount,
                      });
                    }}
                    className={`rounded-2xl border-2 p-3.5 text-left transition min-h-[64px] ${
                      isChosen
                        ? "border-forest bg-forest/10 text-forest ring-1 ring-forest"
                        : "border-ink/15 hover:bg-sand/30 text-ink"
                    }`}
                  >
                    <span className="block text-sm font-extrabold">{range.label}</span>
                    <span className="block text-[11px] text-ink/60 mt-0.5">{range.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Manual input for precision */}
            <div className="mt-6 border-t border-ink/10 pt-4">
              <label htmlFor="amount-input" className="block text-xs font-bold text-ink/70 mb-1.5">
                {t("assess.q4.exact_label", locale)}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-base font-bold text-ink/40" aria-hidden="true">₹</span>
                <input
                  id="amount-input"
                  type="number"
                  min={5000}
                  max={5000000}
                  step={5000}
                  value={profile.requestedAmount || ""}
                  placeholder="0"
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value));
                    updateProfile({
                      requestedAmount: val,
                      projectOrCourseCost: val,
                    });
                  }}
                  className="w-full rounded-xl border border-ink/20 bg-cream/40 py-3 pl-8 pr-4 text-base font-bold text-ink focus:border-forest focus:bg-white focus:outline-none min-h-[48px]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={profile.requestedAmount <= 0}
                className="w-full sm:w-auto rounded-xl bg-forest px-8 py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-ink min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("assess.continue", locale)}
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 5: Family Income */}
        {currentStep === 5 && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Question 5
            </span>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl leading-snug">
              {t("assess.q5.title", locale)}
            </h1>
            <p className="mt-2 text-xs text-ink/70 leading-relaxed">
              {t("assess.q5.hint", locale)}
            </p>

            {/* Quick selectable ranges — NO pre-selected default */}
            <div className="mt-6 flex flex-col gap-3">
              {[
                { label: "Less than ₹1.5 Lakh / year", val: 120000, desc: "Under ₹12,000 a month" },
                { label: "₹1.5 Lakh to ₹3 Lakh / year", val: 200000, desc: "About ₹15,000 to ₹25,000 a month" },
                { label: "₹3 Lakh to ₹5 Lakh / year", val: 400000, desc: "About ₹25,000 to ₹40,000 a month" },
                { label: "More than ₹5 Lakh / year", val: 600000, desc: "Above government limit" },
              ].map((income) => {
                // Only show as selected if annualFamilyIncome > 0 (user has answered)
                const isSelected =
                  profile.annualFamilyIncome > 0 &&
                  profile.annualFamilyIncome === income.val;
                return (
                  <button
                    key={income.label}
                    type="button"
                    onClick={() => {
                      updateProfile({ annualFamilyIncome: income.val });
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition min-h-[58px] ${
                      isSelected
                        ? "border-forest bg-forest/10 text-forest ring-1 ring-forest"
                        : "border-ink/15 hover:bg-sand/30 text-ink"
                    }`}
                  >
                    <div>
                      <span className="block text-base font-extrabold">{income.label}</span>
                      <span className="block text-xs text-ink/60">{income.desc}</span>
                    </div>
                    <span className="text-xl" aria-hidden="true">{isSelected ? "✓" : "○"}</span>
                  </button>
                );
              })}
            </div>

            {profile.annualFamilyIncome > 500000 && (
              <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800">
                <svg className="h-4 w-4 inline mr-1 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> {t("assess.q5.over_limit", locale)}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={profile.annualFamilyIncome <= 0}
                className="w-full sm:w-auto rounded-xl bg-forest px-8 py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-ink min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("assess.continue", locale)}
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 6: State / Location */}
        {currentStep === 6 && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Question 6
            </span>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl leading-snug">
              {t("assess.q6.title", locale)}
            </h1>
            <p className="mt-2 text-xs text-ink/70">
              {t("assess.q6.hint", locale)}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="state-select" className="block text-xs font-bold text-ink/70 mb-1.5">
                  {t("assess.q6.select_state", locale)}:
                </label>
                <select
                  id="state-select"
                  value={profile.state}
                  onChange={(e) => updateProfile({ state: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 bg-cream/40 p-3.5 text-base font-bold text-ink focus:border-forest focus:bg-white focus:outline-none min-h-[50px]"
                >
                  <option value="">{t("assess.q6.select_placeholder", locale)}</option>
                  {INDIAN_STATES_AND_UTS.filter((s) => s !== "All States & UTs").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick state chips for popular states */}
              <div>
                <span className="block text-xs text-ink/50 mb-1.5">{t("assess.q6.tap_quickly", locale)}</span>
                <div className="flex flex-wrap gap-2">
                  {["Uttar Pradesh", "Maharashtra", "Bihar", "Madhya Pradesh", "Rajasthan", "Tamil Nadu", "Delhi"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateProfile({ state: st })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition min-h-[36px] ${
                        profile.state === st
                          ? "bg-forest text-white"
                          : "bg-sand/60 text-ink/70 hover:bg-sand"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="district-input" className="block text-xs font-bold text-ink/70 mb-1.5">
                  {t("assess.q6.district_label", locale)}
                </label>
                <input
                  id="district-input"
                  type="text"
                  placeholder="e.g. Varanasi, Pune, Patna"
                  value={profile.district || ""}
                  onChange={(e) => updateProfile({ district: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 bg-cream/40 p-3.5 text-sm font-semibold text-ink focus:border-forest focus:bg-white focus:outline-none min-h-[48px]"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => router.push("/results")}
                disabled={!profile.state}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-forest px-8 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink min-h-[54px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{t("assess.show_results", locale)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Ask Sahayak button at bottom of assessment */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              const fab = document.getElementById("chatbot-fab");
              if (fab) fab.click();
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-forest hover:text-ink transition py-2 px-3 rounded-lg hover:bg-forest/5 min-h-[44px]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span>{t("assess.ask_sahayak", locale)} — {t("chatbot.subtitle", locale)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
