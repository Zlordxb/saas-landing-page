import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { clinic } from "@/config/clinic";
import { clinicLinks } from "@/content/navigation";
import { allPhotos } from "@/content/photos";
import { Logo } from "./Logo";

const pages = [
  { href: "/services", label: "Treatments and prices" },
  { href: "/book", label: "Book an appointment" },
  ...clinicLinks.map((link) => ({ href: link.href, label: link.label })),
  { href: "/admin", label: "Owner login" },
];

const photographers = [...new Set(allPhotos.map((photo) => photo.credit))].sort();

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg text-small">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-ink-muted">{clinic.tagline}</p>
        </div>
        <div>
          <h2 className="text-label font-semibold">Visit</h2>
          <ul className="mt-2 space-y-1 text-ink-muted">
            <li>{clinic.area}</li>
            <li>{clinic.openDaysText}</li>
            <li>{clinic.closedDaysText}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-label font-semibold">Contact</h2>
          <ul className="mt-2 space-y-1 text-ink-muted">
            <li className="tabular-nums">{clinic.phone}</li>
            <li>{clinic.email}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-label font-semibold">Pages</h2>
          <ul className="mt-2 space-y-1">
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="rounded-sm text-link hover:underline">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-3 border-t border-line py-5 text-caption text-ink-muted">
        <details className="accordion group">
          <summary className="w-fit cursor-pointer rounded-sm font-medium text-ink-muted hover:text-ink">
            Photo credits
          </summary>
          <p className="max-w-3xl pt-2">
            Photos from{" "}
            <a href="https://unsplash.com" className="text-link underline" target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>{" "}
            by {photographers.join(", ")}.
          </p>
        </details>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
          <p>© 2026 {clinic.name}, a fictional clinic for the BookFlow demo.</p>
          <p>Powered by BookFlow</p>
        </div>
      </Container>
    </footer>
  );
}
