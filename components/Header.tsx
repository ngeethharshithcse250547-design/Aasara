"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useProfile } from "../lib/profileContext";
import { Locale, LOCALE_SHORT, t } from "../lib/i18n";

// Full desktop navigation
const desktopNavigation = [
  { href: "/", labelKey: "nav.home" },
  { href: "/assessment", labelKey: "nav.assessment" },
  { href: "/results", labelKey: "nav.results" },
  { href: "/calculator", labelKey: "nav.calculator" },
  { href: "/readiness", labelKey: "nav.documents" },
  { href: "/partners", labelKey: "nav.partners" },
];

// Simplified mobile navigation — only the essential routes
const mobileNavigation = [
  { href: "/", labelKey: "nav.home", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { href: "/assessment", labelKey: "nav.assessment", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
  { href: "/results", labelKey: "nav.results", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
  { href: "/partners", labelKey: "nav.partners", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { profile, updateProfile } = useProfile();
  const locale = (profile.locale || "en") as Locale;

  const handleLocaleChange = (newLocale: Locale) => {
    updateProfile({ locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-lg p-1"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-lg font-black text-white shadow-sm ring-2 ring-forest/20">
            S
          </span>
          <div>
            <span className="block text-base font-extrabold tracking-tight text-ink">
              {t("app.name", locale)}
            </span>
            <span className="block text-[11px] font-semibold text-forest">
              {t("app.tagline", locale)}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {desktopNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                  isActive
                    ? "bg-forest text-white shadow-sm"
                    : "text-ink/75 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {t(item.labelKey, locale)}
              </Link>
            );
          })}

          {/* Language Selector — desktop */}
          <div className="ml-2 flex items-center rounded-lg border border-ink/10 bg-white overflow-hidden">
            {(["en", "hi", "te"] as Locale[]).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocaleChange(loc)}
                className={`px-2.5 py-1.5 text-xs font-bold transition ${
                  locale === loc
                    ? "bg-forest text-white"
                    : "text-ink/60 hover:bg-sand/60 hover:text-ink"
                }`}
                aria-label={`Switch language to ${loc}`}
              >
                {LOCALE_SHORT[loc]}
              </button>
            ))}
          </div>

          <Link
            href="/assessment"
            className="ml-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            {t("nav.start_short", locale)}
          </Link>
        </nav>

        {/* Mobile: Language + Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Compact Language Selector — mobile */}
          <div className="flex items-center rounded-lg border border-ink/10 bg-white overflow-hidden">
            {(["en", "hi", "te"] as Locale[]).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleLocaleChange(loc)}
                className={`px-2 py-1.5 text-[11px] font-bold transition ${
                  locale === loc
                    ? "bg-forest text-white"
                    : "text-ink/50 hover:bg-sand/60"
                }`}
                aria-label={`Switch language to ${loc}`}
              >
                {LOCALE_SHORT[loc]}
              </button>
            ))}
          </div>

          {/* Mobile menu button (min 44x44px touch target) */}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-ink/20 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <span className="text-2xl font-bold leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer with comfortable touch targets */}
      {open && (
        <nav
          className="border-t border-ink/10 bg-white px-4 py-4 md:hidden shadow-lg"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-2">
            {mobileNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 min-h-[48px] rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-forest text-white"
                      : "text-ink/85 hover:bg-cream active:bg-sand"
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{t(item.labelKey, locale)}</span>
                </Link>
              );
            })}
            <Link
              href="/assessment"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center min-h-[48px] rounded-xl bg-forest px-4 py-3 text-center text-sm font-extrabold text-white shadow-sm"
            >
              {t("nav.start", locale)} →
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
