# Make this starter yours — the Claude Code prompt

Fill in the five lines at the top, then paste the whole prompt into a Claude Code session opened in
this folder. It changes identity and words only, so it finishes in one short session.

```text
Customize this private language school starter for my school.

School name: <YOUR SCHOOL NAME>
Language I teach (and its code): <e.g. Spanish (es)>
City and area: <CITY, AREA, STATE>
Time zone (IANA): <e.g. America/Chicago>
How I teach, in a few words: <e.g. one room above a café, adults and teens, lots of conversation, DELE preparation>

Follow CLAUDE.md (already loaded in this session — no need to open it again).
Open and change only these files; don't explore the rest of the project:
1. src/site.config.ts — name, timezone, and fictional previewContact details in my city.
2. index.html and admin/index.html — the school name, city and description in <title>,
   the meta description and the og tags.
3. src/content/site.ts — rewrite every DEFAULT text for my school, in English, with the headwords
   and examples in the language I teach: the name and the line beside it, brand.language (the code),
   what I do and where, every section's dictionary entry (a headword in my language whose meaning fits
   the section, its pronunciation in IPA between slashes — check it in a good dictionary — and a gloss
   like "noun — level."), the headline, the sentence, main button and second link; "Where are you on
   the scale?" (heading, line, the six levels — code, name, what you can do, ONE natural sentence at
   that level in my language and its English, and the lesson it points to by name or a word from it —
   and the line to the placement conversation); the lessons heading, line, the weekly line and small
   print; how lessons go (three principles, each with a short example in my language and its English);
   the studio (my own words; who lessons are for; how students under 18 book); the questions &
   policies (my real policies — cancellations, payment, exams); the booking heading and introduction;
   the studio note; the footer line and the search title and description.
   Keep field ids, types, limits and photos. Keep the sample photos (they stay labelled "Sample
   photo" until I upload my own).
   Keep the honesty rules: one booking is one lesson for one student, in person at my one studio; no
   group classes, courses, terms, packages or online lessons; never promise a level, fluency, a pace
   or an exam result; I don't register exam candidates unless I tell you I am an official centre; no
   qualifications, nationality, years of teaching, memberships, awards, reviews or testimonials
   unless I tell you they are true; nothing is paid online and there are no deposits; no lesson
   lengths or prices written into the copy.
   Keep the copy SHORT — a sentence where the sample has one.
4. Only if rubric red clearly doesn't fit my brand (otherwise skip this step): change the default of
   brand.accent in src/content/site.ts (a DEEP colour that keeps white text at 4.5:1 — a deep blue, a
   bottle green, an aubergine) and both colours in src/admin-theme.css. The paper pages and ink bands
   are part of the design and stay.

Do not change the layout, the booking flow, src/lib/engine.ts, src/lib/preset.ts,
src/lib/services.ts, src/demo/, supabase/, booking-engine.lock.json or package.json. Do not invent
lessons, prices, opening hours or qualifications I haven't told you about — lessons, prices and
hours are set in the dashboard. When done, run npm run build and fix any error, then show me the
result with npm run dev.
```

## After the prompt

- **Your lessons:** dashboard → Services. One booking is one lesson with you, for one student and one
  kind of lesson. The time shown is the time at the table.
  - **Kinds.** The page reads each lesson's kind from the words in its name (then its description):
    *placement, level check, trial, first lesson* → **Start here** (its own group in the booking
    sheet, listed first); *exam, test, DELF, DALF, TCF, DELE, IELTS, Goethe…* → **Exams**;
    *pronunciation, accent, sounds* → **Sounds**; *conversation, speaking, talk* → **Speaking**;
    *work, business, professional* → **Work**; *travel, holiday, trip* → **Travel**; *lesson, course,
    grammar, writing, reading* → **Lesson**. Anything else is a plain lesson.
  - **Descriptions.** Keep them to one or two short sentences: the price list shows the part before
    "Good for:" and the "Good for" line under it.
  - **Prices.** A fixed price is the lesson; tick "from" if the price is agreed before you start; 0 is
    shown as *Free* (the placement conversation). Nothing is paid online. Packages and terms are not
    supported — a weekly student books each lesson.
  - **Who it's for.** End a description with `Good for:` — `Good for: rusty speakers`. Describe a
    situation, never a promised result.
- **Where are you on the scale?:** Website → that section. Each level names a lesson by its exact name
  or a word from it ("Conversation"); the card shows that lesson's live length and price and a Book
  button that writes the level into the booking note. A level whose lesson you no longer offer keeps
  its words and shows no Book button.
- **Another language:** every headword, pronunciation, gloss, level sentence and example is a field.
  Set *Language code* (Brand) so screen readers read them in the right language; the thumb-index tabs
  follow the first letters of your headwords.
- **Headings:** wrap a word or two in *asterisks* to set them in italic, in your accent colour.
- **Photos:** Website → each section. Use only your own photos. The "Sample photo" label disappears
  from each one you replace.
- **Students under 18:** a parent or guardian books with their own details; the booking note asks only
  for a first name, a level, a goal or an exam date — never health or other sensitive details.
- **Online booking:** dashboard → Settings, once email sending works (see BOOKING_ENGINE.md).
