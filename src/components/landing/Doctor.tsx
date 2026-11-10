import { CircleCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { doctor } from "@/content/home";
import { photos } from "@/content/photos";
import { SectionHeading } from "./SectionHeading";

export function Doctor() {
  return (
    <section id="doctor" aria-labelledby="doctor-title" className="bg-surface py-16 md:py-24">
      <Container className="grid items-center gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative mx-auto w-full max-w-md pb-8 lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden tile-dome-lg">
            <Photo photo={photos.doctor} sizes="(min-width: 1024px) 28rem, 100vw" />
          </div>
          {/* A small glazed tile set into the photo's corner. */}
          <p className="glaze absolute bottom-0 left-6 flex flex-col rounded-lg bg-primary px-5 py-4 text-on-primary shadow-lg">
            <span className="font-display text-h2 leading-none font-medium tabular-nums">
              {doctor.years}
            </span>
            <span className="mt-1 text-label">years in practice</span>
          </p>
        </div>

        <div className="flex max-w-xl flex-col gap-6">
          <SectionHeading id="doctor-title" title={`Meet ${doctor.name}`} lead={doctor.intro} />
          <blockquote className="border-l-2 border-primary pl-5 font-display text-h3 leading-[2.125rem]">
            “{doctor.quote}”
          </blockquote>
          <ul className="flex flex-col gap-2.5">
            {doctor.credentials.map((credential) => (
              <li key={credential} className="flex items-center gap-2.5">
                <CircleCheck aria-hidden="true" className="size-5 shrink-0 text-primary" strokeWidth={1.75} />
                {credential}
              </li>
            ))}
          </ul>
          <ButtonLink href="/book" className="self-start">
            Book with Dr. Salma
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
