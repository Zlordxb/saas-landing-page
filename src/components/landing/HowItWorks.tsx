import { Container } from "@/components/ui/Container";
import { steps } from "@/content/home";
import { SectionHeading } from "./SectionHeading";

/** A real sequence, so numbered steps make sense here. A dashed path joins them. */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-16 md:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading id="how-title" title="Book in three steps" />
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span className="flex items-center gap-4" aria-hidden="true">
                <span className="glaze grid size-12 shrink-0 place-items-center rounded-full bg-primary font-display text-title font-medium text-on-primary tabular-nums">
                  {index + 1}
                </span>
                {index < steps.length - 1 ? (
                  <span className="hidden h-px flex-1 border-t-2 border-dashed border-faience-200 md:block" />
                ) : null}
              </span>
              <h3 className="mt-2 text-title font-semibold">{step.title}</h3>
              <p className="max-w-[34ch] text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
