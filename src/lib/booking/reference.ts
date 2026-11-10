/**
 * Booking references like "BF-7K2Q9X" that patients can read out on the phone.
 * The alphabet leaves out look-alikes (0/O, 1/I/L).
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export const REFERENCE_PATTERN = /^BF-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/;

export function generateReference(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let code = "";
  for (const byte of bytes) code += ALPHABET[byte % ALPHABET.length];
  return `BF-${code}`;
}
