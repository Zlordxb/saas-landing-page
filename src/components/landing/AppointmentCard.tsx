"use client";

import { Clock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import type { Service } from "@/data/services";
import type { Availability } from "@/lib/booking/types";
import { cn, formatDuration, formatPrice } from "@/lib/format";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; data: Availability };

const MAX_SLOTS = 6;

/** "Book 4:30 PM today", "Book 12:00 PM tomorrow", "Book 4:30 PM, Sat 14 Nov" */
function bookLabel(time: string, dayLabel: string) {
  if (dayLabel === "Today") return `Book ${time} today`;
  if (dayLabel === "Tomorrow") return `Book ${time} tomorrow`;
  return `Book ${time}, ${dayLabel}`;
}

/**
 * The glazed tile in the middle of the hero wall: the next free times for a check-up,
 * bookable in two taps. The chosen time is the biggest thing on the card,
 * because a time is what the patient is really picking.
 */
export function AppointmentCard({ service }: { service: Service }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/slots?service=${encodeURIComponent(service.slug)}&date=next`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as Availability;
      })
      .then((data) => {
        setState({ status: "ready", data });
        setSelected(data.slots[0]?.start ?? null);
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });
    return () => controller.abort();
  }, [service.slug]);

  const data = state.status === "ready" ? state.data : null;
  const slots = data?.slots.slice(0, MAX_SLOTS) ?? [];
  const chosen = slots.find((slot) => slot.start === selected) ?? null;

  return (
    <section
      aria-labelledby="next-free-times"
      className="rounded-xl bg-hero glaze p-6 text-on-hero shadow-lg ring-1 ring-white/10"
    >
      <div className="flex items-center justify-between gap-3 text-label font-medium text-on-hero-muted">
        <span id="next-free-times" className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2 animate-live rounded-full bg-gold-on-night text-gold-on-night"
          />
          Next free times
        </span>
        <span>{data?.dateLabel ?? " "}</span>
      </div>

      <h2 className="mt-3 font-display text-title font-medium">{service.name}</h2>
      <p className="mt-1 flex flex-wrap gap-4 text-label font-medium text-on-hero-muted">
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-4" strokeWidth={1.75} />
          {formatDuration(service.durationMinutes)}
        </span>
        <span className="tabular-nums">{formatPrice(service.priceEgp)}</span>
      </p>

      {/* The chosen time, large. It flips when another time is picked. */}
      <div className="relative mt-5 h-14 overflow-hidden" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.p
            key={chosen?.label ?? state.status}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[3.25rem] leading-none font-medium tabular-nums"
          >
            {chosen?.label ?? (state.status === "loading" ? "" : "—")}
          </motion.p>
        </AnimatePresence>
        {state.status === "loading" ? (
          <span className="absolute inset-y-1 left-0 w-44 animate-pulse rounded-md bg-on-hero/15" />
        ) : null}
      </div>

      <div className="my-5 grid grid-cols-3 gap-2" aria-live="polite">
        {state.status === "loading"
          ? Array.from({ length: MAX_SLOTS }, (_, index) => (
              <span key={index} className="h-11 animate-pulse rounded-full bg-on-hero/15" />
            ))
          : slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                aria-pressed={slot.start === selected}
                onClick={() => setSelected(slot.start)}
                className={cn(
                  "h-11 rounded-full border text-label font-medium tabular-nums transition-colors duration-150",
                  slot.start === selected
                    ? "border-on-hero bg-on-hero text-hero"
                    : "border-hero-line text-on-hero hover:border-on-hero",
                )}
              >
                {slot.label}
              </button>
            ))}
        {state.status === "error" || (data && slots.length === 0) ? (
          <p className="col-span-3 text-small text-on-hero-muted">
            {state.status === "error"
              ? "Free times couldn’t be loaded right now."
              : "No free times in the next 30 days."}
          </p>
        ) : null}
      </div>

      {chosen && data?.date && data.dateLabel ? (
        <Link
          href={`/book?service=${service.slug}&date=${data.date}&time=${encodeURIComponent(chosen.start)}`}
          className={buttonStyles({ variant: "inverse", className: "w-full" })}
        >
          {bookLabel(chosen.label, data.dateLabel)}
        </Link>
      ) : (
        <Link
          href={`/book?service=${service.slug}`}
          className={buttonStyles({ variant: "inverse", className: "w-full" })}
        >
          See all free times
        </Link>
      )}
      <p className="mt-3 text-center text-caption text-on-hero-muted">
        {data && !data.connected
          ? "Preview times. Connect Supabase for live availability."
          : "No payment now. The clinic calls to confirm."}
      </p>
    </section>
  );
}
