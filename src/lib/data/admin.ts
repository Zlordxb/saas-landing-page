import "server-only";
import type { BookingStatus } from "@/components/ui/StatusBadge";
import type { ServerSupabaseClient as SupabaseClient } from "@/lib/supabase/server";
import { bookingRules } from "@/config/clinic";
import { addDays, dateInZone, zonedTimeToUtc } from "@/lib/booking/time";

export type AdminBooking = {
  id: string;
  reference: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  priceEgp: number;
  serviceName: string;
};

export type StatusFilter = "all" | BookingStatus;
export type WhenFilter = "upcoming" | "today" | "past" | "all";
export type Filters = { status: StatusFilter; when: WhenFilter; q: string };

const STATUS_VALUES: StatusFilter[] = ["all", "pending", "confirmed", "cancelled"];
const WHEN_VALUES: WhenFilter[] = ["upcoming", "today", "past", "all"];

/** Reads ?status=…&when=…&q=… safely: anything unexpected falls back to the default. */
export function parseFilters(params: Record<string, string | string[] | undefined>): Filters {
  const read = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const status = read("status") as StatusFilter;
  const when = read("when") as WhenFilter;
  return {
    status: STATUS_VALUES.includes(status) ? status : "all",
    when: WHEN_VALUES.includes(when) ? when : "upcoming",
    q: read("q").slice(0, 60),
  };
}

function dayBounds(now: Date) {
  const { timeZone } = bookingRules;
  const today = dateInZone(now, timeZone);
  return {
    startOfToday: zonedTimeToUtc(today, 0, timeZone).toISOString(),
    startOfTomorrow: zonedTimeToUtc(addDays(today, 1), 0, timeZone).toISOString(),
    inSevenDays: zonedTimeToUtc(addDays(today, 7), 0, timeZone).toISOString(),
  };
}

type BookingRow = {
  id: string;
  reference: string;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
  price_egp: number;
  service: { name: string } | null;
};

export async function getBookings(
  supabase: SupabaseClient,
  filters: Filters,
  now = new Date(),
): Promise<AdminBooking[]> {
  const { startOfToday, startOfTomorrow } = dayBounds(now);

  let query = supabase
    .from("bookings")
    .select(
      "id, reference, starts_at, ends_at, status, customer_name, customer_phone, customer_email, notes, price_egp, service:services(name)",
    )
    .limit(200);

  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.when === "today") query = query.gte("starts_at", startOfToday).lt("starts_at", startOfTomorrow);
  if (filters.when === "upcoming") query = query.gte("starts_at", startOfToday);
  if (filters.when === "past") query = query.lt("starts_at", startOfToday);

  // Search by name, reference or phone. Strip anything that isn't a letter, digit,
  // space or dash, so the text can't change the meaning of the filter.
  const term = filters.q.replace(/[^\p{L}\p{N}\s-]/gu, "").trim();
  if (term) {
    const conditions = [`customer_name.ilike."*${term}*"`, `reference.ilike."*${term}*"`];
    const digits = term.replace(/\D/g, "");
    if (digits.length >= 3) conditions.push(`customer_phone.ilike."*${digits}*"`);
    query = query.or(conditions.join(","));
  }

  const { data, error } = await query.order("starts_at", { ascending: filters.when !== "past" });
  if (error) throw new Error(`Could not load bookings: ${error.message}`);

  return ((data ?? []) as unknown as BookingRow[]).map((row) => ({
    id: row.id,
    reference: row.reference,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    notes: row.notes,
    priceEgp: row.price_egp,
    serviceName: row.service?.name ?? "Service",
  }));
}

export type DashboardStats = {
  today: number;
  pending: number;
  nextSevenDays: number;
  nextToday: string | null;
};

export async function getStats(supabase: SupabaseClient, now = new Date()): Promise<DashboardStats> {
  const { startOfToday, startOfTomorrow, inSevenDays } = dayBounds(now);
  const active = ["pending", "confirmed"];
  const count = () => supabase.from("bookings").select("id", { count: "exact", head: true });

  const [today, pending, week, next] = await Promise.all([
    count().in("status", active).gte("starts_at", startOfToday).lt("starts_at", startOfTomorrow),
    count().eq("status", "pending").gte("starts_at", now.toISOString()),
    count().in("status", active).gte("starts_at", startOfToday).lt("starts_at", inSevenDays),
    supabase
      .from("bookings")
      .select("starts_at")
      .in("status", active)
      .gte("starts_at", now.toISOString())
      .lt("starts_at", startOfTomorrow)
      .order("starts_at")
      .limit(1),
  ]);

  const nextRow = (next.data as { starts_at: string }[] | null)?.[0];
  return {
    today: today.count ?? 0,
    pending: pending.count ?? 0,
    nextSevenDays: week.count ?? 0,
    nextToday: nextRow?.starts_at ?? null,
  };
}

/** True when the signed-in user is listed in admin_users. */
export async function isCurrentUserAdmin(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}
