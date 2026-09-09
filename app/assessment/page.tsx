"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfile } from "../../lib/profileContext";
import { INDIAN_STATES_AND_UTS } from "../../lib/data/partners";

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

  // Step 1 to 6
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Voice Assistant Drawer
  const [voiceOpen, setVoiceOpen] = useState<boolean>(false);
  const [naturalText, setNaturalText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<string>("");

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
      updates.projectOrCourseCost = Math.round(amount * 1.1);
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

  return (
    <div className="min-h-[calc(100vh-140px)] bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-xl">
        {/* Top Simple Header & Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-ink/70 mb-2">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-forest hover:text-ink font-bold py-1 px-2 -ml-2 rounded-lg"
            >
              ← Back
            </button>
            <span>
              Question {currentStep} of {totalSteps}
            </span>
            <button
              type="button"
              onClick={() => setVoiceOpen(!voiceOpen)}
              className="inline-flex items-center gap-1 text-xs font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-lg hover:bg-forest/20"
            >
              🎤 {voiceOpen ? "Close Voice" : "Use Voice"}
            </button>
          </div>

          {/* Accessible Step Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
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
                Voice Assistant (आवाज़ से बताएं)
              </span>
              <button
                type="button"
                onClick={() => setVoiceOpen(false)}
                className="text-xs text-ink/50 hover:text-ink font-bold"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs text-ink/70">
              Tap the button below and speak in Hindi or English about your need.
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
                <span>{isListening ? "🔴 Listening..." : "🎤 Tap to Speak Now"}</span>
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

        {/* QUESTION 1: SC Community */}
        {currentStep === 1 && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Question 1
            </span>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl leading-snug">
              Are you from the Scheduled Caste (SC) community?
            </h1>
            <p className="mt-1 text-sm font-semibold text-forest">
              क्या आप अनुसूचित जाति (SC) समुदाय से हैं?
            </p>
            <p className="mt-3 text-xs text-ink/70 leading-relaxed">
              These special government loans are provided specifically to support members of the Scheduled Caste community.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  updateProfile({ isScheduledCaste: true });
                  handleNext();
                }}
                className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold transition min-h-[58px] ${
                  profile.isScheduledCaste === true
                    ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/20"
                    : "border-ink/15 hover:bg-sand/30 text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">✓</span>
                  <div>
                    <span className="block text-base font-extrabold">Yes, I belong to SC community</span>
                    <span className="block text-xs font-normal text-ink/60">हाँ, मैं अनुसूचित जाति से हूँ</span>
                  </div>
                </div>
                <span className="text-ink/40">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateProfile({ isScheduledCaste: false });
                  handleNext();
                }}
                className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold transition min-h-[58px] ${
                  profile.isScheduledCaste === false
                    ? "border-rose-500 bg-rose-50 text-rose-800"
                    : "border-ink/15 hover:bg-sand/30 text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">✕</span>
                  <div>
                    <span className="block text-base font-extrabold">No, another community</span>
                    <span className="block text-xs font-normal text-ink/60">नहीं, अन्य समुदाय</span>
                  </div>
                </div>
                <span className="text-ink/40">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateProfile({ isScheduledCaste: true });
                  handleNext();
                }}
                className="flex items-center justify-between rounded-2xl border-2 border-ink/15 p-4 text-left font-bold transition hover:bg-sand/30 text-ink min-h-[58px]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">❓</span>
                  <div>
                    <span className="block text-base font-extrabold">I am not sure / I don&apos;t know</span>
                    <span className="block text-xs font-normal text-ink/60">मुझे पूरी जानकारी नहीं है</span>
                  </div>
                </div>
                <span className="text-ink/40">→</span>
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 2: Caste Certificate */}
        {currentStep === 2 && (
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Question 2
            </span>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl leading-snug">
              Do you have an SC caste certificate?
            </h1>
            <p className="mt-1 text-sm font-semibold text-forest">
              क्या आपके पास जाति प्रमाण पत्र है?
            </p>
            <p className="mt-3 text-xs text-ink/70 leading-relaxed">
              An official paper or digital certificate issued by your local Tahsildar / revenue office is required for the application.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  updateProfile({ casteCertificateStatus: "in_hand" });
                  handleNext();
                }}
                className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold transition min-h-[58px] ${
                  profile.casteCertificateStatus === "in_hand"
                    ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/20"
                    : "border-ink/15 hover:bg-sand/30 text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <span className="block text-base font-extrabold">Yes, I have it in hand</span>
                    <span className="block text-xs font-normal text-ink/60">हाँ, मेरे पास प्रमाण पत्र है</span>
                  </div>
                </div>
                <span className="text-ink/40">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateProfile({ casteCertificateStatus: "applied" });
                  handleNext();
                }}
                className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold transition min-h-[58px] ${
                  profile.casteCertificateStatus === "applied"
                    ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/20"
                    : "border-ink/15 hover:bg-sand/30 text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">⏳</span>
                  <div>
                    <span className="block text-base font-extrabold">I have applied for it</span>
                    <span className="block text-xs font-normal text-ink/60">आवेदन कर दिया है, मिलना बाकी है</span>
                  </div>
                </div>
                <span className="text-ink/40">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateProfile({ casteCertificateStatus: "not_available" });
                  handleNext();
                }}
                className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left font-bold transition min-h-[58px] ${
                  profile.casteCertificateStatus === "not_available"
                    ? "border-forest bg-forest/10 text-forest ring-2 ring-forest/20"
                    : "border-ink/15 hover:bg-sand/30 text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">ℹ️</span>
                  <div>
                    <span className="block text-base font-extrabold">Not yet / Need help getting one</span>
                    <span className="block text-xs font-normal text-ink/60">अभी नहीं है (हम बताएंगे कैसे प्राप्त करें)</span>
                  </div>
                </div>
                <span className="text-ink/40">→</span>
              </button>
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
              What do you need the money for?
            </h1>
            <p className="mt-1 text-sm font-semibold text-forest">
              आपको सहायता किस उद्देश्य के लिए चाहिए?
            </p>

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
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest/10 text-2xl">
                  🏪
                </span>
                <div>
                  <span className="block text-base font-extrabold">Start or grow a business</span>
                  <span className="block text-xs font-normal text-ink/65 mt-0.5">
                    Tailoring, grocery shop, transport, tools, animal husbandry, trade
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
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest/10 text-2xl">
                  🎓
                </span>
                <div>
                  <span className="block text-base font-extrabold">Higher or technical education</span>
                  <span className="block text-xs font-normal text-ink/65 mt-0.5">
                    College fees, engineering, medical, professional degrees
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
              How much money do you need?
            </h1>
            <p className="mt-1 text-sm font-semibold text-forest">
              लगभग कितने रुपयों की आवश्यकता है?
            </p>
            <p className="mt-2 text-xs text-ink/70">
              Government schemes can cover up to 90% of your total requirement.
            </p>

            {/* Quick selectable ranges (Tap-friendly buttons) */}
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[
                { label: "Up to ₹50,000", amount: 45000, desc: "Small shop / tools / raw material" },
                { label: "₹50,000 to ₹1.4 Lakh", amount: 120000, desc: "Most popular for small businesses (MFS)" },
                { label: "₹1.4 Lakh to ₹5 Lakh", amount: 300000, desc: "Vehicles, machines, medium setup (UNY)" },
                { label: "₹5 Lakh to ₹20 Lakh+", amount: 1000000, desc: "Large unit, workshop, higher course" },
              ].map((range) => {
                const isChosen =
                  profile.requestedAmount >= range.amount * 0.7 &&
                  profile.requestedAmount <= range.amount * 1.5;
                return (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => {
                      updateProfile({
                        requestedAmount: range.amount,
                        projectOrCourseCost: Math.round(range.amount * 1.1),
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
              <label className="block text-xs font-bold text-ink/70 mb-1.5">
                Or enter an exact amount:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-base font-bold text-ink/40">₹</span>
                <input
                  type="number"
                  min={5000}
                  max={5000000}
                  step={5000}
                  value={profile.requestedAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateProfile({
                      requestedAmount: val,
                      projectOrCourseCost: Math.round(val * 1.1),
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
                className="w-full sm:w-auto rounded-xl bg-forest px-8 py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-ink min-h-[48px]"
              >
                Continue →
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
              About how much does your family earn in a year?
            </h1>
            <p className="mt-1 text-sm font-semibold text-forest">
              आपके परिवार की कुल सालाना आय लगभग कितनी है?
            </p>
            <p className="mt-2 text-xs text-ink/70 leading-relaxed">
              Under official rules, family income must be within <strong>₹5,00,000 per year</strong> to qualify for concessional loans.
            </p>

            {/* Quick selectable ranges */}
            <div className="mt-6 flex flex-col gap-3">
              {[
                { label: "Less than ₹1.5 Lakh / year", val: 120000, desc: "Under ₹12,000 a month" },
                { label: "₹1.5 Lakh to ₹3 Lakh / year", val: 200000, desc: "About ₹15,000 to ₹25,000 a month" },
                { label: "₹3 Lakh to ₹5 Lakh / year", val: 400000, desc: "About ₹25,000 to ₹40,000 a month" },
                { label: "More than ₹5 Lakh / year", val: 600000, desc: "Above government limit" },
              ].map((income) => {
                const isSelected =
                  income.val <= 500000
                    ? profile.annualFamilyIncome <= income.val && profile.annualFamilyIncome >= income.val - 100000
                    : profile.annualFamilyIncome > 500000;
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
                    <span className="text-xl">{isSelected ? "✓" : "○"}</span>
                  </button>
                );
              })}
            </div>

            {profile.annualFamilyIncome > 500000 && (
              <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800">
                ⚠️ Note: The government limit is ₹5,00,000. Beneficiaries earning above ₹5 Lakh may not be eligible for these subsidized schemes.
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto rounded-xl bg-forest px-8 py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-ink min-h-[48px]"
              >
                Continue →
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
              Which state do you live in?
            </h1>
            <p className="mt-1 text-sm font-semibold text-forest">
              आप किस राज्य में रहते हैं?
            </p>
            <p className="mt-2 text-xs text-ink/70">
              We use this to find the government loan office and partner banks in your district.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-1.5">
                  Select your State / Union Territory:
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => updateProfile({ state: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 bg-cream/40 p-3.5 text-base font-bold text-ink focus:border-forest focus:bg-white focus:outline-none min-h-[50px]"
                >
                  {INDIAN_STATES_AND_UTS.filter((s) => s !== "All States & UTs").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick state chips for popular states */}
              <div>
                <span className="block text-xs text-ink/50 mb-1.5">Or tap quickly:</span>
                <div className="flex flex-wrap gap-2">
                  {["Uttar Pradesh", "Maharashtra", "Bihar", "Madhya Pradesh", "Rajasthan", "Tamil Nadu", "Delhi"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateProfile({ state: st })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
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
                <label className="block text-xs font-bold text-ink/70 mb-1.5">
                  District / Town (Optional):
                </label>
                <input
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
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-forest px-8 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink min-h-[54px]"
              >
                <span>Show My Best Match</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
