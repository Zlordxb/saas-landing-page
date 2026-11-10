import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { photoForService } from "@/content/photos";
import { groupServices } from "@/content/treatments";
import type { Service } from "@/data/services";
import { formatDuration, formatPrice } from "@/lib/format";
import { OpenStatus } from "./OpenStatus";

const FEATURED_SLUG = "check-up-and-consultation";

/** The content of the "Treatments" mega menu: every treatment with its time and price. */
export function TreatmentsPanel({
  services,
  onNavigate,
}: {
  services: Service[];
  onNavigate: () => void;
}) {
  const groups = groupServices(services);
  const featured = services.find((service) => service.slug === FEATURED_SLUG) ?? services[0];

  return (
    <Container className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="grid gap-8 sm:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="min-w-0">
            <h3 className="font-display text-title font-medium">{group.title}</h3>
            <p className="text-small text-ink-muted">{group.text}</p>
            <ul className="mt-4 flex flex-col gap-1">
              {group.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/book?service=${service.slug}`}
                    onClick={onNavigate}
                    className="group -mx-3 flex items-baseline justify-between gap-4 rounded-md px-3 py-2 transition-colors hover:bg-surface-muted"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium group-hover:text-link">
                        {service.name}
                      </span>
                      <span className="block text-small text-ink-muted">
                        {formatDuration(service.durationMinutes)}
                      </span>
                    </span>
                    <span className="shrink-0 text-small font-semibold tabular-nums">
                      {formatPrice(service.priceEgp)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {featured ? (
        <div className="hidden flex-col gap-4 rounded-xl bg-primary-soft p-4 lg:flex">
          <div className="relative aspect-[16/10] overflow-hidden tile-dome">
            <Photo photo={photoForService(featured.slug)} sizes="18rem" />
          </div>
          <div className="flex flex-col gap-1 px-1">
            <h3 className="font-display text-title font-medium text-on-primary-soft">
              New here? Start with a check-up
            </h3>
            <p className="text-small text-on-primary-soft">
              A full exam and a written plan with prices, before any treatment.
            </p>
          </div>
          <Link
            href={`/book?service=${featured.slug}`}
            onClick={onNavigate}
            className={buttonStyles({ size: "sm", className: "w-full" })}
          >
            Book a check-up for {formatPrice(featured.priceEgp)}
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-small text-ink-muted lg:col-span-2">
        <OpenStatus />
        <Link
          href="/services"
          onClick={onNavigate}
          className="rounded-sm font-semibold text-link hover:underline"
        >
          Compare all {services.length} treatments and prices
        </Link>
      </div>
    </Container>
  );
}
