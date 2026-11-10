/** EGP 1,200 */
export function formatPrice(amount: number): string {
  return `EGP ${amount.toLocaleString("en-US")}`;
}

/** 45 min */
export function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

/** "010 1234-5678" → "01012345678" */
export function normalizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

/** "01012345678" → "010 1234 5678" */
export function formatPhone(input: string): string {
  const digits = normalizePhone(input);
  if (digits.length !== 11) return input;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}

/** Joins class names, skipping empty ones: cn("a", isOn && "b") */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
