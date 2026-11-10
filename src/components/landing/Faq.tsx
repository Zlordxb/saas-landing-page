import { ChevronDown, Phone } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { clinic } from "@/config/clinic";
import { faqs } from "@/content/home";
import { normalizePhone } from "@/lib/format";

/** <details> is an accessible accordion with no JavaScript; CSS animates the height. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 id="faq-title" className="font-display text-h2-sm md:text-h2">
              Questions, answered
            </h2>
            <p className="text-lead text-ink-muted">The things people ask us most before a first visit.</p>
          </div>
          <div className="flex flex-col gap-3 rounded-xl bg-primary-soft p-6 text-on-primary-soft">
            <p className="font-display text-title font-medium">Still unsure about something?</p>
            <p className="text-small">Call the clinic between 12 PM and 10 PM. A person answers, not a menu.</p>
            <a
              href={`tel:${normalizePhone(clinic.phone)}`}
              className={buttonStyles({ variant: "primary", size: "sm", className: "self-start" })}
            >
              <Phone aria-hidden="true" className="size-4" strokeWidth={2} />
              Call {clinic.phone}
            </a>
          </div>
        </div>

        <div className="border-b border-line">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="accordion group border-t border-line" open={index === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-sm py-5 text-lead font-semibold">
                {faq.question}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-muted transition-colors group-open:bg-primary group-open:text-on-primary">
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 transition-transform duration-300 group-open:rotate-180"
                    strokeWidth={1.75}
                  />
                </span>
              </summary>
              <p className="max-w-[60ch] pb-6 text-ink-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
