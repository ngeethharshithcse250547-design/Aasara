import Link from "next/link";

const descriptions: Record<string, string> = {
  Assessment: "Tell us about your financial need. A guided assessment will be added in the next build stage.",
  Results: "Potential scheme matches and their explanations will appear here after the rule engine is connected.",
  Calculator: "An indicative repayment calculator will be introduced only using verified scheme terms.",
  Readiness: "Your document and application-preparation checklist will be available here.",
  Partners: "Verified channel-partner routing will appear here. No live availability is shown in this prototype.",
};

export function PlaceholderPage({ title }: { title: keyof typeof descriptions }) {
  return <section className="min-h-[60vh] bg-cream px-5 py-20"><div className="mx-auto max-w-3xl rounded-3xl border border-ink/10 bg-white p-8 shadow-soft sm:p-12"><p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-gold">Stage 1 foundation</p><h1 className="text-4xl font-extrabold tracking-tight text-ink">{title}</h1><p className="mt-5 max-w-xl text-lg leading-8 text-ink/70">{descriptions[title]}</p><div className="mt-10 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm leading-6 text-ink/75">This route is intentionally a placeholder. It does not calculate eligibility, display scheme data, or make partner-status claims.</div><Link href="/" className="mt-8 inline-flex rounded-lg bg-forest px-5 py-3 text-sm font-bold text-white hover:bg-ink">Back to home</Link></div></section>;
}
