import { Hand, Moon, Receipt, ShieldCheck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { benefits, calmCare } from "@/content/home";
import { photos } from "@/content/photos";
import { SectionHeading } from "./SectionHeading";

const icons: Record<(typeof benefits)[number]["icon"], LucideIcon> = {
  receipt: Receipt,
  hand: Hand,
  shield: ShieldCheck,
  moon: Moon,
};

/** Two photos set like tiles in mortar, and the four promises that make a visit calm. */
export function CalmCare() {
  return (
    <section aria-labelledby="calm-title" className="bg-surface py-16 md:py-24">
      <Container className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-lg pb-10 lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden tile-dome-lg">
            <Photo photo={photos.explain} sizes="(min-width: 1024px) 32rem, 100vw" />
          </div>
          <div className="absolute right-0 bottom-0 aspect-square w-[44%] overflow-hidden rounded-xl border-[6px] border-surface shadow-lg sm:-right-6">
            <Photo photo={photos.tray} sizes="14rem" />
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <SectionHeading id="calm-title" title={calmCare.title} lead={calmCare.lead} />
          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = icons[benefit.icon];
              return (
                <div key={benefit.title} className="flex flex-col gap-2">
                  <dt className="flex items-center gap-3 font-semibold">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-on-primary-soft">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                    </span>
                    {benefit.title}
                  </dt>
                  <dd className="text-ink-muted">{benefit.text}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </Container>
    </section>
  );
}
