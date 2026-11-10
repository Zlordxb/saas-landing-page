# Nefer Dental Studio — Design System

The visual language of the BookFlow demo. **Nefer Dental Studio is a fictional dental clinic in Cairo**, used to show BookFlow working for a real-looking business.

| | |
|---|---|
| **Direction** | Faience: turquoise glaze and porcelain white |
| **Fonts** | [Fraunces](https://fonts.google.com/specimen/Fraunces) for headlines (SOFT axis at 100), [Figtree](https://fonts.google.com/specimen/Figtree) for everything else |
| **Tokens in code** | [`design/tokens.css`](./design/tokens.css) |
| **Logo** | [`brand/nefer-mark.svg`](./brand/nefer-mark.svg), [`brand/nefer-mark-mono.svg`](./brand/nefer-mark-mono.svg) |
| **Version** | 1.0, 2026-11-10 |

## 1. The idea

*Nefer* means "beautiful" and "good" in ancient Egyptian, as in Nefertiti. The logo is that hieroglyph (a heart and windpipe) on a tile of **Egyptian faience**, the turquoise glazed ceramic of ancient Egypt. Modern dentistry works in ceramic too (crowns, veneers), so the whole brand is built from glaze and porcelain.

<img src="./brand/nefer-mark.svg" width="64" alt="Nefer Dental Studio mark">

## 2. Principles

1. **Calm over clever.** Many patients are anxious before a dental visit. Soft shapes, plain words, no surprises.
2. **Facts first.** Duration, price and its unit ("per tooth") are always visible before booking.
3. **One bold thing.** The glazed appointment card in the hero is the only loud surface. Everything else stays quiet.
4. **Accessible by default.** WCAG AA contrast in light and dark, 44px tap targets, visible keyboard focus, status never shown by color alone.

## 3. Color

### Scales

| Step | faience (brand) | neutral (porcelain → lapis) | sand (accent) | success | warning | danger |
|---|---|---|---|---|---|---|
| 50 | `#eff9f8` | `#f2f6f4` | `#fdf6eb` | `#f0faf3` | `#fff5ec` | `#fff4f2` |
| 100 | `#def2ef` | `#e6ebe9` | `#f9ebd5` | `#dff3e6` | `#fee9d5` | `#ffe6e3` |
| 200 | `#c2e5e1` | `#d4dbd9` | `#f1d9b3` | `#c4e6d0` | `#f9d5b3` | `#fed0c9` |
| 300 | `#9fd3ce` | `#b5c0bf` | `#e5c289` | `#a3d5b5` | `#f0bc8a` | `#ffb0a6` |
| 400 | `#71b8b2` | `#7f9093` | `#c79a4b` | `#78bb91` | `#dc9954` | `#f78275` |
| 500 | `#449b95` | `#62757d` | `#b38010` | `#4e9e70` | `#b86e00` | `#de594e` |
| 600 | `#0b7a74` | `#4e626e` | `#966a02` | `#1f7a4c` | `#a26209` | `#c1352e` |
| 700 | `#0b6461` | `#394f5c` | `#724f03` | `#12673e` | `#7b4907` | `#9e1e1b` |
| 800 | `#044e4e` | `#243d4b` | `#5a3e00` | `#03522e` | `#623903` | `#800f0f` |
| 900 | `#023a3b` | `#0f2b3a` | `#422d03` | `#023c21` | `#492901` | `#620406` |
| 950 | `#022628` | `#021827` | `#2d1d01` | `#022815` | `#311a01` | `#450102` |

The scales were generated in the OKLCH color space from the brand color `#0b7a74`, so every step changes lightness evenly. Neutrals are tinted toward the brand instead of plain grey.

### Semantic roles

Components never use a scale directly. They use **roles**, so a theme can change in one place.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#f2f6f4` | `#021827` | Page background (porcelain). Body text on it is ink. |
| `surface` | `#ffffff` | `#082533` | Cards, inputs, the calendar, menus. |
| `surface-muted` | `#e6ebe9` | `#153141` | Alternate section bands, table headers, hover fill for ghost buttons. |
| `line` | `#d4dbd9` | `#1e3b4a` | Hairlines: card borders and dividers. Decorative, not for form controls. |
| `line-strong` | `#7f9093` | `#62757d` | Borders of inputs, time slots and secondary buttons (3:1 against surface and bg). |
| `ink` | `#0f2b3a` | `#f2f6f4` | Primary text on bg, surface and surface-muted. |
| `ink-muted` | `#4e626e` | `#b5c0bf` | Secondary text, helper text and metadata on bg, surface and surface-muted. |
| `ink-subtle` | `#62757d` | `#7f9093` | Placeholders and disabled labels on surface only. |
| `primary` | `#0b7a74` | `#71b8b2` | The one primary action per view, selected day, active states. |
| `primary-hover` | `#0b6461` | `#9fd3ce` | Hover and pressed state of primary fills. |
| `on-primary` | `#ffffff` | `#021827` | Text and icons on primary and primary-hover fills. |
| `primary-soft` | `#def2ef` | `#023a3b` | Selected time slot fill, focus halo on inputs, soft highlights. |
| `on-primary-soft` | `#044e4e` | `#def2ef` | Text on primary-soft. |
| `link` | `#0b6461` | `#9fd3ce` | Inline links and text buttons on bg and surface. |
| `focus` | `#0b7a74` | `#9fd3ce` | Keyboard focus ring color (3:1 on bg and surface). |
| `accent` | `#c79a4b` | `#e5c289` | Sandstone decoration: rating stars, small ornaments. Never text. |
| `hero-card` | `#0b6461` | `#044e4e` | The glazed appointment card in the hero. The brand's one bold surface. |
| `on-hero-card` | `#f2f6f4` | `#f2f6f4` | Text on hero-card, and the fill of the inverse button on it. |
| `on-hero-card-muted` | `#def2ef` | `#def2ef` | Secondary text on hero-card. |
| `hero-card-line` | `#9fd3ce` | `#71b8b2` | Time-slot borders on hero-card (3:1). |
| `pending-bg` | `#fff5ec` | `#3c260e` | Pending badge fill: a booking waiting for the owner. |
| `pending-ink` | `#623903` | `#f9d5b3` | Pending badge text, on pending-bg. |
| `confirmed-bg` | `#f0faf3` | `#12301e` | Confirmed badge and success message fill. |
| `confirmed-ink` | `#03522e` | `#c4e6d0` | Confirmed badge and success text, on confirmed-bg. |
| `cancelled-bg` | `#e6ebe9` | `#153141` | Cancelled badge fill. Deliberately quiet: cancelled needs no attention. |
| `cancelled-ink` | `#394f5c` | `#b5c0bf` | Cancelled badge text, on cancelled-bg. |
| `danger` | `#9e1e1b` | `#ffb0a6` | Error text and invalid input borders on bg and surface. |
| `danger-fill` | `#c1352e` | `#f78275` | Destructive button fill (Cancel booking in the dashboard). |
| `on-danger` | `#ffffff` | `#021827` | Text on danger-fill. |
| `danger-soft` | `#fff4f2` | `#3f1917` | Error message fill; danger text reads on it. |
| `demo-bg` | `#f9ebd5` | `#3a2b11` | The demo-project notice bar. |
| `demo-ink` | `#5a3e00` | `#f9ebd5` | Text on demo-bg. |

### Contrast

Every text role passes **4.5:1** on the backgrounds named in its "Use" column, in **both** themes. Input borders, icons and the focus ring pass **3:1**. This was checked with a script, not by eye: the first draft failed twice (placeholder text at 4.17:1 and input borders at 2.90:1), and both colors were darkened until they passed.

## 4. Typography

Sizes follow the classic typographic scale: 12, 14, 16, 18, 21, 24, 36, 48, 72.

| Style | Font | Size / line height | Weight | Use |
|---|---|---|---|---|
| `display` | Fraunces | 72px / 76px | 400 | The landing page hero headline only. 48px / 52px under 640px. |
| `h1` | Fraunces | 48px / 54px | 400 | Page titles (Services, Book an appointment). 36px / 42px under 640px. |
| `h2` | Fraunces | 36px / 42px | 400 | Section headings on the landing page. 24px / 30px under 640px. |
| `h3` | Fraunces | 24px / 30px | 500 | Card titles: services, the appointment card, FAQ groups. |
| `title` | Figtree | 21px / 28px | 600 | Step titles in the booking flow, dashboard panel titles. |
| `lead` | Figtree | 18px / 29px | 400 | Intro paragraph under a page or section heading. |
| `body` | Figtree | 16px / 26px | 400 | Default text. Inputs use 16px too, so phones never zoom in. |
| `button` | Figtree | 16px / 24px | 600 | Button labels (14px on small buttons). |
| `label` | Figtree | 14px / 20px | 500 | Form labels, time slots, table headers, nav links. |
| `small` | Figtree | 14px / 22px | 400 | Helper text, card descriptions, footer text. |
| `caption` | Figtree | 12px / 16px | 500 | Badges, calendar weekday names, timestamps. |

- Keep running text under 65 characters per line.
- Times, prices and phone numbers use tabular numbers, so they line up.
- Keep a headline in one color and one style: don't highlight a single word.

## 5. Layout, spacing, shape and depth

| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Icon to label gap. |
| `space-2` | 8px | Between time slots and badge groups. |
| `space-3` | 12px | Between a label, its input and its help text; related rows. |
| `space-4` | 16px | Input padding, compact card padding. |
| `space-5` | 20px | Page side gutter on phones. |
| `space-6` | 24px | Card padding, gap between cards. |
| `space-8` | 32px | Page side gutter on desktop, gap between form groups. |
| `space-12` | 48px | Space between a section heading and its content. |
| `space-16` | 64px | Vertical padding of a page section on phones. |
| `space-28` | 112px | Vertical padding of a page section on desktop. |
| `radius-sm` | 8px | Checkboxes, small tags, tooltips. |
| `radius-md` | 12px | Inputs, selects, textareas, alerts. |
| `radius-lg` | 20px | Cards: services, calendar, dashboard panels. |
| `radius-xl` | 28px | The hero appointment card and photos. |
| `radius-full` | 9999px | Buttons, time slots, badges, calendar days. |
| `control-sm` | 40px | Small buttons, calendar days, dashboard actions. |
| `control-md` | 48px | Default buttons and inputs. |
| `control-lg` | 56px | The hero call to action. |
| `touch-target` | 44px | Minimum tap area for anything interactive, time slots included. |
| `container` | 1200px | Max width of page content. |
| `prose` | 65ch | Max width of running text. |

- **Shadows** are tinted with lapis ink and only mean "this floats": `shadow-md` on a hovered card, `shadow-lg` on the hero card and dialogs. Cards at rest use a 1px `line` border.
- **Radius grows with size**: controls 12px, cards 20px, the hero card and photos 28px, pills for buttons, time slots and badges.

## 6. Motion

- One easing curve, `--ease-glaze: cubic-bezier(0.22, 1, 0.36, 1)`, and three durations: 150ms (hover, press), 250ms (step changes), 500ms (the hero card, once).
- **One orchestrated moment**: the hero appointment card rises 12px and fades in on page load. Everything else moves only when the person does something.
- With "reduce motion" turned on, movement is removed.

## 7. Components

| Component | What it is | Key rules |
|---|---|---|
| Button | Pill button whose label says what happens | One `primary` per view; secondary, soft, ghost, danger, inverse variants; 40 / 48 / 56px |
| TextField | Label, input, then help or error | Label always visible; 16px text; error under the field, linked with `aria-describedby` |
| TimeSlots | Free start times, grouped Afternoon / Evening | Only free times are shown; selected = `primary-soft` + `aria-pressed` |
| Calendar | Month grid for choosing the day | Weeks start Saturday; Fridays, past days and days after the 30-day window are disabled |
| ServiceCard | Name, description, duration, price and unit | Book button is secondary; price always shows its unit |
| AppointmentCard | The glazed hero card with the next free times | The brand's one bold surface; used once per page |
| StatusBadge | Pending, Confirmed, Cancelled | Word plus color; Pending is loudest, Cancelled is quiet |
| Alert | Page-level message | What happened, then what to do; no apology |
| DemoNotice | Sandstone bar: "this clinic is fictional" | On every public page of the demo |
| Navbar | Logo, three links, Book button | Sticky; links collapse into a menu under 768px |
| BookingRow | One booking in the dashboard | Actions depend on status; Cancel always asks first |
| StatTile | A number that starts the owner's day | At most three; no decoration |

## 8. Voice and copy

- Write like a calm dentist: plain, specific, reassuring. "You" for the patient, "we" for the clinic.
- Sentence case. No exclamation marks, emoji or hype words.
- Patients see "appointment"; the dashboard says "booking".
- Formats: `4:30 PM`, `Sat 14 Nov`, `EGP 1,200`, `BF-7K2Q9X`, `010 0000 0001`.
- Buttons: "Book an appointment", "Choose this time", "Confirm booking".
- Errors: "This time was just booked. Pick another time below."

## 9. Accessibility checklist

- [ ] Text contrast 4.5:1, borders, icons and focus ring 3:1, in light and dark
- [ ] Visible focus ring (`--focus-ring`) on every interactive element
- [ ] Tap targets of 44px or more
- [ ] Inputs at 16px, labels always visible, errors linked to their field
- [ ] Status shown with words, not color alone
- [ ] Respects "reduce motion"
