import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/admin";
import { BookingList } from "@/components/admin/BookingList";
import { Filters } from "@/components/admin/Filters";
import { StatTiles } from "@/components/admin/StatTiles";
import { Logo } from "@/components/site/Logo";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getBookings, getStats, isCurrentUserAdmin, parseFilters } from "@/lib/data/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient, type ServerSupabaseClient } from "@/lib/supabase/server";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const EMPTY_TEXT = {
  upcoming: "New bookings appear here as soon as patients make them.",
  today: "Nothing booked for today yet.",
  past: "Past bookings appear here.",
  all: "No bookings match these filters.",
};

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  if (!isSupabaseConfigured()) redirect("/admin/login");

  // The proxy already checked the session; checking again here is "defense in depth".
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) redirect("/admin/login");
  const email = typeof auth.claims.email === "string" ? auth.claims.email : "";

  const filters = parseFilters(await searchParams);
  const isAdmin = await isCurrentUserAdmin(supabase);

  return (
    <>
      <header className="border-b border-line bg-surface">
        <Container className="flex h-18 items-center justify-between gap-4">
          <Logo href="/admin" />
          <div className="flex items-center gap-3">
            <span className="hidden text-small text-ink-muted sm:inline">{email}</span>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut aria-hidden="true" className="size-4" strokeWidth={1.75} />
                Sign out
              </Button>
            </form>
          </div>
        </Container>
      </header>

      <main>
        <Container className="flex flex-col gap-8 py-10">
          <h1 className="font-display text-h1-sm">Bookings</h1>
          {isAdmin ? (
            <Dashboard filters={filters} supabase={supabase} />
          ) : (
            // A general message: setup details (the admin_users table) stay in the README.
            <Alert tone="info" title="This account can’t open the dashboard">
              Sign out and sign in with the clinic owner’s account, or ask the owner to give you
              access.
            </Alert>
          )}
        </Container>
      </main>
    </>
  );
}

async function Dashboard({
  filters,
  supabase,
}: {
  filters: ReturnType<typeof parseFilters>;
  supabase: ServerSupabaseClient;
}) {
  const [stats, bookings] = await Promise.all([getStats(supabase), getBookings(supabase, filters)]);
  return (
    <>
      <StatTiles stats={stats} />
      <Filters filters={filters} />
      <BookingList bookings={bookings} emptyText={EMPTY_TEXT[filters.when]} />
    </>
  );
}
