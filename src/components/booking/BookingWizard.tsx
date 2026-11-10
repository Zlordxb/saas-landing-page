"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, CircleAlert, Clock } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { createBooking } from "@/actions/booking";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { clinic } from "@/config/clinic";
import type { Service } from "@/data/services";
import { formatDateLong, formatTime, isValidDateString } from "@/lib/booking/time";
import type { Availability } from "@/lib/booking/types";
import { cn, formatDuration, formatPhone, formatPrice } from "@/lib/format";
import { bookingDetailsSchema } from "@/lib/validation/booking";
import { Calendar } from "./Calendar";
import { TimeSlotPicker } from "./TimeSlotPicker";

type StepId = "service" | "time" | "details" | "review";

const STEPS: { id: StepId; label: string; title: string }[] = [
  { id: "service", label: "Service", title: "Choose a treatment" },
  { id: "time", label: "Time", title: "Pick a day and time" },
  { id: "details", label: "Your details", title: "Your details" },
  { id: "review", label: "Review", title: "Check and confirm" },
];

type SlotsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: Availability };

const EASE_GLAZE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Props = {
  services: Service[];
  /** From the URL, e.g. /book?service=teeth-whitening&date=2026-11-14&time=… */
  initial: { serviceSlug?: string; date?: string; start?: string };
  bookableDays: { first: string; last: string };
  closedWeekdays: number[];
  weekStartsOn: number;
  timeZone: string;
  connected: boolean;
};

/**
 * The booking flow: service → day and time → details → review.
 * It's one Client Component that owns the state of all four steps, so going back
 * never loses what the patient already chose or typed.
 */
