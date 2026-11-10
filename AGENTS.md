# BookFlow: notes for AI coding agents

BookFlow is a booking website for service businesses. The demo client is **Nefer Dental Studio**, a fictional dental clinic in Cairo. Read `docs/PRD.md` (what we build) and `docs/DESIGN-SYSTEM.md` (how it looks) before changing behaviour or UI.

## Stack

Next.js 16.4 (App Router, `src/` directory, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS 4 (Turbopack loader) · Supabase (Postgres, Auth, RLS) · Zod 4 · React Hook Form · Motion · Vitest.

Cache Components is **off** (`next.config.ts`). The app uses the previous caching model: route segment config (`export const revalidate`, `export const dynamic`). Don't enable `cacheComponents` without migrating those pages first.

## Commands

- `npm run dev`: dev server on http://localhost:3000 (works without Supabase, on sample data)
- `npm run build`: production build, including the TypeScript check
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run format`

## Where things live

- `src/config/clinic.ts`: business settings and booking rules (hours, slot length, buffer, window, notice). Change rules here, nowhere else.
- `src/lib/booking/`: pure booking logic (`slots.ts`, `time.ts`) with unit tests. Keep it free of React and database code.
- `src/lib/supabase/`: `server.ts` (owner session, RLS applies), `public.ts` (public reads), `admin.ts` (secret key, server only).
- `src/actions/`: Server Actions (`booking.ts` creates bookings, `admin.ts` signs in and updates status).
- `src/app/api/slots/route.ts`: free times as JSON for the booking UI.
- `src/components/`: `ui/` primitives, `site/` chrome, `landing/`, `services/`, `booking/`, `admin/`.
- `src/content/home.ts`: home page copy. `src/data/services.ts`: sample services (keep in sync with the seed migration).
- `supabase/migrations/`: schema, RLS policies and seed data.

## Rules

- Style with the role tokens from `src/app/globals.css` (`bg-surface`, `text-ink-muted`, `bg-primary`…). Never hard-code hex colours in components.
- Don't put two utilities that set the same CSS property on one element (e.g. `border-transparent` and `border-line-strong`): give each variant its own value.
- Keep text contrast at WCAG AA (4.5:1) and keep visible focus styles.
- All times are computed in the clinic's time zone (`Africa/Cairo`) with the helpers in `src/lib/booking/time.ts`. Store instants as ISO strings / `timestamptz`. In components, use `todayInZone()` rather than calling `new Date()` during render.
- The secret key is used only through `createAdminClient()` in server code (`server-only`). Never import it into a Client Component, never prefix it with `NEXT_PUBLIC_`.
- Validate input with the Zod schemas in `src/lib/validation/` on the client and again on the server.
- Double bookings are prevented by the `bookings_no_overlap` exclusion constraint. Don't remove it; handle error code `23P01` as "slot taken".
- Copy: sentence case, plain words, no exclamation marks or emoji. Patients see "appointment"; the dashboard says "booking".

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
