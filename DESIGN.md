# Lexicon — the design system

**The idea.** A good bilingual dictionary, open on the table: thin India paper, blue-black ink, the
red a dictionary prints its headwords and pronunciations in, and the thumb index cut into its
fore-edge. A language is learnt word by word, so every section opens like an entry — a headword in the
language taught, its pronunciation, a short gloss — and the whole page reads like a well-made
reference book rather than a school brochure: calm, exact, a little literary.

## Colour (`src/styles/tokens.css`)

| Token | Value | Role |
|---|---|---|
| `--paper` (India paper) | `#f4f1ea` | The reading pages — the first screen, lessons & prices, the studio, visit |
| `--paper-2` | `#eae6dc` | Deeper paper — how lessons go, questions |
| `--raised` (white paper) | `#fbfaf6` | The studio card, questions, the booking card and sheet |
| `--spruce` (ink binding) | `#141a2c` | Where are you on the scale?, the booking band, the sheet's header, the footer |
| `--ink` / `--ink-soft` / `--muted` | `#161a2b` / `#343a4d` / `#5a5e6e` | Text (15.6 · 10.6 · 5.9 : 1 on paper) |
| `--accent` (rubric red) | `#b0174f` | **Owner-editable.** Every main button, pronunciations, italic words, sense numbers, thumb-index tabs in the footer, the chosen level, day and time. A DEEP colour carrying white text (checked at 4.5:1 against white). Small red text on paper uses `--accent-ink` (a touch deeper); red on the ink bands uses `--accent-on-ink` (lightened). |

Contrast (rendered audit, page and sheet, 1440 and 390): lowest 5.17:1.

## Type

- **Noto Serif Display** (variable width and weight, with italic) — headwords set condensed (62.5 %
  width) and heavy (800); headings at regular width, 400; every pronunciation and emphasis in its
  italic. The Noto families cover the IPA (ʁ ɛ ɔ ə ˈ ː), so a pronunciation never falls back to
  another face — and they cover nearly every script, so an owner teaching Greek, Russian or
  Vietnamese keeps one typeface.
- **Noto Sans** — reading text, buttons, labels and figures.

## The one ornament: the thumb index

Each section carries a half-round tab cut into the page's right edge with its headword's first
letter, and each tab sits one step lower than the last — as the tabs of a real dictionary step down
its fore-edge (P · N · T · M · S · P · R · V). In the footer the whole alphabet runs along the book's
fore-edge under the name, this page's letters cut in red. The mark is a closed book with one tab.
The tabs are decorative (`aria-hidden`); the headword is the text, carrying the taught language's
`lang` (and its pronunciation `<lang>-fonipa`).

## Sections

1. **First screen (paper)** — the entry: kicker, the headword *parler* as large as the column allows,
   /paʁ.le/ *verb*, then the senses — 1 to speak. 2 the headline (the page's h1, "What you'll do from
   your *first lesson.*"); one sentence, Book a lesson, Find your level, three live facts (Free 20-min
   placement · lessons from $38 · open now); a tall photograph that fills the screen's height.
2. **Where are you on the scale? (ink)** — *niveau*; six levels A1–C2 as one horizontal scale (a tab
   list), a red mark riding to the chosen step; the level set like an entry — its code huge, its name,
   what you can do, a sentence at that level in the taught language with its English; the lesson that
   fits on a card with its live length and price and Book (the level goes into the note); a line to the
   placement conversation. A portrait beside the heading from 960 px.
3. **Lessons & prices (paper)** — *tarif*; a two-column dictionary page with a hairline between the
   columns: each lesson an entry — the name in bold with a dotted leader to its price, the length and
   kind in red italic where a dictionary prints the pronunciation, one line, *Good for*, Book. The
   placement conversation first, on a faint red wash. Weekly students and payment in two lines under it.
4. **How lessons go** — *méthode*; three principles numbered like senses, each with a usage example
   in the taught language and its English, beside a photograph of a lesson.
5. **The studio** — *salle*; a wide photograph of the room with a paper card over its corner: a few
   sentences, who lessons are for as pills, how students under 18 book.
6. **Questions** — *pourquoi*; six short answers, labelled "Sample policies" until edited.
7. **Booking (ink)** — *réserver*; a booking card standing inside a wide photograph → **Visit** —
   *venir*; hours, address, finding it → **Footer (ink)**, the name set huge on the fore-edge.

## Motion

Entries and photographs rise into place as they arrive; the scale's mark rides to the chosen level and
the level's entry settles. All off under `prefers-reduced-motion` (nothing hidden without
`html.js-reveal`).

## Layout

One centred shell (`--page-max: 104rem`). Breakpoints: 640 (the studio photograph goes 2:1, visit in
two columns), 960 (header nav, the height-aware first screen, the dictionary's two columns, the studio
card and booking card laid over their photographs), 1200 (a wider entry column). Short laptops
(≤ 900 px tall) and short phones tighten the first screen so the action always shows; on phones the
level names hide under their codes and the thumb tabs shrink into the gutter. Photographs are
square-cut like plates in a book; buttons are pills. 44 px targets everywhere.
