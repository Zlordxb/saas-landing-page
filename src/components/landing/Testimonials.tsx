"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { hero, testimonials } from "@/content/home";

// The new review slides in from the side you're moving towards; the old one leaves the other way.
// AnimatePresence hands the latest direction to the leaving review through `custom`.
const slide = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -40 }),
};

/**
 * One review at a time, large, with buttons to move through them.
 * Nothing moves on its own: the reader decides when to see the next one.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = testimonials.length;
  const review = testimonials[index];

  function go(delta: number) {
    setDirection(delta);
    setIndex((value) => (value + delta + count) % count);
  }

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-surface py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div className="flex flex-col gap-5">
          <h2 id="reviews-title" className="font-display text-h2-sm md:text-h2">
            What patients say
          </h2>
          <p className="flex items-center gap-4">
            <span className="font-display text-[3.5rem] leading-none font-medium tabular-nums">
              {hero.rating.score}
            </span>
            <span className="flex flex-col gap-1">
              <span className="inline-flex gap-0.5 text-accent" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, star) => (
                  <Star key={star} aria-hidden="true" className="size-5 fill-current" strokeWidth={0} />
                ))}
              </span>
              <span className="text-small text-ink-muted">from {hero.rating.count} patient reviews</span>
            </span>
          </p>
          <p className="text-caption text-ink-muted">Reviews on this demo are fictional.</p>
        </div>

        <figure className="flex min-w-0 flex-col gap-8">
          <div className="relative min-h-[11rem] overflow-hidden md:min-h-[9.5rem]" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              <motion.blockquote
                key={index}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-h3 leading-[2.25rem] md:text-h2-sm md:leading-[2.5rem]"
              >
                “{review.quote}”
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <figcaption className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="glaze grid size-12 place-items-center rounded-md bg-primary font-display text-title font-medium text-on-primary"
              >
                {review.name.charAt(0)}
              </span>
              <span>
                <span className="block font-semibold">
                  {review.name}, {review.area}
                </span>
                <span className="block text-small text-ink-muted">{review.treatment}</span>
              </span>
            </span>

            <span className="flex items-center gap-2">
              <span className="mr-2 text-small text-ink-muted tabular-nums">
                {index + 1} of {count}
              </span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-primary hover:text-link"
              >
                <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-primary hover:text-link"
              >
                <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </button>
            </span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
