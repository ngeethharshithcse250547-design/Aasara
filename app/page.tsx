"use client";

import Link from "next/link";
import { useProfile } from "../lib/profileContext";
import { t } from "../lib/i18n";

export default function HomePage() {
  const { profile } = useProfile();
  const locale = profile.locale || "en";

  return (
    <div className="bg-cream min-h-[calc(100vh-140px)]">
      {/* Hero Section */}
      <section className="px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Official badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-3.5 py-1.5 text-xs font-bold text-forest shadow-sm mb-6">
            <span className="h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
            <span>{t("app.trust_badge", locale)}</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-5xl leading-tight">
            {t("home.headline", locale)}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-ink/75 leading-relaxed">
            {t("home.subtext", locale)}
          </p>

          {/* Single Primary CTA: Start Assessment */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-forest px-10 py-5 text-lg font-black text-white shadow-lg transition hover:bg-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 min-h-[60px]"
              id="start-assessment-btn"
            >
              <svg className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              <span>{t("home.cta_primary", locale)}</span>
              <span aria-hidden="true">→</span>
            </Link>
            <span className="text-xs text-ink/55">
              {t("home.cta_primary_hint", locale)}
            </span>
          </div>

          {/* Secondary CTA: Talk to Scheme Sahayak (chatbot) */}
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                // Trigger the chatbot FAB click
                const fab = document.getElementById("chatbot-fab");
                if (fab) fab.click();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-forest/30 bg-white px-6 py-3.5 text-sm font-bold text-forest transition hover:bg-forest/5 active:bg-forest/10 min-h-[48px] shadow-sm"
              id="chatbot-home-btn"
            >
              <svg className="h-5 w-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <span>{t("home.cta_chatbot", locale)}</span>
            </button>
            <span className="text-xs text-ink/50">
              {t("home.cta_chatbot_hint", locale)}
            </span>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Explanation for Low-Literacy Users */}
      <section className="border-t border-ink/10 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-black text-ink sm:text-2xl">
            {t("home.how_title", locale)}
          </h2>
          <p className="mt-1 text-center text-xs text-ink/60">
            {t("home.how_subtext", locale)}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-cream/50 border border-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-lg font-black text-white mb-3" aria-hidden="true">
                1
              </span>
              <h3 className="font-extrabold text-base text-ink">{t("home.step1_title", locale)}</h3>
              <p className="mt-1.5 text-xs text-ink/70 leading-relaxed">
                {t("home.step1_desc", locale)}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-cream/50 border border-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-lg font-black text-white mb-3" aria-hidden="true">
                2
              </span>
              <h3 className="font-extrabold text-base text-ink">{t("home.step2_title", locale)}</h3>
              <p className="mt-1.5 text-xs text-ink/70 leading-relaxed">
                {t("home.step2_desc", locale)}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-cream/50 border border-ink/5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-lg font-black text-white mb-3" aria-hidden="true">
                3
              </span>
              <h3 className="font-extrabold text-base text-ink">{t("home.step3_title", locale)}</h3>
              <p className="mt-1.5 text-xs text-ink/70 leading-relaxed">
                {t("home.step3_desc", locale)}
              </p>
            </div>
          </div>

          {/* Quick Links — Where to Apply prominent */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/partners"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/15 bg-cream px-5 py-3 text-sm font-bold text-ink transition hover:bg-sand min-h-[48px]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{t("nav.partners", locale)}</span>
            </Link>
          </div>

          {/* Calming Trust Note */}
          <div className="mt-10 rounded-2xl border border-forest/20 bg-forest/5 p-4 sm:p-5 text-center text-xs text-ink/75 leading-relaxed">
            <span className="font-bold text-forest block sm:inline mr-1">{t("home.trust_title", locale)}</span>
            {t("home.trust_text", locale)}
          </div>
        </div>
      </section>
    </div>
  );
}
