import { MapPin, Star } from "lucide-react";
import { OpenStatus } from "@/components/site/OpenStatus";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { clinic } from "@/config/clinic";
import { hero } from "@/content/home";
import type { Service } from "@/data/services";
import { HeroWall } from "./HeroWall";

export function Hero({ featuredService }: { featuredService?: Service }) {
  return (
    <section className="pt-8 pb-16 md:pt-12 lg:pb-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-6">
          <p className="flex flex-wrap gap-x-5 gap-y-2 text-label font-medium text-ink-muted">
            <OpenStatus />
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-4" strokeWidth={1.75} />
              {clinic.area}
            </span>
          </p>

          <h1 className="font-display text-display-sm md:text-display lg:text-[3.5rem] lg:leading-[3.875rem] xl:text-[3.75rem] xl:leading-[4.125rem]">
            {hero.title}
          </h1>
          <p className="max-w-[32em] text-lead text-ink-muted">{hero.lead}</p>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/book" size="lg">
              Book an appointment
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="secondary">
              See treatments and prices
            </ButtonLink>
          </div>

          <p className="flex items-center gap-2.5 text-small text-ink-muted">
            <span className="inline-flex gap-0.5 text-accent" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} className="size-4 fill-current" strokeWidth={0} />
              ))}
            </span>
            <span>
              <strong className="font-semibold text-ink">{hero.rating.score}</strong> from{" "}
              {hero.rating.count} patient reviews
            </span>
          </p>
        </div>

        <HeroWall service={featuredService} />
      </Container>
    </section>
  );
}