export function BookingWizard({
  services,
  initial,
  bookableDays,
  closedWeekdays,
  weekStartsOn,
  timeZone,
  connected,
}: Props) {
  const router = useRouter();

  const initialService = services.find((item) => item.slug === initial.serviceSlug) ?? null;
  const initialDate =
    initialService &&
    initial.date &&
    isValidDateString(initial.date) &&
    initial.date >= bookableDays.first &&
    initial.date <= bookableDays.last
      ? initial.date
      : null;
  const initialStart =
    initialDate && initial.start && !Number.isNaN(Date.parse(initial.start))
      ? new Date(initial.start).toISOString()
      : null;

  const [step, setStep] = useState<StepId>(
    initialService ? (initialStart ? "details" : "time") : "service",
  );
  const [serviceSlug, setServiceSlug] = useState<string | null>(initialService?.slug ?? null);
  const [date, setDate] = useState<string | null>(initialDate);
  const [start, setStart] = useState<string | null>(initialStart);
  const [slots, setSlots] = useState<SlotsState>(
    initialService ? { status: "loading" } : { status: "idle" },
  );
  const [timeError, setTimeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, startSubmit] = useTransition();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  const requestRef = useRef<AbortController | null>(null);

  const form = useForm({
    resolver: zodResolver(bookingDetailsSchema),
    defaultValues: { name: "", phone: "", email: "", notes: "", website: "" },
    mode: "onTouched",
  });
  const { errors } = form.formState;

  const service = services.find((item) => item.slug === serviceSlug) ?? null;
  const currentIndex = STEPS.findIndex((item) => item.id === step);

  /** Loads free times for a day, or for the first day that has any (`"next"`). */
  const fetchSlots = useCallback((slug: string, day: string) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    fetch(`/api/slots?service=${encodeURIComponent(slug)}&date=${day}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as Availability;
      })
      .then((data) => {
        setSlots({ status: "ready", data });
        if (data.date) setDate(data.date);
      })
      .catch(() => {
        if (!controller.signal.aborted) setSlots({ status: "error" });
      });
    return controller;
  }, []);

  // Arriving from a service card or the hero card: load times straight away.
  useEffect(() => {
    if (!initialService) return;
    const controller = fetchSlots(initialService.slug, initialDate ?? "next");
    return () => controller.abort();
  }, [initialService, initialDate, fetchSlots]);

  // Move keyboard and screen-reader focus to the new step's title.
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    headingRef.current?.focus();
  }, [step]);

  function chooseService(slug: string) {
    setServiceSlug(slug);
    setStart(null);
    setTimeError(null);
    setSubmitError(null);
    setSlots({ status: "loading" });
    fetchSlots(slug, date ?? "next");
    setStep("time");
  }

  function chooseDate(day: string) {
    if (!serviceSlug) return;
    setDate(day);
    setStart(null);
    setTimeError(null);
    setSlots({ status: "loading" });
    fetchSlots(serviceSlug, day);
  }

  function continueFromTime() {
    if (!start) {
      setTimeError("Choose a time to continue.");
      return;
    }
    setSubmitError(null);
    setStep("details");
  }

  const continueFromDetails = form.handleSubmit(() => setStep("review"));

  function confirmBooking() {
    if (!service || !start) return;
    setSubmitError(null);
    const details = form.getValues();
    startSubmit(async () => {
      const result = await createBooking({
        ...details,
        serviceSlug: service.slug,
        startsAt: start,
      });
      if (result.ok) {
        router.push(`/book/confirmation/${result.reference}`);
        return;
      }
      setSubmitError(result.message);
      if (result.error === "slot_taken") {
        setStart(null);
        setStep("time");
        setSlots({ status: "loading" });
        fetchSlots(service.slug, date ?? "next");
      } else if (result.error === "invalid") {
        for (const field of ["name", "phone", "email", "notes"] as const) {
          const message = result.fieldErrors?.[field]?.[0];
          if (message) form.setError(field, { message });
        }
        setStep("details");
      }
    });
  }

  function renderSlots() {
    if (slots.status === "idle") {
      return <p className="text-ink-muted">Choose a day to see the free times.</p>;
    }
    if (slots.status === "loading") {
      return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
          <span className="sr-only">Loading free times…</span>
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index} className="h-11 animate-pulse rounded-full bg-surface-muted" />
          ))}
        </div>
      );
    }
    if (slots.status === "error") {
      return (
        <Alert tone="error" title="Free times couldn’t be loaded.">
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => service && chooseDate(date ?? bookableDays.first)}
          >
            Try again
          </button>
        </Alert>
      );
    }

    const { data } = slots;
    if (!data.date) {
      return (
        <p className="text-ink-muted">
          No free times in the next 30 days. Call the clinic on {clinic.phone} and we’ll fit you in.
        </p>
      );
    }
    const nextDay = data.nextAvailableDate;
    return (
      <div className="flex flex-col gap-4">
        <p className="font-semibold">{formatDateLong(data.date)}</p>
        {data.slots.length === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-ink-muted">No free times on this day.</p>
            {nextDay ? (
              <Button variant="secondary" size="sm" onClick={() => chooseDate(nextDay)}>
                Show {formatDateLong(nextDay)}
              </Button>
            ) : null}
          </div>
        ) : (
          <TimeSlotPicker
            slots={data.slots}
            value={start}
            onChange={(slotStart) => {
              setStart(slotStart);
              setTimeError(null);
            }}
          />
        )}
        {!data.connected ? (
          <p className="text-caption text-ink-muted">
            Preview times: they become live once Supabase is connected.
          </p>
        ) : null}
      </div>
    );
  }

  function renderStep(): ReactNode {
    if (step === "service") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((item) => {
            const selected = item.slug === serviceSlug;
            return (
              <button
                key={item.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => chooseService(item.slug)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors duration-150",
                  selected
                    ? "border-primary bg-primary-soft ring-1 ring-primary ring-inset"
                    : "border-line hover:border-line-strong",
                )}
              >
                <span className="font-semibold">{item.name}</span>
                <span className="flex flex-wrap gap-x-4 text-small text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                    {formatDuration(item.durationMinutes)}
                  </span>
                  <span className="tabular-nums">
                    {formatPrice(item.priceEgp)} {item.priceUnit}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    if (step === "time") {
      return (
        <div className="flex flex-col gap-6">
          {service ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-muted px-4 py-3">
              <p>
                <span className="font-semibold">{service.name}</span>
                <span className="text-small text-ink-muted">
                  {" "}
                  {formatDuration(service.durationMinutes)}, {formatPrice(service.priceEgp)}{" "}
                  {service.priceUnit}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setStep("service")}
                className="rounded-sm text-label font-semibold text-link hover:underline"
              >
                Change
              </button>
            </div>
          ) : null}
          {submitError ? <Alert tone="error" title={submitError} /> : null}
          <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8">
            <Calendar
              value={date}
              onChange={chooseDate}
              first={bookableDays.first}
              last={bookableDays.last}
              closedWeekdays={closedWeekdays}
              weekStartsOn={weekStartsOn}
            />
            <div className="min-w-0" aria-live="polite">
              {renderSlots()}
            </div>
          </div>
          {timeError ? (
            <p role="alert" className="text-label font-medium text-danger">
              {timeError}
            </p>
          ) : null}
          <StepActions
            onBack={() => setStep("service")}
            onNext={continueFromTime}
            nextLabel="Continue"
          />
        </div>
      );
    }

    if (step === "details") {
      return (
        <form onSubmit={continueFromDetails} noValidate className="flex flex-col gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Full name" error={errors.name?.message}>
              {(describedBy) => (
                <input
                  id="name"
                  autoComplete="name"
                  className={inputStyles(Boolean(errors.name))}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy}
                  {...form.register("name")}
                />
              )}
            </Field>
            <Field
              id="phone"
              label="Mobile number"
              hint="The clinic calls this number to confirm."
              error={errors.phone?.message}
            >
              {(describedBy) => (
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="010 1234 5678"
                  className={inputStyles(Boolean(errors.phone))}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy}
                  {...form.register("phone")}
                />
              )}
            </Field>
            <Field
              id="email"
              label="Email"
              optional
              hint="Only used if we can’t reach you by phone."
              error={errors.email?.message}
            >
              {(describedBy) => (
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={inputStyles(Boolean(errors.email))}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy}
                  {...form.register("email")}
                />
              )}
            </Field>
            <Field
              id="notes"
              label="Notes"
              optional
              error={errors.notes?.message}
              className="sm:col-span-2"
            >
              {(describedBy) => (
                <textarea
                  id="notes"
                  rows={3}
                  maxLength={500}
                  placeholder="Anything we should know, like sensitive teeth"
                  className={inputStyles(Boolean(errors.notes), true)}
                  aria-invalid={Boolean(errors.notes)}
                  aria-describedby={describedBy}
                  {...form.register("notes")}
                />
              )}
            </Field>
          </div>
          {/* Honeypot: off-screen and hidden from screen readers, so only bots fill it in. */}
          <div aria-hidden="true" className="fixed -left-[100vw] size-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("website")}
            />
          </div>
          <StepActions
            onBack={() => setStep("time")}
            nextLabel="Review booking"
            nextType="submit"
          />
        </form>
      );
    }

    // Review
    const values = form.getValues();
    if (!service || !date || !start) {
      return (
        <div className="flex flex-col items-start gap-4">
          <p className="text-ink-muted">
            Something is missing. Please choose a day and time again.
          </p>
          <Button variant="secondary" onClick={() => setStep("time")}>
            Choose a time
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <dl className="grid gap-x-8 gap-y-4 rounded-lg bg-surface-muted p-5 sm:grid-cols-2">
          <SummaryItem label="Treatment" value={service.name} onEdit={() => setStep("service")} />
          <SummaryItem
            label="Day and time"
            value={`${formatDateLong(date)}, ${formatTime(new Date(start), timeZone)}`}
            onEdit={() => setStep("time")}
          />
          <SummaryItem label="Takes about" value={formatDuration(service.durationMinutes)} />
          <SummaryItem
            label="Price"
            value={`${formatPrice(service.priceEgp)} ${service.priceUnit}, paid at the clinic`}
          />
          <SummaryItem label="Name" value={values.name} onEdit={() => setStep("details")} />
          <SummaryItem label="Mobile" value={formatPhone(values.phone)} />
          {values.email ? <SummaryItem label="Email" value={values.email} /> : null}
          {values.notes ? (
            <SummaryItem label="Notes" value={values.notes} className="sm:col-span-2" />
          ) : null}
        </dl>
        {!connected ? (
          <Alert tone="info" title="Demo mode">
            This copy isn’t connected to a database yet, so the booking won’t be saved. Add your
            Supabase keys to .env.local to make it real.
          </Alert>
        ) : null}
        {submitError ? <Alert tone="error" title={submitError} /> : null}
        <StepActions
          onBack={() => setStep("details")}
          onNext={confirmBooking}
          nextLabel={isSubmitting ? "Booking…" : "Confirm booking"}
          busy={isSubmitting}
        />
        <p className="text-caption text-ink-muted">
          No payment is taken online. The clinic calls you to confirm.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <ol aria-label="Booking steps" className="flex flex-wrap gap-x-6 gap-y-3">
        {STEPS.map((item, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;
          const content = (
            <>
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-caption font-semibold",
                  done && "bg-primary text-on-primary",
                  current && "border-2 border-primary text-link",
                  !done && !current && "border border-line-strong text-ink-muted",
                )}
              >
                {done ? (
                  <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn("text-label font-medium", current ? "text-ink" : "text-ink-muted")}
              >
                {item.label}
              </span>
            </>
          );
          return (
            <li key={item.id} aria-current={current ? "step" : undefined}>
              {done ? (
                <button
                  type="button"
                  onClick={() => setStep(item.id)}
                  className="flex items-center gap-2 rounded-full pr-1"
                >
                  {content}
                  <span className="sr-only">(done, go back to this step)</span>
                </button>
              ) : (
                <span className="flex items-center gap-2">{content}</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-8">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-h3 font-medium outline-none"
        >
          {STEPS[currentIndex].title}
        </h2>
        <MotionConfig reducedMotion="user">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE_GLAZE }}
              className="mt-6"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </MotionConfig>
      </div>
    </div>
  );
}

function inputStyles(invalid: boolean, multiline = false) {
  return cn(
    "w-full rounded-md border bg-surface px-4 text-body text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-subtle hover:border-ink-muted focus:ring-3",
    multiline ? "min-h-28 resize-y py-3" : "h-12",
    invalid
      ? "border-danger focus:border-danger focus:ring-danger-soft"
      : "border-line-strong focus:border-primary focus:ring-primary-soft",
  );
}

function Field({
  id,
  label,
  optional,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: (describedBy: string | undefined) => ReactNode;
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-label font-medium">
        {label}
        {optional ? <span className="font-normal text-ink-muted"> (optional)</span> : null}
      </label>
      {children(describedBy)}
      {error ? (
        <p
          id={`${id}-error`}
          className="flex items-start gap-1.5 text-label font-medium text-danger"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-label text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function SummaryItem({
  label,
  value,
  onEdit,
  className,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="flex items-center gap-2 text-label text-ink-muted">
        {label}
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-sm font-semibold text-link hover:underline"
            aria-label={`Change ${label.toLowerCase()}`}
          >
            Change
          </button>
        ) : null}
      </dt>
      <dd className="mt-0.5 font-medium break-words">{value}</dd>
    </div>
  );
}

function StepActions({
  onBack,
  onNext,
  nextLabel,
  nextType = "button",
  busy = false,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel: string;
  nextType?: "button" | "submit";
  busy?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <Button variant="ghost" onClick={onBack} disabled={busy}>
          <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={2} />
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button
        type={nextType}
        onClick={nextType === "button" ? onNext : undefined}
        disabled={busy}
        aria-busy={busy || undefined}
      >
        {busy ? (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        ) : null}
        {nextLabel}
      </Button>
    </div>
  );
}
