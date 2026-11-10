"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "@/actions/admin";
import { Button } from "@/components/ui/Button";
import type { BookingStatus } from "@/components/ui/StatusBadge";

/** Confirm or cancel. Cancelling asks first, inside the page (no browser pop-up). */
export function BookingActions({ id, status }: { id: string; status: BookingStatus }) {
  const [isPending, startTransition] = useTransition();
  const [askingToCancel, setAskingToCancel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function run(next: "confirmed" | "cancelled") {
    setError(null);
    startTransition(async () => {
      const result = await updateBookingStatus(id, next);
      if (!result.ok) setError(result.message);
      setAskingToCancel(false);
    });
  }

  if (status === "cancelled") return null;

  if (askingToCancel) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2" role="group" aria-label="Cancel this booking?">
        <span className="text-label font-medium">Cancel this booking?</span>
        <Button variant="danger" size="sm" disabled={isPending} onClick={() => run("cancelled")}>
          {isPending ? "Cancelling…" : "Yes, cancel"}
        </Button>
        <Button variant="ghost" size="sm" disabled={isPending} onClick={() => setAskingToCancel(false)}>
          Keep it
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-2">
        {status === "pending" ? (
          <Button variant="soft" size="sm" disabled={isPending} onClick={() => run("confirmed")}>
            {isPending ? "Saving…" : "Confirm"}
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" disabled={isPending} onClick={() => setAskingToCancel(true)}>
          Cancel
        </Button>
      </div>
      {error ? (
        <p role="alert" className="text-label font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
