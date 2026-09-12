"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "../../lib/profileContext";
import { SCHEMES } from "../../lib/data/schemes";
import { calculateRepayment, CalculationResult } from "../../lib/calculatorEngine";

export default function CalculatorPage() {
  const router = useRouter();
  const { profile, selectedSchemeId, setSelectedSchemeId } = useProfile();

  const currentScheme = SCHEMES.find((s) => s.id === selectedSchemeId) || SCHEMES[0];

  // Calculator inputs
  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRatePct, setInterestRatePct] = useState<number>(6.5);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [frequency, setFrequency] = useState<"Quarterly" | "Monthly">("Quarterly");
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(3);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Synchronize with selectedScheme
  useEffect(() => {
    if (currentScheme) {
      const defaultPrincipal = Math.min(
        profile.requestedAmount > 0 ? profile.requestedAmount : 100000,
        currentScheme.maxLoanAmount
      );
      setPrincipal(defaultPrincipal);
      setInterestRatePct(currentScheme.interestRate * 100);
      setTenureMonths(currentScheme.maxRepaymentMonths);
      setFrequency(currentScheme.instalmentFrequency);
      setMoratoriumMonths(currentScheme.moratoriumMonths);
    }
  }, [currentScheme, profile.requestedAmount]);

  const calculation: CalculationResult = calculateRepayment({
    principal,
    annualInterestRate: interestRatePct / 100,
    tenureMonths,
    frequency,
    moratoriumMonths,
  });

  const principalPct =
    calculation.totalAmountPayable > 0
      ? Math.round((principal / calculation.totalAmountPayable) * 100)
      : 100;
  const interestPct = 100 - principalPct;

  // Step increments for mobile (+ / - buttons)
  const adjustPrincipal = (delta: number) => {
    setPrincipal((prev) => Math.max(10000, Math.min(currentScheme.maxLoanAmount, prev + delta)));
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Simple Top Navigation */}
        <div className="mb-4 flex items-center justify-between text-xs font-bold text-ink/70">
          <Link
            href="/results"
            className="inline-flex items-center gap-1 text-forest hover:text-ink font-bold py-1 px-2 -ml-2 rounded-lg"
          >
            ← Back to Results
          </Link>
          <span className="text-forest">Repayment Calculator</span>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-ink sm:text-3xl leading-snug">
            How much will you pay back?
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-forest font-semibold">
            किश्त एवं अनुमानित ब्याज विवरण
          </p>
          <p className="mt-2 text-xs text-ink/70 leading-relaxed">
            See your estimated repayment based on government-approved low interest rates.
          </p>
        </div>

        {/* Scheme Selector Chips (Scrollable / wrap cleanly on mobile) */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-ink/60 mb-2">
            Selected Scheme:
          </label>
          <div className="flex flex-wrap gap-2">
            {SCHEMES.map((s) => {
              const isSelected = s.id === currentScheme.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSchemeId(s.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition min-h-[40px] ${
                    isSelected
                      ? "bg-forest text-white shadow-sm"
                      : "bg-white border border-ink/15 text-ink/75 hover:bg-sand/60"
                  }`}
                >
                  {s.id} · {(s.interestRate * 100).toFixed(1)}%
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlight Banner for Quarterly MFS repayment */}
        {currentScheme.id === "MFS" && (
          <div className="mb-6 rounded-2xl border border-gold/40 bg-gold/15 p-4 text-xs text-ink flex items-start gap-3">
            <svg className="h-5 w-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <span className="font-extrabold text-ink">Paid Every 3 Months:</span>
              <p className="mt-0.5 text-ink/80 leading-relaxed">
                For this Micro Finance Scheme (MFS), government rules set repayments as <strong>Quarterly (every 3 months)</strong>. You do not have to pay every month.
              </p>
            </div>
          </div>
        )}

        {/* Big Instalment Highlight Card (Hero on Mobile) */}
        <div className="mb-6 rounded-3xl border-2 border-forest bg-white p-6 sm:p-8 shadow-soft text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-forest">
            Estimated Instalment Amount
          </span>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-ink">
              ₹{calculation.instalmentAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-bold text-forest">
              {frequency === "Quarterly" ? "every 3 months (Quarterly)" : "per month"}
            </span>
          </div>

          <p className="mt-2 text-xs text-ink/65">
            Total {calculation.totalInstalments} instalments over {tenureMonths - moratoriumMonths} active months.
          </p>

          {/* Simple Breakdown Numbers */}
          <div className="mt-6 space-y-2.5 border-t border-ink/10 pt-4 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-ink/65">Loan amount:</span>
              <span className="font-extrabold text-ink">₹{principal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/65">Total estimated interest:</span>
              <span className="font-extrabold text-gold">₹{calculation.totalInterest.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 text-sm sm:text-base">
              <span className="font-extrabold text-ink">Total amount you pay back:</span>
              <span className="font-black text-forest">₹{calculation.totalAmountPayable.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Visual Bar */}
          <div className="mt-5">
            <div className="flex justify-between text-[11px] font-bold text-ink/60 mb-1">
              <span>Principal ({principalPct}%)</span>
              <span>Interest ({interestPct}%)</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-sand">
              <div style={{ width: `${principalPct}%` }} className="bg-forest" />
              <div style={{ width: `${interestPct}%` }} className="bg-gold" />
            </div>
          </div>
        </div>

        {/* Adjust Loan Amount (Touchscreen Friendly Controls) */}
        <div className="mb-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-soft space-y-5">
          <h2 className="text-base font-black text-ink">Adjust loan details</h2>

          {/* Loan Amount with Touch-friendly + / - buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-ink/70">
                Loan Amount
              </label>
              <span className="text-base font-black text-forest">
                ₹{principal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustPrincipal(-10000)}
                className="grid h-12 w-12 place-items-center rounded-xl bg-sand/70 text-lg font-bold text-ink hover:bg-sand active:scale-95 shrink-0"
                aria-label="Decrease 10,000"
              >
                -
              </button>
              <input
                type="number"
                min={10000}
                max={currentScheme.maxLoanAmount}
                step={5000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full rounded-xl border border-ink/20 bg-cream/40 py-3 px-3 text-center text-base font-bold text-ink focus:border-forest focus:bg-white focus:outline-none min-h-[48px]"
              />
              <button
                type="button"
                onClick={() => adjustPrincipal(10000)}
                className="grid h-12 w-12 place-items-center rounded-xl bg-sand/70 text-lg font-bold text-ink hover:bg-sand active:scale-95 shrink-0"
                aria-label="Increase 10,000"
              >
                +
              </button>
            </div>
            <span className="block text-[11px] text-ink/50 mt-1">
              Max for this scheme: ₹{currentScheme.maxLoanAmount.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Tenure selection (simple tap buttons) */}
          <div>
            <label className="block text-xs font-bold text-ink/70 mb-2">
              Repayment Time: {tenureMonths} Months ({Math.round(tenureMonths / 12)} Years)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[12, 24, 36, 60, 84]
                .filter((t) => t <= currentScheme.maxRepaymentMonths)
                .map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenureMonths(t)}
                    className={`rounded-xl py-2.5 px-3 text-xs font-bold transition min-h-[44px] ${
                      tenureMonths === t
                        ? "bg-forest text-white"
                        : "bg-cream border border-ink/15 text-ink hover:bg-sand"
                    }`}
                  >
                    {t / 12} {t === 12 ? "Year" : "Years"}
                  </button>
                ))}
            </div>
          </div>

          {/* Grace Period (Moratorium) */}
          <div className="border-t border-ink/10 pt-4 text-xs">
            <span className="font-bold text-ink block mb-1">Grace period: {moratoriumMonths} Months</span>
            <p className="text-ink/65 leading-relaxed">
              You do not have to make principal repayments during the first {moratoriumMonths} months while you set up your work.
            </p>
          </div>
        </div>

        {/* Mobile-Friendly Schedule (No Wide Table Overflow) */}
        <div className="mb-8 rounded-3xl border border-ink/10 bg-white p-5 sm:p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-ink">Payment preview</h3>
              <span className="text-[11px] text-ink/60">How the balance decreases over time</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSchedule(!showSchedule)}
              className="text-xs font-bold text-forest underline hover:text-ink py-1"
            >
              {showSchedule ? "Hide" : "Show list"}
            </button>
          </div>

          {showSchedule && (
            <div className="mt-4 space-y-2 border-t border-ink/10 pt-3">
              {calculation.schedule.slice(0, 8).map((row) => (
                <div
                  key={row.period}
                  className={`flex items-center justify-between rounded-xl p-2.5 text-xs ${
                    row.isMoratorium ? "bg-gold/10" : "bg-cream/60"
                  }`}
                >
                  <div>
                    <span className="font-bold text-ink block">{row.periodLabel}</span>
                    <span className="text-[10px] text-ink/50">
                      Remaining: ₹{Math.round(row.closingBalance).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-forest text-sm block">
                      ₹{Math.round(row.instalment).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-gold font-semibold">
                      Interest: ₹{Math.round(row.interestPaid).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
              {calculation.schedule.length > 8 && (
                <p className="text-center text-[11px] text-ink/50 pt-1">
                  Showing first 8 instalments of {calculation.schedule.length} total.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Large Primary Next Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push("/readiness")}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink min-h-[52px]"
          >
            <span>Next: Check What Papers You Need</span>
            <span>→</span>
          </button>
          <button
            type="button"
            onClick={() => router.push("/partners")}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-ink/20 bg-white px-6 py-3.5 text-sm font-bold text-ink hover:bg-sand min-h-[48px]"
          >
            <span>Where to Apply{profile.state ? ` in ${profile.state}` : ""}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
