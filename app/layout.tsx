import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ClientProviders } from "../components/ClientProviders";

export const metadata: Metadata = {
  title: "Scheme Sahayak | From eligibility to action",
  description: "A financial-assistance journey prototype for NSFDC beneficiaries.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-cream text-ink font-sans antialiased">
        <ClientProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
