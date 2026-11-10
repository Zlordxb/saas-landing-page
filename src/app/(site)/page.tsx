import { CalmCare } from "@/components/landing/CalmCare";
import { Doctor } from "@/components/landing/Doctor";
import { Evenings } from "@/components/landing/Evenings";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PriceList } from "@/components/landing/PriceList";
import { ShadeGuide } from "@/components/landing/ShadeGuide";
import { StudioGallery } from "@/components/landing/StudioGallery";
import { Testimonials } from "@/components/landing/Testimonials";
import { VisitUs } from "@/components/landing/VisitUs";
import { getServices } from "@/lib/data/services";

// Build this page once, then refresh it in the background at most every 5 minutes (ISR).
// Free times (hero card, evening times) load live in the browser, so they're always current.
export const revalidate = 300;

const FEATURED = "check-up-and-consultation";

export default async function HomePage() {
  const services = await getServices();
  const featured = services.find((service) => service.slug === FEATURED) ?? services[0];
  const popular = services.filter((service) => service.isPopular).slice(0, 4);
  const whitening = services.find((service) => service.slug === "teeth-whitening");

  return (
    <>
      <Hero featuredService={featured} />
      <PriceList services={popular} total={services.length} />
      <CalmCare />
      <ShadeGuide service={whitening} />
      <Evenings serviceSlug={featured?.slug ?? FEATURED} />
      <HowItWorks />
      <Doctor />
      <StudioGallery />
      <Testimonials />
      <Faq />
      <VisitUs />
    </>
  );
}
