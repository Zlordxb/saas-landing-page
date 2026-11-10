"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  addDays,
  formatDateLong,
  formatMonthYear,
  parseDate,
  toDateString,
  weekdayOf,
} from "@/lib/booking/time";
import { cn } from "@/lib/format";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const KEY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

function shiftMonth(month: string, delta: number): string {
  const [year, monthNumber] = month.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

const navButton =
  "grid size-10 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-surface-muted disabled:cursor-default disabled:border-line disabled:text-ink-subtle disabled:hover:bg-transparent";

type CalendarProps = {
  /** Selected day, "YYYY-MM-DD". */
  value: string | null;
  onChange: (date: string) => void;
  /** First bookable day (today in the clinic's time zone). */
  first: string;
  /** Last bookable day. */
  last: string;
  closedWeekdays: number[];
  /** 6 = weeks start on Saturday. */
  weekStartsOn: number;
};

/**
 * A month grid. Keyboard: Tab reaches one day, arrow keys move by day or week,
 * Enter or Space picks it ("roving tabindex").
 */
export function Calendar({
  value,
  onChange,
  first,
  last,
  closedWeekdays,
  weekStartsOn,
}: CalendarProps) {
  const [month, setMonth] = useState((value ?? first).slice(0, 7));
  const [focused, setFocused] = useState(value ?? first);
  const [previousValue, setPreviousValue] = useState(value);
  const gridRef = useRef<HTMLDivElement>(null);

  // When the selected day changes from outside (e.g. "Show the next free day"),
  // jump to its month. This is React's pattern for adjusting state when a prop changes.
  if (value !== previousValue) {
    setPreviousValue(value);
    if (value) {
      setFocused(value);
      if (value.slice(0, 7) !== month) setMonth(value.slice(0, 7));
    }
  }

  const isDisabled = (date: string) =>
    date < first || date > last || closedWeekdays.includes(weekdayOf(date));

  const { year, month: monthNumber } = parseDate(`${month}-01`);
  const monthLabel = formatMonthYear(year, monthNumber);
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const leadingBlanks = (weekdayOf(`${month}-01`) - weekStartsOn + 7) % 7;
  const days = Array.from({ length: daysInMonth }, (_, index) =>
    toDateString(year, monthNumber, index + 1),
  );
  const weekdayNames = [...WEEKDAYS.slice(weekStartsOn), ...WEEKDAYS.slice(0, weekStartsOn)];
  const tabbable =
    days.includes(focused) && !isDisabled(focused)
      ? focused
      : (days.find((day) => !isDisabled(day)) ?? null);

  function focusDay(date: string) {
    setFocused(date);
    if (date.slice(0, 7) !== month) setMonth(date.slice(0, 7));
    requestAnimationFrame(() =>
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus(),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: string) {
    const step = KEY_STEPS[event.key];
    if (!step) return;
    event.preventDefault();
    let next = addDays(date, step);
    while (next >= first && next <= last && isDisabled(next)) next = addDays(next, step);
    if (next >= first && next <= last) focusDay(next);
  }

  return (
    <div className="w-full max-w-[21rem] rounded-lg border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className={navButton}
          onClick={() => setMonth(shiftMonth(month, -1))}
          disabled={month <= first.slice(0, 7)}
          aria-label="Previous month"
        >
          <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>
        <p className="font-semibold" aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          className={navButton}
          onClick={() => setMonth(shiftMonth(month, 1))}
          disabled={month >= last.slice(0, 7)}
          aria-label="Next month"
        >
          <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center" aria-hidden="true">
        {weekdayNames.map((name) => (
          <span key={name} className="pb-2 text-caption font-medium text-ink-muted">
            {name}
          </span>
        ))}
      </div>

      <div ref={gridRef} role="group" aria-label={`Days in ${monthLabel}`} className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {days.map((date) => {
          const disabled = isDisabled(date);
          const selected = date === value;
          return (
            <button
              key={date}
              type="button"
              data-date={date}
              disabled={disabled}
              tabIndex={date === tabbable ? 0 : -1}
              aria-pressed={selected}
              aria-current={date === first ? "date" : undefined}
              aria-label={formatDateLong(date)}
              onClick={() => {
                setFocused(date);
                onChange(date);
              }}
              onKeyDown={(event) => handleKeyDown(event, date)}
              className={cn(
                "mx-auto grid size-10 place-items-center rounded-full border text-label font-medium tabular-nums transition-colors duration-150",
                selected
                  ? "border-primary bg-primary text-on-primary"
                  : disabled
                    ? "cursor-default border-transparent text-ink-subtle line-through"
                    : date === first
                      ? "border-line-strong hover:bg-surface-muted"
                      : "border-transparent hover:bg-surface-muted",
              )}
            >
              {Number(date.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
