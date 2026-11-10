# BookFlow — Roadmap

How we build BookFlow, one phase at a time.

**Legend:** ✅ done · 🟡 in progress · ⬜ not started

| Phase | What we build | Status |
|:-----:|---------------|:------:|
| 0 | Dev environment | ✅ |
| 1 | Planning (PRD) | ✅ |
| 2 | Design system | ✅ |
| 3 | Project setup + Git & GitHub | 🟡 install the libraries |
| 4 | Layout & UI components | ✅ |
| 5 | Landing page + animations | ✅ |
| 6 | Services page | ✅ |
| 7 | Supabase & database | 🟡 connect a project |
| 8 | Booking flow + form validation | ✅ |
| 9 | Admin dashboard | ✅ |
| 10 | Polish & testing | 🟡 |
| 11 | Deployment | ⬜ |
| 12 | README & LinkedIn | 🟡 |

---

## Phase 0 — Dev environment ✅
- [x] Node.js, Git, VS Code
- [x] Git identity, GitHub account, first push

## Phase 1 — Planning ✅
- [x] [PRD.md](./PRD.md): goals, users, MVP scope, user stories, sitemap, flows, booking rules, data model

## Phase 2 — Design system ✅
- [x] Brand: Nefer Dental Studio, the nfr hieroglyph on a faience tile
- [x] Colors with WCAG AA contrast in light and dark, type scale, spacing, radius, shadows, motion
- [x] Components and landing page wireframe → design
- Output: [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md), [design/tokens.css](./design/tokens.css), [brand/](./brand/)

## Phase 3 — Project setup 🟡
- [x] Scaffolded with create-next-app (Next.js 16.4.6, TypeScript strict, Tailwind CSS 4, ESLint)
- [x] Aligned with BookFlow: scripts, Prettier, Vitest, `.env.example`, `AGENTS.md`, Cache Components off
- [ ] Install the project libraries (Supabase, Zod, React Hook Form, Motion, Lucide, Vitest, Prettier)

## Phase 4 — Layout & UI components ✅
- [x] Root layout with next/font (Fraunces + Figtree), design tokens in Tailwind (`@theme`)
- [x] Navbar with mobile menu, footer, demo notice
- [x] Button, Container, StatusBadge, Alert

## Phase 5 — Landing page ✅
- [x] Hero with a live appointment card, facts, popular treatments, why us, steps, doctor, reviews, FAQ, call to action
- [x] One entrance animation, reduced-motion support

## Phase 6 — Services page ✅
- [x] All services with duration, price and unit; sample data until Supabase is connected

## Phase 7 — Supabase & database 🟡
- [x] Schema, constraints, exclusion constraint against double bookings, RLS policies, seed (`supabase/migrations/`)
- [x] Tested on PostgreSQL 16: overlap rejected, visitors can't read bookings, owner can change only the status
- [x] Server, public and admin clients; `proxy.ts` protects `/admin`
- [ ] Create or choose a Supabase project, run the migrations, add keys to `.env.local`

## Phase 8 — Booking flow ✅
- [x] Free-time algorithm with unit tests (time zones, buffer, notice, closing time)
- [x] `/api/slots`, four-step wizard, keyboard calendar, Zod + React Hook Form
- [x] Server Action re-validates and re-checks; handles "time just taken"
- [x] Confirmation page with reference and Google Calendar link

## Phase 9 — Admin dashboard ✅
- [x] Owner login, protected routes, stats, filters in the URL, search, confirm and cancel

## Phase 10 — Polish & testing 🟡
- [x] SEO: titles, descriptions, sitemap, robots, favicon
- [x] Accessibility basics: labels, focus, contrast, keyboard calendar
- [x] Redesign: real photos (Unsplash) in faience-tile frames, Treatments mega menu, dropdowns, live opening status, menu-style price list, interactive shade guide, evening band with live times, studio lightbox, reviews pager, drawn Zamalek map, services filters and sort, add-to-calendar (.ics)
- [x] Opening-hours logic covered by unit tests
- [ ] Lighthouse run on the deployed site, Open Graph image, real photos
- [ ] Later: move to Cache Components (`cacheComponents: true`, `"use cache"`, `<Suspense>`)

## Phase 11 — Deployment ⬜
- [ ] Import the GitHub repo in Vercel, add the environment variables, test the live site

## Phase 12 — README & LinkedIn 🟡
- [x] Professional README
- [ ] Screenshots, demo GIF, LinkedIn post
