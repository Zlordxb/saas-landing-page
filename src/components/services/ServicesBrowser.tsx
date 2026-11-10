"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { groupIdFor, treatmentGroups } from "@/content/treatments";
import type { Service } from "@/data/services";
import { cn } from "@/lib/format";
import { ServiceCard } from "./ServiceCard";

const SORTS = [
  { id: "recommended", label: "Recommended", compare: (a: Service, b: Service) => a.sortOrder - b.sortOrder },
  { id: "price-low", label: "Price: low to high", compare: (a: Service, b: Service) => a.priceEgp - b.priceEgp },
  { id: "price-high", label: "Price: high to low", compare: (a: Service, b: Service) => b.priceEgp - a.priceEgp },
  {
    id: "shortest",
    label: "Shortest visit first",
    compare: (a: Service, b: Service) => a.durationMinutes - b.durationMinutes || a.sortOrder - b.sortOrder,
  },
] as const;

type SortId = (typeof SORTS)[number]["id"];

/** Filter chips by type of treatment, a "Sort" dropdown, and the cards that answer to both. */
export function ServicesBrowser({ services }: { services: Service[] }) {
  const [group, setGroup] = useState("all");
  const [sortId, setSortId] = useState<SortId>("recommended");
  const sort = SORTS.find((option) => option.id === sortId) ?? SORTS[0];

  const filters = [
    { id: "all", title: "All treatments", count: services.length },
    ...treatmentGroups.map((item) => ({
      id: item.id,
      title: item.title,
      count: services.filter((service) => groupIdFor(service.slug) === item.id).length,
    })),
  ].filter((filter) => filter.count > 0);

  const shown = services
    .filter((service) => group === "all" || groupIdFor(service.slug) === group)
    .sort(sort.compare);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Show treatments by type" className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = filter.id === group;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setGroup(filter.id)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-label font-semibold transition-colors",
                  active
                    ? "border-primary bg-primary text-on-primary"
                    : "border-line-strong bg-surface text-ink hover:border-primary hover:text-link",
                )}
              >
                {filter.title}
                <span className={cn("tabular-nums", active ? "text-on-primary" : "text-ink-muted")}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        <Dropdown
          kind="choice"
          align="end"
          label={
            <>
              <ArrowUpDown aria-hidden="true" className="size-4" strokeWidth={2} />
              <span>
                <span className="text-ink-muted">Sort: </span>
                {sort.label}
              </span>
              <ChevronDown aria-hidden="true" className="size-4" strokeWidth={2} />
            </>
          }
          buttonClassName="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-label font-semibold transition-colors hover:border-primary aria-expanded:border-primary"
          items={SORTS.map((option) => ({
            label: option.label,
            checked: option.id === sortId,
            onSelect: () => setSortId(option.id),
          }))}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} treatments shown, sorted by {sort.label.toLowerCase()}.
      </p>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((service) => (
            <motion.li
              key={service.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ServiceCard service={service} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
