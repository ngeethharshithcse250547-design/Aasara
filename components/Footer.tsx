import Link from "next/link";

export function Footer() {
  return <footer className="border-t border-ink/10 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© 2026 Scheme Sahayak</p><div className="flex gap-5"><Link href="/assessment" className="hover:text-forest">Start assessment</Link><Link href="/partners" className="hover:text-forest">Official routes</Link></div><p className="text-xs">Information is indicative. Final decisions rest with authorised agencies.</p></div></footer>;
}
