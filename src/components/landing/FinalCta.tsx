import { OpenStatus } from "@/components/site/OpenStatus";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { photos } from "@/content/photos";

/** A glazed tile to close a page: one action, and the clinic's live status. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="pb-16 md:pb-24">
      <Container>
        <div className="grid overflow-hidden rounded-xl bg-hero glaze text-on-hero md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="flex flex-col items-start gap-5 p-8 md:p-12">
            <h2 id="cta-title" className="font-display text-h1-sm md:text-h1">
              Ready for a calmer visit?
            </h2>
            <p className="text-lead text-on-hero-muted">
              Free times today, and every evening until 10 PM.
            </p>
            <ButtonLink href="/book" size="lg" variant="inverse">
              Book an appointment
            </ButtonLink>
            <OpenStatus tone="night" className="text-label font-medium text-on-hero-muted" />
          </div>
          <div className="relative hidden min-h-[20rem] md:block">
            <Photo photo={photos.nile} sizes="40vw" />
          </div>
        </div>
      </Container>
    </section>
  );
}
