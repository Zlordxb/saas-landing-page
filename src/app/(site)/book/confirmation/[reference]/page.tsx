import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCalendar } from "@/components/booking/AddToCalendar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StatusBadge, type BookingStatus } from "@/components/ui/StatusBadge";
import { bookingRules, clinic } from "@/config/clinic";
import { googleCalendarUrl, icsDataUrl, icsFile } from "@/lib/booking/calendar-link";
import { REFERENCE_PATTERN } from "@/lib/booking/reference";
import { dateInZone, formatDateLong, formatTime } from "@/lib/booking/time";
import { formatPrice } from "@/lib/format";
import { createAdminClient, isBookingConfigured } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "You’re booked",
  robots: { index: false, follow: false },
};

// The status can change at any moment (the owner confirms), so always render fresh.
export const dynamic = "force-dynamic";

type BookingSummary = {
  reference: string;
  starts_at: string;
  ends_at: string;
  price_egp: number;
  status: BookingStatus;
  service: { name: string } | null;
};

const statusText: Record<BookingStatus, string> = {
  pending: "Waiting for the clinic to confirm",
  confirmed: "Confirmed by the clinic",
  cancelled: "Cancelled",
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  if (!REFERENCE_PATTERN.test(reference) || !isBookingConfigured()) notFound();

  // Only non-private fields: anyone with the link sees the time, never the name or phone.
  const { data } = await createAdminClient()
    .from("bookings")
    .select("reference, starts_at, ends_at, price_egp, status, service:services(name)")
    .eq("reference", reference)
    .maybeSingle();
  if (!data) notFound();

  const booking = data as unknown as BookingSummary;
  const start = new Date(booking.starts_at);
  const end = new Date(booking.ends_at);
  const { timeZone } = bookingRules;
  const serviceName = booking.service?.name ?? "Dental appointment";
  const event = {
    title: `${serviceName} at ${clinic.name}`,
    start,
    end,
    details: `Booking reference ${booking.reference}. Call ${clinic.phone} to change or cancel.`,
    location: `${clinic.name}, ${clinic.area}`,
  };
  const ics = icsFile({ ...event, uid: `${booking.reference}@bookflow` });

  return (
    <section className="py-14 md:py-20">
      <Container size="narrow" className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-confirmed text-on-confirmed">
            <CircleCheck aria-hidden="true" className="size-6" strokeWidth={1.75} />
          </span>
          <h1 className="font-display text-h1-sm md:text-h1">You’re booked</h1>
          <p className="max-w-prose text-lead text-ink-muted">
            We saved your appointment and are holding the time for you. The clinic will call you to
            confirm.
          </p>
        </div>

        <dl className="grid gap-x-8 gap-y-5 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <dt className="text-label text-ink-muted">Treatment</dt>
            <dd className="mt-0.5 font-semibold">{serviceName}</dd>
          </div>
          <div>
            <dt className="text-label text-ink-muted">Day and time</dt>
            <dd className="mt-0.5 font-semibold">
              {formatDateLong(dateInZone(start, timeZone))}, {formatTime(start, timeZone)}
            </dd>
          </div>
          <div>
            <dt className="text-label text-ink-muted">Price</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">
              {formatPrice(booking.price_egp)}, paid at the clinic
            </dd>
          </div>
          <div>
            <dt className="text-label text-ink-muted">Status</dt>
            <dd className="mt-1">
              <StatusBadge status={booking.status} label={statusText[booking.status]} />
            </dd>
          </div>
          <div className="border-t border-line pt-5 sm:col-span-2">
            <dt className="text-label text-ink-muted">Your booking reference</dt>
            <dd className="mt-1 font-display text-h3 tracking-wide tabular-nums">
              {booking.reference}
            </dd>
            <p className="mt-1 text-small text-ink-muted">
              Keep it handy: you’ll need it to change or cancel by phone on {clinic.phone}.
            </p>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3">
          <AddToCalendar
            googleUrl={googleCalendarUrl(event)}
            icsUrl={icsDataUrl(ics)}
            fileName={`nefer-${booking.reference}.ics`}
          />
          <ButtonLink href="/" variant="ghost">
            Back to the home page
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
