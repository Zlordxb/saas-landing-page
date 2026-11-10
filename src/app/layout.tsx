import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import { clinic } from "@/config/clinic";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// next/font downloads the fonts at build time and serves them from our own domain:
// no layout shift, no request to Google from the visitor's browser.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${clinic.name}: book a dental appointment in Cairo`,
    template: `%s | ${clinic.name}`,
  },
  description:
    "Check-ups, cleanings, fillings and whitening in Zamalek, Cairo. See prices and free times, and book in under a minute. A BookFlow demo.",
  applicationName: "BookFlow",
  openGraph: {
    type: "website",
    siteName: clinic.name,
    title: `${clinic.name}: gentle dentistry, booked in under a minute`,
    description: "See prices and free times, and book a dental appointment in under a minute.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f6f4",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
      {/* Some browser extensions (ColorZilla, Grammarly) add attributes to <body> before
          React loads; this stops React warning about attributes it didn't write. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
