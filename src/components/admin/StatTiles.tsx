import { bookingRules } from "@/config/clinic";
import { formatTime } from "@/lib/booking/time";
import type { DashboardStats } from "@/lib/data/admin";

/** Three numbers that start the owner's day. */
export function StatTiles({ stats }: { stats: DashboardStats }) {
  const tiles = [
    {
      label: "Today’s appointments",
      value: stats.today,
      note: stats.nextToday
        ? `Next at ${formatTime(new Date(stats.nextToday), bookingRules.timeZone)}`
        : "Nothing else today",
    },
    {
      label: "Waiting for you",
      value: stats.pending,
      note: stats.pending === 1 ? "Pending request to confirm" : "Pending requests to confirm",
    },
    { label: "Next 7 days", value: stats.nextSevenDays, note: "Confirmed and pending" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div key={tile.label} className="min-w-0 rounded-lg border border-line bg-surface p-5">
          <p className="text-label font-medium text-ink-muted">{tile.label}</p>
          <p className="mt-2 font-display text-h2 tabular-nums">{tile.value}</p>
          <p className="mt-1 text-small text-ink-muted">{tile.note}</p>
        </div>
      ))}
    </div>
  );
}
