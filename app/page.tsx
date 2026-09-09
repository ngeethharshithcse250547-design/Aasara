"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "../lib/profileContext";

export default function HomePage() {
  const router = useRouter();
  const { updateProfile } = useProfile();

  const handleStartWithPurpose = (purpose: "business" | "education") => {
    updateProfile({ purpose });
    router.push("/assessment");
  };

  return (
    <div className="bg-cream min-h-[calc(100vh-140px)]">
      {/* Hero Section */}
      <section className="px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Official badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-3.5 py-1.5 text-xs font-bold text-forest shadow-sm mb-6">
            <span className="h-2 w-2 rounded-full bg-forest" />
            <span>Government Assistance for SC Entrepreneurs &amp; Students</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-5xl leading-tight">
            Need help finding government financial assistance?
          </h1>

          <p className="mt-4 text-base sm:text-lg text-ink/75 leading-relaxed">
            Answer a few simple questions. We will find the right government loan or scheme for you, with no complicated paperwork words.
          </p>

          {/* Two Clear Primary Choices (Mobile-first, huge tap targets) */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
            <button
              type="button"
              onClick={() => handleStartWithPurpose("business")}
              className="flex items-center gap-4 rounded-2xl border-2 border-forest/40 bg-white p-5 shadow-soft transition hover:border-forest hover:bg-forest/5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest min-h-[88px]"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-forest/10 text-3xl">
                🏪
              </span>
              <div>
                <span className="block text-lg font-black text-ink leading-snug">
                  I need money for my business
                </span>
                <span className="block text-xs font-semibold text-forest mt-0.5">
                  लघु व्यवसाय / दुकान / कृषि उपकरण
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleStartWithPurpose("education")}
              className="flex items-center gap-4 rounded-2xl border-2 border-forest/40 bg-white p-5 shadow-soft transition hover:border-forest hover:bg-forest/5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest min-h-[88px]"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-forest/10 text-3xl">
                🎓
              </span>
              <div>
                <span className="block text-lg font-black text-ink leading-snug">
                  I need money for education
                </span>
                <span className="block text-xs font-semibold text-forest mt-0.5">
                  उच्च शिक्षा / कॉलेज / तकनीकी कोर्स
                </span>
              </div>
            </button>
          </div>

          {/* Optional secondary action: Talk to Scheme Sahayak */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <Link
              href="/assessment?mode=voice"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/20 bg-white px-6 py-3 text-sm font-bold text-ink transition hover:bg-sand/60 active:bg-sand min-h-[48px] shadow-sm"
            >
              <span>🎤</span>
              <span>Talk or speak to Scheme Sahayak</span>
            </Link>
            <span className="text-xs text-ink/55">
              Speak in Hindi or English · Free service · No login needed
            </span>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Explanation for Low-Literacy Users */}
      <section className="border-t border-ink/10 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-black text-ink sm:text-2xl">
            How Scheme Sahayak works for you
          </h2>
          <p className="mt-1 text-center text-xs text-ink/60">
            You don&apos;t need to know government scheme rules. We do the work for you.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-cream/50 border border-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-lg font-black text-white mb-3">
                1
              </span>
              <h3 className="font-extrabold text-base text-ink">Answer 4 simple questions</h3>
              <p className="mt-1.5 text-xs text-ink/70 leading-relaxed">
                Tell us your need, caste certificate status, and city. No technical words.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-cream/50 border border-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-lg font-black text-white mb-3">
                2
              </span>
              <h3 className="font-extrabold text-base text-ink">See the best match</h3>
              <p className="mt-1.5 text-xs text-ink/70 leading-relaxed">
                We highlight the single best government scheme for you and what your repayment could look like.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-cream/50 border border-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-lg font-black text-white mb-3">
                3
              </span>
              <h3 className="font-extrabold text-base text-ink">Know where to go</h3>
              <p className="mt-1.5 text-xs text-ink/70 leading-relaxed">
                Get a simple paper checklist and find the official government office or bank in your state.
              </p>
            </div>
          </div>

          {/* Calming Trust Note */}
          <div className="mt-10 rounded-2xl border border-forest/20 bg-forest/5 p-4 sm:p-5 text-center text-xs text-ink/75 leading-relaxed">
            <span className="font-bold text-forest block sm:inline mr-1">Trustworthy &amp; Safe:</span>
            Scheme Sahayak does not ask for bank passwords, Aadhaar OTPs, or fees. We help you connect to official Government of India (NSFDC / PM-SURAJ) channels.
          </div>
        </div>
      </section>
    </div>
  );
}
