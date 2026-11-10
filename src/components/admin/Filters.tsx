import { Search } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import type { Filters as FilterValues, WhenFilter } from "@/lib/data/admin";
import { cn } from "@/lib/format";

const WHEN_OPTIONS: { value: WhenFilter; label: string }[] = [
  { value: "upcoming", label: "Today and later" },
  { value: "today", label: "Today" },
  { value: "past", label: "Past" },
  { value: "all", label: "All" },
];

const fieldClass =
  "h-10 rounded-md border border-line-strong bg-surface px-3 text-label outline-none focus:border-primary focus:ring-3 focus:ring-primary-soft";

/**
 * Filters live in the URL (?when=today&status=pending&q=…), so a filtered view can be
 * bookmarked or shared, and the page stays a Server Component. next/form updates the
 * URL without a full page reload.
 */
export function Filters({ filters }: { filters: FilterValues }) {
  const hrefFor = (when: WhenFilter) => {
    const params = new URLSearchParams();
    params.set("when", when);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.q) params.set("q", filters.q);
    return `/admin?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <nav aria-label="Time range" className="flex flex-wrap gap-2">
        {WHEN_OPTIONS.map((option) => {
          const active = option.value === filters.when;
          return (
            <Link
              key={option.value}
              href={hrefFor(option.value)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-10 items-center rounded-full border px-4 text-label font-medium transition-colors",
                active
                  ? "border-primary bg-primary-soft text-on-primary-soft"
                  : "border-line-strong bg-surface text-ink hover:border-primary",
              )}
            >
              {option.label}
            </Link>
          );
        })}
      </nav>

      <Form action="/admin" className="flex flex-wrap items-end gap-2">
        <input type="hidden" name="when" value={filters.when} />
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-caption font-medium text-ink-muted">
            Status
          </label>
          <select id="status" name="status" defaultValue={filters.status} className={fieldClass}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-caption font-medium text-ink-muted">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Name, phone or BF-…"
            className={cn(fieldClass, "w-56")}
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-label font-semibold text-on-primary hover:bg-primary-hover"
        >
          <Search aria-hidden="true" className="size-4" strokeWidth={2} />
          Apply
        </button>
      </Form>
    </div>
  );
}
