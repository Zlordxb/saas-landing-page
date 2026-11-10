"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { shadeGuide } from "@/content/home";
import { photos } from "@/content/photos";
import type { Service } from "@/data/services";
import { cn, formatPrice } from "@/lib/format";

/** Darkest to lightest, like the tabs of a VITA classical shade guide. */
const SHADES = [
  { code: "A4", color: "var(--enamel-a4)" },
  { code: "C3", color: "var(--enamel-c3)" },
  { code: "B4", color: "var(--enamel-b4)" },
  { code: "A3.5", color: "var(--enamel-a35)" },
  { code: "A3", color: "var(--enamel-a3)" },
  { code: "A2", color: "var(--enamel-a2)" },
  { code: "A1", color: "var(--enamel-a1)" },
  { code: "B1", color: "var(--enamel-b1)" },
];
const LAST = SHADES.length - 1;

/** In-clinic whitening usually moves teeth two to four tabs lighter on this guide. */
function expectedRange(current: number) {
  return { from: Math.min(current + 2, LAST), to: Math.min(current + 4, LAST) };
}

const TOOTH =
  "M8 6C14 2 34 2 40 6C43 18 43 34 39 48C36 58 30 62 24 62C18 62 12 58 9 48C5 34 5 18 8 6Z";

/**
 * The tool dentists hold up against your teeth, as an interactive guide.
 * It's a radio group: arrow keys move between shades, like any set of radio buttons.
 */
export function ShadeGuide({ service }: { service?: Service }) {
  const [current, setCurrent] = useState(4); // A3, a common natural shade
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // Used inside url(#…) references, so keep only characters that are always safe there.
  const ids = `shade${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { from, to } = expectedRange(current);
  const alreadyLight = current >= LAST - 1;

  function select(index: number, focus = false) {
    const next = Math.max(0, Math.min(LAST, index));
    setCurrent(next);
    if (focus) tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowDown: current + 1,
      ArrowLeft: current - 1,
      ArrowUp: current - 1,
      Home: 0,
      End: LAST,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  }

  const result = alreadyLight
    ? `${SHADES[current].code} is already one of the lightest natural shades. A clean and polish may be all you need.`
    : `From ${SHADES[current].code}, in-clinic whitening usually reaches ${SHADES[from].code}${
        from === to ? "" : ` to ${SHADES[to].code}`
      }.`;

  return (
    <section id="whitening" aria-labelledby="shade-title" className="py-16 md:py-24">
      {/* Shared gradients: the darker gum end of each tab and its translucent biting edge. */}
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <linearGradient id={`${ids}-depth`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a5a2e" stopOpacity="0.28" />
            <stop offset="0.45" stopColor="#7a5a2e" stopOpacity="0" />
            <stop offset="0.82" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#dbe9f0" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id={`${ids}-shine`} cx="0.32" cy="0.28" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 id="shade-title" className="font-display text-h2-sm md:text-h2">
              {shadeGuide.title}
            </h2>
            <p className="text-lead text-ink-muted">{shadeGuide.lead}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p id={`${ids}-label`} className="text-label font-semibold">
              Your shade now
            </p>
            <div
              role="radiogroup"
              aria-labelledby={`${ids}-label`}
              onKeyDown={onKeyDown}
              className="relative grid grid-cols-8 gap-1.5 pb-5 sm:gap-3"
            >
              {SHADES.map((shade, index) => {
                const selected = index === current;
                return (
                  <button
                    key={shade.code}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`Shade ${shade.code}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(index)}
                    className="group flex flex-col items-center gap-2 rounded-md pt-2 pb-1"
                  >
                    <motion.svg
                      viewBox="0 0 48 64"
                      aria-hidden="true"
                      animate={{ y: selected ? -6 : 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      className={cn(
                        "h-auto w-full max-w-12 drop-shadow-sm transition-[filter] group-hover:drop-shadow-md",
                      )}
                    >
                      <path d={TOOTH} fill={shade.color} />
                      <path d={TOOTH} fill={`url(#${ids}-depth)`} />
                      <path d={TOOTH} fill={`url(#${ids}-shine)`} />
                      <path
                        d={TOOTH}
                        fill="none"
                        strokeWidth={selected ? 2.5 : 1}
                        className={selected ? "stroke-primary" : "stroke-line-strong"}
                      />
                    </motion.svg>
                    <span
                      className={cn(
                        "text-caption tabular-nums sm:text-label",
                        selected ? "font-bold text-ink" : "text-ink-muted",
                      )}
                    >
                      {shade.code}
                    </span>
                  </button>
                );
              })}

              {/* The bar under the tabs marks where whitening usually lands. */}
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 h-1.5 rounded-full bg-primary"
                initial={false}
                animate={{
                  left: `${(from / SHADES.length) * 100}%`,
                  width: `${((to - from + 1) / SHADES.length) * 100}%`,
                  opacity: alreadyLight ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              />
            </div>
          </div>

          <p aria-live="polite" className="max-w-xl text-lead">
            {result}
          </p>

          <div className="flex flex-col gap-3">
            {service ? (
              <ButtonLink href={`/book?service=${service.slug}`} size="lg" className="self-start">
                Book whitening for {formatPrice(service.priceEgp)}
              </ButtonLink>
            ) : null}
            <p className="text-small text-ink-muted">{shadeGuide.note}</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden tile-dome-lg">
            <Photo photo={photos.laugh} sizes="(min-width: 1024px) 28rem, 100vw" />
          </div>
          <p className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-surface/95 py-2 pr-4 pl-2 text-label font-semibold shadow-md backdrop-blur">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-6 rounded-full ring-1 ring-line-strong"
                style={{ background: SHADES[current].color }}
              />
              {SHADES[current].code}
            </span>
            <ArrowRight aria-hidden="true" className="size-4 text-ink-muted" strokeWidth={2} />
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-6 rounded-full ring-1 ring-line-strong"
                style={{ background: SHADES[to].color }}
              />
              {alreadyLight ? SHADES[current].code : SHADES[to].code}
            </span>
            <span className="sr-only">: your shade now and the usual result.</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
