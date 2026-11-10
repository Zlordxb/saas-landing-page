"use client";

import type { SlotOption } from "@/lib/booking/types";
import { cn } from "@/lib/format";

const PERIODS = [
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
] as const;

/** Free start times, grouped into Afternoon and Evening. Only free times are ever shown. */
export function TimeSlotPicker({
  slots,
  value,
  onChange,
}: {
  slots: SlotOption[];
  value: string | null;
  onChange: (start: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {PERIODS.map((period) => {
        const periodSlots = slots.filter((slot) => slot.period === period.id);
        if (periodSlots.length === 0) return null;
        return (
          <div
            key={period.id}
            role="group"
            aria-labelledby={`slots-${period.id}`}
            className="flex flex-col gap-2"
          >
            <span id={`slots-${period.id}`} className="text-label font-medium text-ink-muted">
              {period.label}
            </span>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
              {periodSlots.map((slot) => {
                const selected = slot.start === value;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChange(slot.start)}
                    className={cn(
                      "h-11 rounded-full border px-3 text-label font-medium tabular-nums transition-colors duration-150",
                      selected
                        ? "border-primary bg-primary-soft text-on-primary-soft ring-1 ring-primary ring-inset"
                        : "border-line-strong bg-surface text-ink hover:border-primary",
                    )}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
