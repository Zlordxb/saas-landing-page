import { Navigation, Phone } from "lucide-react";
import { ButtonLink, buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { clinic } from "@/config/clinic";
import { visit } from "@/content/home";
import { normalizePhone } from "@/lib/format";
import { NileMap } from "./NileMap";
import { OpeningHours } from "./OpeningHours";
import { SectionHeading } from "./SectionHeading";

const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.area)}`;

export function VisitUs() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="bg-surface py-16 md:py-24">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <NileMap className="mx-auto w-full max-w-lg lg:mx-0" />

        <div className="flex flex-col gap-8">
          <SectionHeading id="visit-title" title={visit.title} lead={visit.lead} />
          <OpeningHours />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/book" size="lg">
              Book an appointment
            </ButtonLink>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              <Navigation aria-hidden="true" className="size-5" strokeWidth={1.75} />
              Get directions
            </a>
            <a href={`tel:${normalizePhone(clinic.phone)}`} className={buttonStyles({ variant: "ghost", size: "lg" })}>
              <Phone aria-hidden="true" className="size-5" strokeWidth={1.75} />
              {clinic.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
