"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/assessment", label: "Find Schemes" },
  { href: "/results", label: "Results" },
  { href: "/calculator", label: "Repayment Calculator" },
  { href: "/readiness", label: "Document Checklist" },
  { href: "/partners", label: "Where to Apply" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
              Scheme Sahayak
            </span>
            <span className="block text-[11px] font-semibold text-forest">
              Govt. Financial Assistance
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navigation.map((item) => {
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
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/assessment"
            className="ml-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            Start Check →
          </Link>
        </nav>

        {/* Mobile menu button (min 44x44px touch target) */}
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl border border-ink/20 text-ink md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <span className="text-2xl font-bold leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile navigation drawer with comfortable touch targets */}
      {open && (
        <nav
          className="border-t border-ink/10 bg-white px-4 py-4 md:hidden shadow-lg"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center min-h-[48px] rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-forest text-white"
                      : "text-ink/85 hover:bg-cream active:bg-sand"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/assessment"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center min-h-[48px] rounded-xl bg-forest px-4 py-3 text-center text-sm font-extrabold text-white shadow-sm"
            >
              Start Free Check →
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
