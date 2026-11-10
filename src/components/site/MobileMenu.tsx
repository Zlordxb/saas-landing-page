import { ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { clinic } from "@/config/clinic";
import { clinicLinks } from "@/content/navigation";
import { groupServices } from "@/content/treatments";
import type { Service } from "@/data/services";
import { formatPrice, normalizePhone } from "@/lib/format";
import { OpenStatus } from "./OpenStatus";

/** The phone menu: two folding groups, the prices page and a big booking button. */
export function MobileMenu({
  services,
  onNavigate,
}: {
  services: Service[];
  onNavigate: () => void;
}) {
  const groups = groupServices(services);

  return (
    <Container className="flex min-h-full flex-col gap-2 py-4">
      <Link
        href="/"
        onClick={onNavigate}
        className="border-b border-line py-4 font-display text-h3 font-medium"
      >
        Home
      </Link>

      <details className="accordion group border-b border-line" open>
        <summary className="flex cursor-pointer items-center justify-between py-4 font-display text-h3 font-medium">
          Treatments
          <ChevronDown
            aria-hidden="true"
            className="size-5 transition-transform duration-200 group-open:rotate-180"
            strokeWidth={1.75}
          />
        </summary>
        <div className="flex flex-col gap-5 pb-5">
          {groups.map((group) => (
            <div key={group.id}>
              <p className="text-small font-semibold text-ink-muted">{group.title}</p>
              <ul className="mt-1">
                {group.services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/book?service=${service.slug}`}
                      onClick={onNavigate}
                      className="flex items-baseline justify-between gap-4 rounded-sm py-2 font-medium"
                    >
                      {service.name}
                      <span className="shrink-0 text-small text-ink-muted tabular-nums">
                        {formatPrice(service.priceEgp)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      <details className="accordion group border-b border-line">
        <summary className="flex cursor-pointer items-center justify-between py-4 font-display text-h3 font-medium">
          The clinic
          <ChevronDown
            aria-hidden="true"
            className="size-5 transition-transform duration-200 group-open:rotate-180"
            strokeWidth={1.75}
          />
        </summary>
        <ul className="flex flex-col pb-4">
          {clinicLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-sm py-2.5 font-medium"
              >
                <link.icon aria-hidden="true" className="size-5 text-primary" strokeWidth={1.75} />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>

      <Link
        href="/services"
        onClick={onNavigate}
        className="border-b border-line py-4 font-display text-h3 font-medium"
      >
        Prices
      </Link>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <Link href="/book" onClick={onNavigate} className={buttonStyles({ size: "lg" })}>
          Book an appointment
        </Link>
        <a
          href={`tel:${normalizePhone(clinic.phone)}`}
          className={buttonStyles({ variant: "secondary", size: "lg" })}
        >
          <Phone aria-hidden="true" className="size-5" strokeWidth={1.75} />
          Call {clinic.phone}
        </a>
        <OpenStatus className="justify-center pt-1 text-small text-ink-muted" />
      </div>
    </Container>
  );
}
