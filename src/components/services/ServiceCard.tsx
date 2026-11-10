import { Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { photoForService } from "@/content/photos";
import type { Service } from "@/data/services";
import { formatDuration, formatPrice } from "@/lib/format";

/** One treatment with what a patient needs before booking: what, how long, how much. */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article
      id={service.slug}
      className="group flex h-full min-w-0 flex-col gap-4 rounded-xl border border-line bg-surface p-2 transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden tile-dome">
        <Photo
          photo={photoForService(service.slug)}
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 46vw, 100vw"
          className="transition-transform duration-500 ease-glaze group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-caption font-semibold shadow-sm">
          <Clock aria-hidden="true" className="size-3.5" strokeWidth={2} />
          {formatDuration(service.durationMinutes)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
        <h3 className="font-display text-h3 font-medium">{service.name}</h3>
        <p className="text-small text-ink-muted">{service.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="leading-tight">
            <span className="font-display text-title font-medium tabular-nums">
              {formatPrice(service.priceEgp)}
            </span>
            <span className="block text-caption text-ink-muted">{service.priceUnit}</span>
          </p>
          <ButtonLink
            href={`/book?service=${service.slug}`}
            variant="secondary"
            size="sm"
            aria-label={`Book ${service.name}`}
          >
            Book
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
