import { OpenStatus } from "@/components/site/OpenStatus";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { evenings } from "@/content/home";
import { photos } from "@/content/photos";
import { EveningTimes } from "./EveningTimes";

/**
 * The page's one dark band: the Nile after sunset, because evening hours are the
 * clinic's real difference. The free times glow like the city lights behind them.
 */
export function Evenings({ serviceSlug }: { serviceSlug: string }) {
  return (
    <section
      aria-labelledby="evenings-title"
      className="relative isolate overflow-hidden bg-night text-on-night"
    >
      <div className="absolute inset-0 -z-10">
        <Photo photo={photos.nileNight} sizes="100vw" decorative className="object-[70%_50%]" />
        <div className="absolute inset-0 bg-night/80 md:bg-transparent md:bg-[linear-gradient(90deg,var(--night)_32%,color-mix(in_oklab,var(--night)_55%,transparent)_62%,color-mix(in_oklab,var(--night)_15%,transparent))]" />
      </div>

      <Container className="py-20 md:py-28">
        <div className="flex max-w-xl flex-col gap-6">
          <OpenStatus tone="night" className="text-label font-medium text-on-night-muted" />
          <h2 id="evenings-title" className="font-display text-h1-sm md:text-h1">
            {evenings.title}
          </h2>
          <p className="text-lead text-on-night-muted">{evenings.lead}</p>
          <EveningTimes serviceSlug={serviceSlug} />
        </div>
      </Container>
    </section>
  );
}
