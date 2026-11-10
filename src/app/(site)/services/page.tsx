import type { Metadata } from "next";
import { FinalCta } from "@/components/landing/FinalCta";
import { ServicesBrowser } from "@/components/services/ServicesBrowser";
import { OpenStatus } from "@/components/site/OpenStatus";
import { Container } from "@/components/ui/Container";
import { getServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Treatments and prices",
  description:
    "Every treatment at Nefer Dental Studio with its price and how long it takes. Book any of them online.",
};

export const revalidate = 300;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="pt-12 pb-10 md:pt-16">
        <Container className="flex flex-col gap-4">
          <h1 className="max-w-3xl font-display text-h1-sm md:text-h1">Treatments and prices</h1>
          <p className="max-w-3xl text-lead text-ink-muted">
            Every treatment shows how long it takes and what it costs. You pay at the clinic after
            your visit, never online.
          </p>
          <OpenStatus className="text-label font-medium text-ink-muted" />
        </Container>
      </section>

      <section aria-label="All treatments" className="pb-16 md:pb-24">
        <Container className="flex flex-col gap-8">
          <ServicesBrowser services={services} />
          <p className="max-w-prose text-small text-ink-muted">
            Not sure what you need? Book a check-up and consultation first: you get the plan and
            the prices before any treatment. Prices on this demo are examples.
          </p>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
