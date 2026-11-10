import type { Service } from "@/data/services";

/**
 * How treatments are grouped in the menu and on the services page.
 * Grouping lives here (not in the database) so it can change without a migration.
 */
export type TreatmentGroup = {
  id: string;
  title: string;
  /** One line under the group title in the Treatments menu. */
  text: string;
  slugs: string[];
};

export const treatmentGroups: TreatmentGroup[] = [
  {
    id: "everyday",
    title: "Everyday care",
    text: "Check-ups, cleaning and repairs",
    slugs: [
      "check-up-and-consultation",
      "scaling-and-polishing",
      "tooth-colored-filling",
      "kids-dental-check-up",
    ],
  },
  {
    id: "smile",
    title: "Smile and straightening",
    text: "Whitening, braces and aligners",
    slugs: ["teeth-whitening", "orthodontic-consultation"],
  },
  {
    id: "repair",
    title: "Repair and replace",
    text: "Root canals and implants",
    slugs: ["root-canal-treatment", "implant-consultation"],
  },
];

/** The group a service belongs to. New services from Supabase land in "Everyday care". */
export function groupIdFor(slug: string): string {
  return treatmentGroups.find((group) => group.slugs.includes(slug))?.id ?? "everyday";
}

/** Services split into the groups above, keeping each group's order. */
export function groupServices(services: Service[]) {
  return treatmentGroups
    .map((group) => ({
      ...group,
      services: services.filter((service) => groupIdFor(service.slug) === group.id),
    }))
    .filter((group) => group.services.length > 0);
}
