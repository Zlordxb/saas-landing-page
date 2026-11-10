import Link from "next/link";
import { clinic } from "@/config/clinic";
import { cn } from "@/lib/format";

/** The nfr hieroglyph ("beautiful, good") on a faience tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="11" className="fill-primary" />
      <g className="fill-bg">
        <path d="M16.6 19.4h6.8c2.9 1.5 4.8 4.2 4.8 7.3 0 4.1-3.7 7.3-8.2 7.3s-8.2-3.2-8.2-7.3c0-3.1 1.9-5.8 4.8-7.3z" />
        <rect x="18.6" y="5.6" width="2.8" height="15" rx="1.4" />
        <rect x="15.9" y="9" width="8.2" height="2.2" rx="1.1" />
        <rect x="15.9" y="13.1" width="8.2" height="2.2" rx="1.1" />
      </g>
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${clinic.name}, home`}
      className={cn("inline-flex items-center gap-2.5 rounded-sm text-ink", className)}
    >
      <LogoMark className="size-9 shrink-0" />
      <span>
        <span className="block font-display text-[1.375rem] leading-none font-medium">
          {clinic.shortName}
        </span>
        <span className="mt-1 block text-caption font-medium text-ink-muted">Dental Studio</span>
      </span>
    </Link>
  );
}
