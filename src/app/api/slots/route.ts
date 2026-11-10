import { NextResponse, type NextRequest } from "next/server";
import { getAvailability } from "@/lib/booking/availability";
import { isValidDateString } from "@/lib/booking/time";
import { getServiceBySlug } from "@/lib/data/services";

/**
 * GET /api/slots?service=<slug>&date=<YYYY-MM-DD | next>
 * Returns the free start times for a service. Used by the booking flow and the hero card.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const slug = params.get("service") ?? "";
  const date = params.get("date") ?? "next";

  if (date !== "next" && !isValidDateString(date)) {
    return NextResponse.json({ error: "Use a date like 2026-11-14." }, { status: 400 });
  }

  const service = await getServiceBySlug(slug);
  if (!service) {
    return NextResponse.json({ error: "This service doesn't exist." }, { status: 404 });
  }

  try {
    const availability = await getAvailability({ durationMinutes: service.durationMinutes, date });
    return NextResponse.json(availability, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Free times couldn't be loaded." }, { status: 500 });
  }
}
