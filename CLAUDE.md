# Private Language School "Lexicon" Starter — project rules

A one-page booking website for a private language school run by one teacher who teaches one student
at a time at one studio, shipped as **Parole French Studio** (a fictional French studio in New
Orleans: a free placement conversation, a French lesson, conversation practice, a pronunciation
clinic, exam preparation (DELF · DALF · TCF) and French for work — one student and one lesson per
booking, in person at one fixed address) for the owner to make their own. Its identity lives in
`src/site.config.ts`; `CUSTOMIZE.md` is the prompt that personalizes it. Built around
**@profitstudio/booking-engine** **2.0.0** (pinned; lock in `booking-engine.lock.json`). The
engine owns booking; this project owns the public design.

Read before changing anything:
- `BOOKING_ENGINE.md` — the engine's rules (engine-owned; `npx booking-engine sync` replaces it).
- `node_modules/@profitstudio/booking-engine/docs/INTEGRATION.md` — the full contract. It wins on technical points.
- `DESIGN.md` — the visual system. `PHOTOS.md` — photo sources and licences.

## The Live Demo layer — leave it alone

- `src/demo/` is the public Live Demo's in-browser engine and sample data. Only
  `npm run dev:demo` / `npm run build:demo` use it (`vite --mode demo` defines
  `__BOOKING_DEMO__`); in every other build it is compiled out. Never read, edit
  or "fix" it while customizing the website.
- Keep the `__BOOKING_DEMO__ ? … : …` branches as they are: the demo wording
  (no email is sent) must stay true in the demo, and the real wording in production.
- `src/demo/engine/` is vendored from the Niche Pack workspace — edit it there.
- `src/admin-main.tsx` passes `emailDelivery={__BOOKING_DEMO__ ? 'none' : undefined}`:
  only the demo's dashboard says no email is sent. Never set it on a real site.

## Engine boundaries (from BOOKING_ENGINE.md)

- All booking data goes through the ONE instance in `src/lib/engine.ts`. Never import
  `@supabase/supabase-js` for booking data, call `booking_*` RPCs or write SQL for booking tables.
- Never edit `supabase/migrations/*_booking_engine_*.sql`, `supabase/functions/booking-mailer/`,
  `booking-engine.lock.json` or `node_modules`.
- Only the publishable key may reach the website (`VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`,
  both or neither). Never a secret/`service_role` key, never an email provider key, in any file or `VITE_` variable.
- Show only the slots `getAvailability()` returns; send `slot.startsAt` back unchanged; show dates and
  times in `business.timezone`. Never compute availability in the browser — the calendar only reshapes
  engine data with the engine's helpers (`monthGrid`, `groupSlotsByPartOfDay`, `isFewLeft`, `nextAvailableDay`…).
- Label slot times with the server's business-local `slot.time` / `confirmation.time` via `formatClockTime`.
- Book in two steps: `requestBooking()` → code step → `verifyBooking()`. "Send a new code" =
  `resendVerificationCode()`; "Choose another time" = await `cancelBookingRequest()`, then reload availability.
- Handle `ok: false` on every call. Show success only after `verifyBooking()` returned `ok: true`
  (pending → "Request received — we'll check the calendar and confirm the time shortly.",
  confirmed → "Your lesson is booked."). Preview answers `PREVIEW_MODE`: say so honestly, never a success screen.
- Read the engine's answer strictly (`src/lib/bookingStatus.ts`): say "booked" only when `status === 'confirmed'`
  and "request received" only when it is `'pending'` — never treat "not pending" as booked. `BOOKING_INACTIVE`
  (the code was accepted earlier, but the request was declined, cancelled or not confirmed in time) is never a
  success: show "This request is no longer active. Please choose a new time or contact the business." with the
  reference, go back to the times, and forget the remembered code so no recovery path verifies it again.
- `business.policies.onlineBookingEnabled === false` (or `BOOKING_DISABLED`) → contact details instead of the flow.
- The engine sends every booking email. Never add an email service to the website.
- Keep the packaged dashboard on `/admin/` (`admin/index.html` → `src/admin-main.tsx`). Never fork or restyle it:
  `src/admin-theme.css` sets only `--pbe-accent` / `--pbe-accent-text` per mode.

## What the engine does not do — never fake it

**One booking = one lesson: a reserved block of the one teacher's time, for ONE student, for one
kind of lesson, on one calendar, in person at the studio's fixed address.** Its length is the time
at the table; the buffer after it is the teacher's notes. Prices are paid at the studio — never
online, no deposits. Bookings confirm on the code (`autoConfirm: true` in the preset); the owner may
switch to reviewing requests in the dashboard, and the flow then says "request".

**One to one, in person.** There are no group classes, conversation clubs, capacities, "spots left",
waitlists, second teachers or online lessons on this site. The engine's booking emails print the
studio's address as the place of every lesson and carry no meeting link, so never offer a video or
phone lesson, never promise or generate a meeting link, and never imply two students can share one
booking.

