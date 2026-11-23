# Private Language School Booking Website — "Lexicon" Starter

A finished, premium booking website for a private language school run by one teacher, one student at
a time, ready to make your own with Claude Code and publish on Hostinger. It ships as **Parole
French Studio**, a fictional French studio in New Orleans:

- a one-page website built like a good **bilingual dictionary**: every section opens on an entry — a
  headword in the language taught, its pronunciation in red italic and a short gloss — and carries a
  thumb-index tab cut into the page's edge. A first screen that *is* an entry ("**parler** /paʁ.le/
  verb — 1 to speak. 2 What you'll do from your *first lesson.*"), **Book a lesson** and live facts
  (the free placement conversation, lessons from the lowest price, open now) beside a tall photograph;
  **where are you on the scale?** — six levels (A1–C2) on an ink band, each with what you can do, a
  sentence at that level and its English, and the lesson that fits with its live length and price
  (Book writes your level into the note); **lessons & prices** set as a two-column dictionary page;
  how lessons go, with usage examples; the studio over a wide photograph; short questions (sample
  policies, labelled); booking; visit; the name set huge on the book's fore-edge in the footer — from
  320 px phones to ultrawide;
- online booking — **one lesson per booking** (one student, one kind of lesson), a day and time,
  contact details and an optional note, and an emailed 6-digit code;
- the owner dashboard at `/admin/` — lessons, services and prices, hours and closures, email health,
  and the website's own text, photos and accent colour.

The look — *Lexicon*: India-paper pages and blue-black ink bands, one rubric red (owner-editable) that
carries white text; Noto Serif Display — condensed and heavy for headwords, regular for headings,
italic for pronunciations — with Noto Sans; one ornament, the thumb index.

Booking runs on [`@profitstudio/booking-engine`](https://www.npmjs.com/package/@profitstudio/booking-engine)
**2.0.0-beta.4** (pinned) with your own Supabase project and Resend for email.

## 1. Try it (no accounts needed)

```bash
npm install
npm run dev:demo   # the full Live Demo: book, then manage it at /admin/
npm run dev        # preview mode: the website with sample times, nothing saved
```

In the Live Demo everything stays in your browser — nothing is sent anywhere.

## 2. Make it yours with Claude Code

Open this folder in a Claude Code session and paste the prompt in
[`CUSTOMIZE.md`](CUSTOMIZE.md), filled in with your school. Claude edits a short list of files
(name, city, words, colours) — the booking system, the dashboard and the layout stay as they are.

**Teaching another language?** Every headword, pronunciation, gloss, level sentence and usage example
is a field in the dashboard → Website, and *Language code* (Brand) tells screen readers which language
they are in. Spanish, German, Italian, Japanese… the dictionary re-letters itself; the thumb-index
tabs follow the new headwords.

Lessons, prices, hours and contact details are **not** code: you set them in the dashboard once the
booking backend is connected. The page reads each lesson's kind from the words in its name (start
here · lesson · speaking · sounds · exams · work · travel — see `CUSTOMIZE.md`). **Your own
photographs** go in the dashboard → Website. Each sample photo stays labelled "Sample photo" until
you replace it. Qualifications, nationality and years of teaching are yours to add if they are true:
the starter invents none, and it never shows a review, a testimonial or a result it doesn't have.

**A booking is one lesson at the table.** The booking engine books single appointments on one
calendar — one teacher, one student, one kind of lesson, in person at one address. There are no
group classes, courses, terms, packages or online (video) lessons: a weekly student books each lesson.
The site promises no level, fluency or exam result, and it says plainly that the studio does not
register exam candidates. The booking form asks only for a name, an email and (optionally) a phone
number; for a student under 18 a parent or guardian books. The engine does not take payments or
deposits, send meeting links or schedule several teachers (see *What the engine does not do* in
`CLAUDE.md`).

## 3. Connect real bookings

You need a free Supabase project and a Resend account for booking emails.

```bash
cp .env.example .env.local    # your Supabase Project URL + Publishable key
npx supabase@2 login          # once, in your own terminal
npx booking-engine connect --admin you@example.com
```

`connect` links the project, sets up the database and the booking-email function, and tells you
exactly what is left for you to do (your dashboard login and the two email secrets). Full steps:
the Profit Studio guide *Build a Premium Booking Website with Claude Code*, Step 3, or
`node_modules/@profitstudio/booking-engine/docs/INTEGRATION.md` §11.

Never put a Supabase **Secret** key or your Resend API key in `.env.local`, in a prompt or in
Hostinger — the Resend key lives only in Supabase's Edge Function secrets.

## 4. Publish on Hostinger

Push this project to a private GitHub repository, then in Hostinger create a **Web App** from it
(Websites → Create site → Web App → Import Git Repository):

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` (never `build:demo`) |
| Output directory | `dist` |
| Node.js | 22 or newer |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (public values only) |

`dist/` contains the website and `dist/admin/` the dashboard. Every push to `main` redeploys.

## What is in this folder

| | |
|---|---|
| `src/site.config.ts` | The school's name, time zone and preview contact details |
| `src/content/site.ts` | Everything the owner can edit in the dashboard → Website, with its default text and photos |
| `src/styles/tokens.css` | The design's colours, type, the thumb index and spacing (one file); `DESIGN.md` explains the system |
| `src/components/` | The website (`Hero` (the entry and live facts), `Levels` (where are you on the scale?), `Services` (the dictionary page), `Method`, `Studio`, `GoodToKnow`, `Visit`…), the ornament pieces (`Entry.tsx` — entries and thumb tabs, `Mark.tsx`, `Emphasis.tsx`) and the booking flow (`src/components/booking/`) |
| `src/lib/preset.ts` | The sample lessons and hours used by preview mode and offered in a new dashboard |
| `src/lib/services.ts` | How lessons find their kind (by the words in their names), how the page's words find a lesson, "Good for:", lengths and prices |
| `src/lib/lang.ts` | The taught language's `lang` attribute and the thumb-index letter |
| `admin/` + `src/admin-main.tsx` | The packaged dashboard, mounted at `/admin/` |
| `src/demo/` | The Live Demo's in-browser engine and sample data — used only by `dev:demo` / `build:demo`; a normal build contains none of it |
| `supabase/` | The engine's database migrations and email function (managed by `npx booking-engine`; do not edit) |
| `CLAUDE.md`, `BOOKING_ENGINE.md` | Rules Claude Code follows in this project |
| `PHOTOS.md` | The Pexels photos (Pexels License), credited file by file |

## Commands

```bash
npm run dev          # preview mode (sample data) until .env.local exists — http://localhost:5361
npm run dev:demo     # the Live Demo (in-browser data, dashboard included)
npm run build        # production build → dist/
npm run build:demo   # the public Live Demo build → dist/ (never deploy this as your site)
npx booking-engine doctor             # checks versions, engine files and keys
npx booking-engine doctor --dist dist # after a build: also scans the output for secrets
```

## Licence

The code is MIT-licensed — see [`LICENSE`](LICENSE) (Copyright (c) 2026 Youssef Es-salhi).
Photographs and other third-party assets keep their own terms, listed in [`ASSETS.md`](ASSETS.md)
(the photographs file by file in [`PHOTOS.md`](PHOTOS.md)).
