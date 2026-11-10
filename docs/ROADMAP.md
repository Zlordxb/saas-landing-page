# BookFlow — Roadmap

How we build BookFlow, one phase at a time. Every phase ends with something that works and a Git commit.

**Legend:** ✅ done · 🟡 in progress · ⬜ not started

| Phase | What we build | Status |
|:-----:|---------------|:------:|
| 0 | Dev environment | 🟡 |
| 1 | Planning (PRD) | ✅ |
| 2 | Design system | ⬜ |
| 3 | Project setup + Git & GitHub | ⬜ |
| 4 | Layout & UI components | ⬜ |
| 5 | Landing page + animations | ⬜ |
| 6 | Services page | ⬜ |
| 7 | Supabase & database | ⬜ |
| 8 | Booking flow + form validation | ⬜ |
| 9 | Admin dashboard | ⬜ |
| 10 | Polish & testing | ⬜ |
| 11 | Deployment | ⬜ |
| 12 | README & LinkedIn | ⬜ |

---

## Phase 0 — Dev environment
**Goal:** a computer ready for professional web development.
- Install VS Code (+ extensions), Git and Node.js (LTS)
- Set up Git: name, email, default branch `main`
- Create a GitHub account

**You'll learn:** the terminal, what Node.js and npm are, what Git is.

## Phase 1 — Planning ✅
**Goal:** know exactly what we're building before we write any code.
- [PRD.md](./PRD.md): goals, users, MVP scope, user stories, sitemap, user flows, booking rules, data model, validation rules, tech stack

**You'll learn:** PRD, MVP, MoSCoW, user stories, acceptance criteria, sitemap, user flows.

## Phase 2 — Design system
**Goal:** a premium, consistent look before we build pages.
- Clinic name, logo and brand personality
- Color palette (brand, neutrals, success / warning / error) with accessible contrast
- Fonts and type scale, spacing, corner radius, shadows
- How buttons, inputs, cards and badges look
- Landing page layout: wireframe, then design

**Output:** `docs/DESIGN-SYSTEM.md` + a visual style guide
**You'll learn:** design tokens, color basics, type scale, visual hierarchy, contrast.

## Phase 3 — Project setup
**Goal:** a clean Next.js project, saved on GitHub.
- `create-next-app` with TypeScript, Tailwind CSS, ESLint and the App Router
- Folder structure, Prettier, import aliases
- Design tokens inside Tailwind
- `git init`, first commits, push to a new GitHub repository

**You'll learn:** npm and `package.json`, how a Next.js project is organized, the App Router, Git basics (`add`, `commit`, `push`).

## Phase 4 — Layout & UI components
**Goal:** reusable building blocks.
- Root layout, fonts, metadata
- Navbar (with a mobile menu) and footer
- UI components: Button, Container, Section, Card, Badge, Input...

**You'll learn:** React components, props, JSX, TypeScript types, Server vs Client Components, responsive design with Tailwind.

## Phase 5 — Landing page
**Goal:** a landing page that makes people want to book.
- Every section from the PRD, from the hero to the footer
- Subtle animations: elements appearing on scroll, hover effects

**You'll learn:** building pages from components, rendering lists from data, `next/image`, animations, accessibility basics.

## Phase 6 — Services page
**Goal:** all services with prices and details.
- Service cards: name, description, duration, price, Book button
- Mock data in a TypeScript file first

**You'll learn:** TypeScript types, `.map()` to render lists, links with query parameters.

## Phase 7 — Supabase & database
**Goal:** real data in a real database.
- Create the Supabase project
- Tables `services` and `bookings`, constraints, seed data
- Row Level Security policies
- Connect Next.js: environment variables, Supabase client, generated types
- The services page reads from the database

**You'll learn:** SQL basics, primary and foreign keys, constraints, RLS, environment variables, fetching data on the server.

## Phase 8 — Booking flow
**Goal:** patients can book an appointment.
- Multi-step booking: service, date, time, details, review
- The available-slots logic (working hours, duration, buffer, existing bookings)
- Zod schema + React Hook Form; the server re-validates with a Server Action
- Double-booking protection inside the database
- Confirmation page with the reference

**You'll learn:** React state, forms, validation, Server Actions, dates and time zones, race conditions.

## Phase 9 — Admin dashboard
**Goal:** the owner manages all bookings.
- Login with Supabase Auth; protected pages
- Bookings list with filters and search; stats cards
- Confirm and cancel actions

**You'll learn:** authentication, sessions and cookies, protecting routes, updating data, optimistic UI.

## Phase 10 — Polish & testing
**Goal:** production quality.
- Test on real phones; accessibility pass; loading, error and 404 states
- SEO (metadata, Open Graph image, sitemap, robots) and performance (Lighthouse)

**You'll learn:** Lighthouse, browser DevTools, SEO basics, edge cases.

## Phase 11 — Deployment
**Goal:** BookFlow is live on the internet.
- Deploy to Vercel from GitHub; production environment variables; test the live site

**You'll learn:** CI/CD basics, development vs production environments, preview deployments.

## Phase 12 — README & LinkedIn
**Goal:** show your work and get noticed.
- Professional README: screenshots, features, tech stack, how to run it
- Demo GIF or video, LinkedIn post

**You'll learn:** presenting a project, writing a short case study.

