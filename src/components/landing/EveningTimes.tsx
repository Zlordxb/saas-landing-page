"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Availability, SlotOption } from "@/lib/booking/types";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; date: string | null; dateLabel: string | null; slots: SlotOption[] };

const MAX = 8;

/** The next free evening times (5 PM onwards) for a service, live from /api/slots. */
export function EveningTimes({ serviceSlug }: { serviceSlug: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/slots?service=${encodeURIComponent(serviceSlug)}&date=next`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as Availability;
      })
      .then((data) =>
        setState({
          status: "ready",
          date: data.date,
          dateLabel: data.dateLabel,
          slots: data.slots.filter((slot) => slot.period === "evening"),
        }),
      )
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });
    return () => controller.abort();
  }, [serviceSlug]);

  if (state.status === "error") {
    return (
      <Link href={`/book?service=${serviceSlug}`} className="font-semibold text-gold-on-night underline underline-offset-4">
        See all free times
      </Link>
    );
  }

  const slots = state.status === "ready" ? state.slots.slice(0, MAX) : [];
  const when =
    state.status !== "ready" || !state.dateLabel
      ? ""
      : state.dateLabel === "Today"
        ? "tonight"
        : state.dateLabel === "Tomorrow"
          ? "tomorrow"
          : state.dateLabel;
  const heading = when ? `Free evening times, ${when}` : "Free evening times";

  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      <p className="text-label font-semibold text-on-night">{heading}</p>
      <ul className="flex flex-wrap gap-2">
        {state.status === "loading"
          ? Array.from({ length: 6 }, (_, index) => (
              <li key={index} className="h-11 w-24 animate-pulse rounded-full bg-on-night/10" />
            ))
          : slots.map((slot) => (
              <li key={slot.start}>
                <Link
                  href={`/book?service=${serviceSlug}&date=${state.status === "ready" ? state.date : ""}&time=${encodeURIComponent(slot.start)}`}
                  className="inline-flex h-11 items-center rounded-full border border-gold-on-night/40 px-5 font-display text-title font-medium text-gold-on-night tabular-nums transition-colors hover:border-gold-on-night hover:bg-night-raised"
                >
                  {slot.label}
                </Link>
              </li>
            ))}
      </ul>
      {state.status === "ready" && slots.length === 0 ? (
        <p className="text-on-night-muted">The next evenings are full. Daytime times are still free.</p>
      ) : null}
      <Link
        href={`/book?service=${serviceSlug}`}
        className="self-start rounded-sm font-semibold text-on-night underline decoration-on-night-muted underline-offset-4 hover:decoration-current"
      >
        See every free time
      </Link>
    </div>
  );
}
