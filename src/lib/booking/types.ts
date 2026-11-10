/** Shapes shared by the server (API, Server Actions) and the browser (booking UI). */

export type SlotOption = {
  /** ISO timestamp of the start (UTC). */
  start: string;
  /** "4:30 PM" in the clinic's time zone. */
  label: string;
  period: "afternoon" | "evening";
};

export type Availability = {
  /** The day the slots are for ("YYYY-MM-DD"), or null when nothing is free in the window. */
  date: string | null;
  dateLabel: string | null;
  slots: SlotOption[];
  /** When `date` is full: the next day that has free times. */
  nextAvailableDate: string | null;
  /** False when Supabase isn't connected: the times are a preview, not real availability. */
  connected: boolean;
};