**One lesson, not a course.** Two lessons are two bookings — never present them as a course, a term,
a package, a block of ten or a combined price. A weekly student books each lesson ("most students
book a few weeks ahead"); nothing recurring is created.

**Kinds are read from names.** "Placement Conversation", "French Lesson", "Conversation Practice",
"Pronunciation Clinic", "Exam Preparation (DELF · DALF · TCF)" and "French for Work" are ordinary
engine services; the website only reads their KIND (intro · exam · pronunciation · conversation ·
work · travel · lesson, in that test order) from the words in the name (`src/lib/services.ts`) — to
group the booking sheet (not sure of your level? · lessons), to list the placement conversation first
and to label each entry on the price list. "Where are you on the scale?" links each level to a lesson
with `serviceFor` (the exact name, else a name containing the owner's words from the start of a word,
else the first lesson of the kind the words name; with none, no Book button). Its Book writes
`Level (my own guess): B1 — Intermediate` into the booking note.

**Honest teaching.** Never promise or imply a level, fluency, a pace ("fluent in 12 weeks"), an exam
result, a score, a pass rate or a certificate. Levels are the visitor's own guess — the teacher finds
the level with them in the placement conversation; the page names the CEFR steps (A1–C2) only to
describe what each sounds like. The studio prepares students for an exam's format; it is not an exam
centre and registers nobody — candidates book their exam with the official centre (the FAQ says so).
Never invent the teacher's name, degrees, teaching certificates, nationality or "native speaker"
status, years of teaching, schools, reviews or testimonials. The *Good for:* line names a situation
("a test date already booked") — never an outcome. Every stock photo is labelled and never presented
as the teacher, the studio or a student.

**Students under 18.** A parent or guardian books with their own name, email and phone and receives
every email; they are welcome to sit in. The booking form asks for a name, an email and an optional
phone number — nothing else. The notes field is **Anything we should know (optional)** with the
helper "For example your level (a guess is fine), what you want French for, or an exam date. Booking
for someone under 18? Add their first name. Please don't include health or other sensitive details."
Never add a field for a date of birth, school, school reports, test scores, documents or uploads.

**The language taught.** Headwords, pronunciations, level sentences and usage examples are written in
the taught language and carry its `lang` (`brand.language`, validated in `src/lib/lang.ts`;
pronunciations as `<lang>-fonipa`). Keep each example natural and correct — check it with a good
dictionary or a speaker when you change it.

A new booking feature needs a new engine version — never custom database code or browser-side logic:

- group classes, capacities, waitlists, several teachers or rooms;
- online lessons with a per-service location or a meeting link;
- linked or recurring bookings, courses, terms, packages, memberships or gift cards;
- deposits, cancellation fees or any online payment;
- student accounts, progress records, placement tests, homework or file uploads.

Proposed engine work: `docs/ENGINE-PROPOSAL-language-school.md` in the Niche Pack workspace.

## Where things live

| What | Where |
|---|---|
| Engine instance (preview: name, `America/Chicago`, placeholder contact) | `src/lib/engine.ts` |
| This site's preset (sample lessons, hours, policies; "students"/"lessons") — also the dashboard's starter set | `src/lib/preset.ts` (`sitePreset`) |
| Kind from the name, its label (`KIND_LABEL`), page order (`indexOrder`), booking-sheet groups (`kinds`), `serviceFor` (words → lesson), "Good for:" parsing, length and price terms | `src/lib/services.ts` |
| The taught language's `lang` and the thumb-index letter | `src/lib/lang.ts` |
| What the owner can edit (every text and photo — name, descriptor, language code, every section's entry (headword · pronunciation · gloss), hero (headline, sentence, buttons, photo), the levels (code, name, can-do, example, English, lesson, the placement line, photo), the price list's words, how lessons go (principles with examples, photo), the studio (text, who for, under 18, photo), questions & policies, booking words and photo, studio note and photo, logo, accent colour) | `src/content/site.ts` (`defineSiteContent`) |
| Content store + brand → CSS variable (`--accent`) | `src/lib/content.ts` |
| Design tokens — the ONLY file with raw colours, fonts, sizes, spacing (and the thumb index) | `src/styles/tokens.css` |
| Base / page / booking styles (tokens only) | `src/styles/base.css`, `site.css`, `booking.css` (note: booking.css owns `.sheet` (the booking dialog), `.rail`, `.parts`, `.part`, `.pick`, `.time`, `.summary`, `.step-title` — the page uses its own names: `.entry`, `.thumb`, `.headword`, `.senses`, `.facts`, `.scale`, `.step-tab`, `.level`, `.suggest`, `.dict`, `.lex`, `.usage`, `.use`, `.pills`, `.fore-edge`) |
| Sections | `src/components/*.tsx` (Header, Hero `#top` (the entry, live facts, open now, the photo), Levels `#levels` (the scale as a tab list + the suggestion card), Services `#lessons` (the dictionary page), Method `#method`, Studio `#studio`, GoodToKnow `#questions`, BookingSection `#book`, Visit `#visit`, Footer (the name on the fore-edge)); entries and thumb tabs `Entry.tsx`, the mark `Mark.tsx` (a book with one tab), emphasis `Emphasis.tsx`; scroll reveals `src/lib/reveal.ts` (`data-reveal`); the section list for header, phone menu and footer is `src/lib/nav.ts` |
| Booking sheet (a modal `<dialog>` at `#book`; Back/Esc/✕ close it) + the `#book` band | `src/App.tsx` (open/close + history, `startBooking(serviceId, note)`), `src/components/booking/BookingSheet.tsx`, `BookingSection.tsx`, `src/lib/dialog.ts` |
| Booking flow | `src/components/booking/` (BookingFlow = state + engine calls, root `#book-flow`; DayPicker, TimePicker, DetailsForm, CodeStep, Summary, Done) |
| "Open now" + hours changes | `src/lib/useOpening.ts`, `src/lib/hours.ts` |
| Photo variant map | `public/photos/`, `src/content/photoVariants.ts` (generated by `concepts/language-school-lexicon/photo-pipeline/photos.mjs`) |
| Content baked into `index.html` at build | `vite.config.ts` (`publishedSiteContent`) |

## Rules for future changes

- **Content fields:** render values as text (never `dangerouslySetInnerHTML`), images from the resolved
  `src`/`alt`. Never rename or reuse a field id on a live site — add a new id. Lessons, prices,
  lengths, hours, the address, phone and email are NOT content: they come from the engine.
- `src/content/site.ts` is also imported by `vite.config.ts` (Node): keep it free of local imports.
- **Every Book button** calls `startBooking()` (App): it opens the sheet, or — while online booking is off,
  unconfigured or failing — leads to the `#book` section and its contact details. An entry's, a fact's
  or a level's Book passes THAT service's engine id — never a stored price or id.
- **Lengths and prices:** always from the engine (`minutesLabel`, `durationLabel`, `priceLabel`, `priceTerms`).
  Never hard-code a service, length, price or id in copy (questions, levels and principles included).
- **Sample photos:** every photo carries a "Sample photo" label until the owner replaces that field
  (`ownerFields`). Never present a stock photograph as the teacher, the studio or a student.
- **Default photos:** add variants to `public/photos/` via the photo pipeline, keep the default `src`
  in `site.ts` equal to a key in `photoVariants.ts`, record the source in `PHOTOS.md`. If the
  first-screen default changes, update the `<link rel="preload">` in `index.html` (`imagesizes` must
  match `HERO_SIZES` in `src/components/Hero.tsx`).
- **Policies:** Questions shows a "Sample policies" label until the owner edits `faq.items`.
- **Copy:** short, calm, exact — a sentence where one will do. No "fluent fast", "guaranteed",
  "certified", "native-speaker teachers", "100 % pass rate", no pressure, no promised outcomes, no fake
  urgency, no invented scarcity.
- **Style:** plain CSS with the tokens; no UI kit. 44 px tap targets, visible focus, the
  `prefers-reduced-motion` path, every text/background pair at 4.5:1 (`contrast.mjs` in the concept
  folder). The accent is owner-editable and is a DEEP colour that always carries white text (the editor
  checks 4.5:1 against white): main buttons, pronunciations and italic words (small red text on paper
  through `--accent-ink`, on ink through `--accent-on-ink`), sense numbers, the footer's thumb tabs, the
  chosen level, day and time. The paper pages and ink bands are fixed.
- **Composition (DESIGN.md):** India paper, blue-black ink, one accent (rubric red); Noto Serif Display —
  condensed and heavy for headwords, regular for headings, italic for pronunciations and emphasis —
  with Noto Sans; the thumb index as the one ornament; every section opens with its entry; every
  section inside the one centred shell (`.shell`, `--page-max`). The first screen on wide screens is
  exactly one screen tall. Motion — entries rising, the scale's mark riding, the level settling — is
  off under `prefers-reduced-motion`; never hide content without `html.js-reveal`.
- The public site stays one page (sections + in-page booking flow); no client-side path routes.

## Commands

```bash
npm run dev                              # http://localhost:5361 (preview mode without a backend)
npm run build                            # tsc -b && vite build (multi-page: / and /admin/)
npm run lint                             # oxlint (supabase/functions is ignored)
npm run dev:demo                         # the Live Demo: in-browser engine + dashboard, nothing sent
npm run build:demo                       # the public Live Demo build — never the production site
npx booking-engine doctor                # project check
npx booking-engine doctor --dist dist    # after a build: scans the output for secrets
```

Connecting a backend (Supabase, email) follows INTEGRATION.md §11 — only with the owner's go-ahead.
