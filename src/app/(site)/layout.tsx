import type { ReactNode } from "react";
import { DemoNotice } from "@/components/site/DemoNotice";
import { Footer } from "@/components/site/Footer";
import { MobileBookBar } from "@/components/site/MobileBookBar";
import { Navbar } from "@/components/site/Navbar";
import { getServices } from "@/lib/data/services";

/**
 * Layout for the public pages. The "(site)" folder is a route group: the brackets keep
 * it out of the URL, so app/(site)/services/page.tsx is just /services.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  // The Treatments menu lists every service with its price.
  const services = await getServices();

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-surface px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <DemoNotice />
      <Navbar services={services} />
      <main id="main">{children}</main>
      <Footer />
      <MobileBookBar />
    </>
  );
}
