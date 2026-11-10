/**
 * The clinic's services.
 *
 * The real list lives in the Supabase `services` table (see supabase/migrations).
 * This copy is used when Supabase isn't connected yet, so the site still works
 * the first time you run `npm run dev`. Keep both in sync.
 */
export type Service = {
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceEgp: number;
  /** What the price covers: "per visit", "per tooth", "both arches"… */
  priceUnit: string;
  isPopular: boolean;
  sortOrder: number;
};

export const fallbackServices: Service[] = [
  {
    slug: "check-up-and-consultation",
    name: "Check-up and consultation",
    description: "A full exam, a gum check and a clear treatment plan with prices.",
    durationMinutes: 30,
    priceEgp: 500,
    priceUnit: "per visit",
    isPopular: true,
    sortOrder: 1,
  },
  {
    slug: "scaling-and-polishing",
    name: "Scaling and polishing",
    description:
      "Removes tartar and surface stains, then polishes every tooth smooth. Recommended every six months.",
    durationMinutes: 45,
    priceEgp: 1200,
    priceUnit: "per session",
    isPopular: true,
    sortOrder: 2,
  },
  {
    slug: "tooth-colored-filling",
    name: "Tooth-colored filling",
    description: "Repairs a cavity with composite resin, shaded to match the tooth around it.",
    durationMinutes: 45,
    priceEgp: 1500,
    priceUnit: "per tooth",
    isPopular: true,
    sortOrder: 3,
  },
  {
    slug: "teeth-whitening",
    name: "Teeth whitening",
    description:
      "In-clinic whitening for both arches in one visit, with sensitivity care afterwards.",
    durationMinutes: 60,
    priceEgp: 6000,
    priceUnit: "both arches",
    isPopular: true,
    sortOrder: 4,
  },
  {
    slug: "root-canal-treatment",
    name: "Root canal treatment",
    description:
      "Cleans and seals an infected tooth under local anaesthetic. Most teeth need one or two sessions.",
    durationMinutes: 60,
    priceEgp: 3500,
    priceUnit: "per session",
    isPopular: false,
    sortOrder: 5,
  },
  {
    slug: "orthodontic-consultation",
    name: "Orthodontic consultation",
    description:
      "Braces or clear aligners: we check your bite, take photos and walk you through the options.",
    durationMinutes: 30,
    priceEgp: 700,
    priceUnit: "per visit",
    isPopular: false,
    sortOrder: 6,
  },
  {
    slug: "kids-dental-check-up",
    name: "Kids dental check-up",
    description: "A gentle check for children from age 4, with fluoride if they need it.",
    durationMinutes: 30,
    priceEgp: 450,
    priceUnit: "per visit",
    isPopular: false,
    sortOrder: 7,
  },
  {
    slug: "implant-consultation",
    name: "Implant consultation",
    description: "Checks whether an implant suits you, with an X-ray review and a written quote.",
    durationMinutes: 30,
    priceEgp: 800,
    priceUnit: "per visit",
    isPopular: false,
    sortOrder: 8,
  },
];
