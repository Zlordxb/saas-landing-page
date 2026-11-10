"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { priceList } from "@/content/home";
import { photoForService } from "@/content/photos";
import type { Service } from "@/data/services";
import { cn, formatDuration, formatPrice } from "@/lib/format";
import { SectionHeading } from "./SectionHeading";

/**
 * A price list set like a menu: name, dotted leader, price. Pointing at (or tabbing to)
 * a treatment swaps the large photo beside the list, so the list stays easy to scan.
 */
export function PriceList({ services, total }: { services: Service[]; total: number }) {
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug ?? "");
  const active = services.find((service) => service.slug === activeSlug) ?? services[0];
  if (!active) return null;

  return (
    <section id="treatments" aria-labelledby="treatments-title" className="py-16 md:py-24">
      <Container className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="sticky top-28 hidden lg:block">
          <div className="relative aspect-[4/5] overflow-hidden tile-dome-lg bg-surface-muted">
            <AnimatePresence initial={false}>
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Photo
                  photo={photoForService(active.slug)}
                  sizes="(min-width: 1280px) 30rem, 40vw"
                />
              </motion.div>
            </AnimatePresence>
            <p className="absolute bottom-4 left-4 rounded-full bg-surface/90 px-4 py-2 text-label font-semibold shadow-sm backdrop-blur">
              {active.name}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-8">
          <SectionHeading id="treatments-title" title={priceList.title} lead={priceList.lead} />

          <ul className="border-t border-line">
            {services.map((service) => (
              <li
                key={service.slug}
                onPointerEnter={() => setActiveSlug(service.slug)}
                onFocus={() => setActiveSlug(service.slug)}
                className="group relative flex items-center gap-4 border-b border-line py-5 sm:gap-5"
              >
                <span className="relative size-16 shrink-0 overflow-hidden tile-dome lg:hidden">
                  <Photo photo={photoForService(service.slug)} sizes="4rem" decorative />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-baseline gap-3">
                    {/* The link stretches over the whole row (after:inset-0): one tab stop per treatment. */}
                    <Link
                      href={`/book?service=${service.slug}`}
                      className={cn(
                        "rounded-sm font-display text-title font-medium transition-colors group-hover:text-link after:absolute after:inset-0",
                        service.slug === active.slug && "lg:text-link",
                      )}
                    >
                      {service.name}
                    </Link>
                    <span
                      aria-hidden="true"
                      className="hidden min-w-6 flex-1 -translate-y-1.5 border-b-2 border-dotted border-line-strong sm:block"
                    />
                    <span className="ml-auto shrink-0 font-display text-title font-medium tabular-nums">
                      {formatPrice(service.priceEgp)}
                    </span>
                  </span>
                  <span className="flex flex-col gap-x-6 text-small text-ink-muted sm:flex-row sm:justify-between">
                    <span className="line-clamp-2 sm:line-clamp-1">{service.description}</span>
                    <span className="shrink-0">
                      {formatDuration(service.durationMinutes)}, {service.priceUnit}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/services"
            className="self-start rounded-sm font-semibold text-link underline decoration-line-strong underline-offset-4 hover:decoration-current"
          >
            See all {total} treatments and prices
          </Link>
        </div>
      </Container>
    </section>
  );
}
