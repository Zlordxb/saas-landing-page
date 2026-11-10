"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { studio } from "@/content/home";
import { photos, type Photo as PhotoData } from "@/content/photos";
import { cn } from "@/lib/format";
import { SectionHeading } from "./SectionHeading";

const gallery: { photo: PhotoData; className: string; sizes: string }[] = [
  {
    photo: photos.room,
    className: "col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto tile-dome-lg",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  {
    photo: photos.waiting,
    className: "aspect-square md:aspect-auto rounded-xl",
    sizes: "(min-width: 768px) 25vw, 50vw",
  },
  {
    photo: photos.consult,
    className: "aspect-square md:row-span-2 md:aspect-auto rounded-xl",
    sizes: "(min-width: 768px) 25vw, 50vw",
  },
  {
    photo: photos.loupes,
    className: "col-span-2 aspect-[16/10] md:col-span-1 md:aspect-auto rounded-xl",
    sizes: "(min-width: 768px) 25vw, 100vw",
  },
];

/**
 * A bento wall of studio photos. Each opens in a lightbox built on <dialog>:
 * the browser handles the focus trap, the dimmed page and the Escape key.
 */
export function StudioGallery() {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = gallery.length;
  const current = index === null ? null : gallery[index];

  // Open or close the native dialog to match the state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const step = (delta: number) =>
    setIndex((value) => (value === null ? value : (value + delta + count) % count));

  function onDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  return (
    <section id="studio" aria-labelledby="studio-title" className="py-16 md:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading id="studio-title" title={studio.title} lead={studio.lead} />

        <ul className="grid grid-cols-2 gap-3 md:h-[34rem] md:grid-cols-4 md:grid-rows-2">
          {gallery.map((item, itemIndex) => (
            <li key={item.photo.id} className={cn("relative overflow-hidden", item.className)}>
              <button
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-label={`Open photo: ${item.photo.alt}`}
                className="group absolute inset-0 size-full cursor-zoom-in"
              >
                <Photo
                  photo={item.photo}
                  sizes={item.sizes}
                  className="transition-transform duration-500 ease-glaze group-hover:scale-[1.04]"
                />
                <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-surface/90 text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand aria-hidden="true" className="size-4" strokeWidth={2} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Container>

      <dialog
        ref={dialogRef}
        aria-label="Studio photos"
        onClose={() => setIndex(null)}
        onKeyDown={onDialogKeyDown}
        onClick={(event) => {
          // A click on the dimmed area (the dialog itself, not its content) closes it.
          if (event.target === event.currentTarget) setIndex(null);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 text-on-night backdrop:bg-night/85 backdrop:backdrop-blur-sm"
      >
        {current ? (
          <div className="flex w-[min(92vw,68rem)] flex-col gap-4 p-2">
            <div className="relative aspect-[3/2] max-h-[78svh] w-full overflow-hidden rounded-xl bg-night">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={current.photo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Photo photo={current.photo} sizes="92vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="min-w-0">
                <span className="block font-medium">{current.photo.alt}</span>
                <span className="block text-small text-on-night-muted">
                  Photo by {current.photo.credit} on Unsplash
                </span>
              </p>
              <div className="flex items-center gap-2">
                <span className="mr-2 text-small text-on-night-muted tabular-nums">
                  {(index ?? 0) + 1} of {count}
                </span>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="grid size-11 place-items-center rounded-full border border-on-night/30 hover:bg-night-raised"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="grid size-11 place-items-center rounded-full border border-on-night/30 hover:bg-night-raised"
                >
                  <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex(null)}
                  aria-label="Close"
                  className="ml-2 grid size-11 place-items-center rounded-full bg-on-night text-night hover:bg-faience-100"
                >
                  <X aria-hidden="true" className="size-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
