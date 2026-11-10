import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Container } from "@/components/ui/Container";
import { bookingRules, closedWeekdays } from "@/config/clinic";
import { bookingWindow } from "@/lib/booking/slots";
import { getServices } from "@/lib/data/services";
import { isBookingConfigured } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Choose a treatment, pick a free time and book in under a minute. No payment online.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const single = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined;

export default async function BookPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const services = await getServices();
  const bookableDays = bookingWindow(bookingRules);

  return (
    <section className="pt-12 pb-20 md:pt-16 md:pb-28">
      <Container size="narrow" className="flex flex-col gap-3">
        <h1 className="font-display text-h1-sm md:text-h1">Book an appointment</h1>
        <p className="text-lead text-ink-muted">
          Four short steps. You pay at the clinic after your visit, not online.
        </p>
        <BookingWizard
          services={services}
          initial={{
            serviceSlug: single(params.service),
            date: single(params.date),
            start: single(params.time),
          }}
          bookableDays={bookableDays}
          closedWeekdays={closedWeekdays}
          weekStartsOn={bookingRules.weekStartsOn}
          timeZone={bookingRules.timeZone}
          connected={isBookingConfigured()}
        />
      </Container>
    </section>
  );
}
