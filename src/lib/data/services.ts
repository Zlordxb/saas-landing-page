import "server-only";
import { cache } from "react";
import { fallbackServices, type Service } from "@/data/services";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

type ServiceRow = {
  slug: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_egp: number;
  price_unit: string;
  is_popular: boolean;
  sort_order: number;
};

const toService = (row: ServiceRow): Service => ({
  slug: row.slug,
  name: row.name,
  description: row.description,
  durationMinutes: row.duration_minutes,
  priceEgp: row.price_egp,
  priceUnit: row.price_unit,
  isPopular: row.is_popular,
  sortOrder: row.sort_order,
});

/**
 * Active services, in display order.
 * Reads Supabase when it's connected, otherwise the sample list in src/data/services.ts.
 * `cache` makes repeated calls in one request hit the database only once.
 */
export const getServices = cache(async (): Promise<Service[]> => {
  if (!isSupabaseConfigured()) return fallbackServices;

  const { data, error } = await createPublicClient()
    .from("services")
    .select(
      "slug, name, description, duration_minutes, price_egp, price_unit, is_popular, sort_order",
    )
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) {
    console.error("Could not load services from Supabase:", error?.message);
    return fallbackServices;
  }
  return (data as ServiceRow[]).map(toService);
});

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}
