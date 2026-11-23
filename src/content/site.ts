import { defineSiteContent } from '@profitstudio/booking-engine';

/**
 * What the owner may change in the dashboard (Website). The defaults are the
 * website's own copy and photos: until the owner publishes, the page shows
 * exactly these. Lessons, prices, lengths, hours, the address, phone and
 * email are NOT here — they come from the engine.
 *
 * Never rename or reuse a field id once the site is live: the owner's text is
 * stored under it. Add a new id instead.
 *
 * This file is also imported by vite.config.ts (Node), so it imports nothing
 * local. Default photo `src` values are keys of src/content/photoVariants.ts.
 *
 * Lexicon: every section opens like a dictionary entry — a headword in the
 * language taught, its pronunciation and a short gloss (`<section>.word`,
 * `.ipa`, `.gloss`). The headword's first letter is the section's thumb-index
 * tab. Headings may wrap words in *asterisks*: those words are set in italic,
 * in the accent colour.
 *
 * Copy rules (CLAUDE.md): one student, one teacher, one lesson per booking, in
 * person at the studio; no promised level, fluency, exam result or
 * certificate; no invented teacher name, degrees, nationality, years, reviews
 * or testimonials; no packages, terms or online lessons.
 */
const SAMPLE_HELP =
  'A “Sample photo” label stays on it until you replace it with your own photo — use only photos you took or have the right to use. Never present a stock photo as you, your studio or a student.';

type Img = { src: string; alt: string; width: number; height: number };
const P = (name: string, alt: string): Img => ({ src: `/photos/${name}-800.webp`, alt, width: 800, height: 1000 });
const L = (name: string, alt: string): Img => ({ src: `/photos/${name}-960.webp`, alt, width: 960, height: 640 });
const EMPHASIS = 'Wrap a word or two in *asterisks* to set them in italic, in your accent colour.';
const LINES = 'One per line.';
const WORD = 'A word in the language you teach, set like a dictionary headword. Its first letter becomes this section’s thumb-index tab.';
const IPA = 'How it is pronounced, between slashes. Leave empty to hide.';
const GLOSS = 'What it means, dictionary-style: part of speech, a dash, the English.';

/** One section's dictionary entry: headword, pronunciation, gloss. */
const entry = <S extends string>(section: S, word: string, ipa: string, gloss: string) =>
  [
    { type: 'text', id: `${section}.word` as `${S}.word`, label: 'Headword', help: WORD, default: word, maxLength: 18 },
    { type: 'text', id: `${section}.ipa` as `${S}.ipa`, label: 'Pronunciation', help: IPA, default: ipa, maxLength: 28 },
    { type: 'text', id: `${section}.gloss` as `${S}.gloss`, label: 'Meaning', help: GLOSS, default: gloss, maxLength: 40 },
  ] as const;

export const siteContent = defineSiteContent({
  sections: [
    {
      id: 'brand',
      label: 'Brand',
      description: 'Your name or logo, the language you teach and the accent colour.',
      fields: [
        {
          type: 'text',
          id: 'brand.wordmark',
          label: 'Name',
          help: 'Shown beside the mark in the header and very large in the footer. One short word reads best.',
          default: 'Parole',
          maxLength: 20,
          required: true,
        },
        { type: 'text', id: 'brand.descriptor', label: 'Line beside the name', help: 'Two or three words.', default: 'French studio', maxLength: 28 },
        {
          type: 'text',
          id: 'brand.language',
          label: 'Language code',
          help: 'The language your headwords and example sentences are in, as a short code: fr (French), es (Spanish), de (German), it (Italian), pt, ja… Screen readers use it to pronounce them.',
          default: 'fr',
          maxLength: 12,
        },
        {
          type: 'image',
          id: 'brand.logo',
          label: 'Logo',
          help: 'Optional. A wide logo on a transparent background, drawn for a light background. It replaces the mark and name in the header.',
          default: null,
          aspectRatio: 4,
        },
        {
          type: 'color',
          id: 'brand.accent',
          label: 'Accent colour',
          help: 'The dictionary’s red ink: the main buttons, the pronunciations, italic words, the thumb-index tabs and the chosen level, day and time. It carries white text, so pick a DEEP colour — rubric red (the original), a deep blue, a bottle green. Light colours are refused.',
          default: '#b0174f',
          contrastWith: '#ffffff',
          minContrast: 4.5,
        },
      ],
    },
    {
      id: 'hero',
      label: 'First screen',
      description: 'The headword entry, the headline and the main photograph. The facts under the button come from your Services.',
      fields: [
        { type: 'text', id: 'hero.kicker', label: 'What you do', default: 'French lessons, one to one', maxLength: 44 },
        { type: 'text', id: 'hero.place', label: 'Where you are', default: 'New Orleans', maxLength: 40 },
        ...entry('hero', 'parler', '/paʁ.le/', 'verb — to speak.'),
        { type: 'text', id: 'hero.title', label: 'Headline', help: `The second meaning under the headword. ${EMPHASIS}`, default: 'What you’ll do from your *first lesson.*', maxLength: 64, required: true },
        {
          type: 'longText',
          id: 'hero.lede',
          label: 'One sentence',
          default: 'Private French lessons for adults and teens, at one table by the window — your level, your pace, your reasons.',
          maxLength: 150,
          rows: 2,
        },
        { type: 'text', id: 'hero.cta', label: 'Main button', default: 'Book a lesson', maxLength: 28, required: true },
        { type: 'text', id: 'hero.secondary', label: 'Second link', help: 'Leads to “Where are you on the scale?”.', default: 'Find your level', maxLength: 32 },
        {
          type: 'image',
          id: 'hero.photo',
          label: 'Main photo (portrait 4:5)',
          help: `Portrait (4:5), shown tall beside the entry. A lesson in natural light reads best. ${SAMPLE_HELP}`,
          default: {
            src: '/photos/hero-table-1200.webp',
            alt: 'A young woman with long dark hair sits at a dark wooden table in front of tall bookshelves, listening and about to speak.',
            width: 1200,
            height: 1500,
          },
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'levels',
      label: 'Where are you on the scale?',
      description:
        'Visitors pick a level and see what it sounds like, with the lesson that fits and its live length and price. Each level names one of your lessons (or a word from its name).',
      fields: [
        ...entry('levels', 'niveau', '/ni.vo/', 'noun — level.'),
        { type: 'text', id: 'levels.title', label: 'Heading', help: EMPHASIS, default: 'Where are you on the *scale?*', maxLength: 48, required: true },
        { type: 'text', id: 'levels.intro', label: 'Line under the heading', default: 'Six steps, from first words to fine nuance. A guess is fine.', maxLength: 90 },
        {
          type: 'list',
          id: 'levels.items',
          label: 'Levels',
          help: 'Up to six, from the first step up. The code is shown large (A1, B2…).',
          itemLabel: 'Level',
          maxItems: 6,
          fields: [
            { type: 'text', id: 'code', label: 'Code', default: '', maxLength: 4, required: true },
            { type: 'text', id: 'name', label: 'Name', default: '', maxLength: 24, required: true },
            { type: 'text', id: 'canDo', label: 'What you can do', default: '', maxLength: 90 },
            { type: 'text', id: 'example', label: 'A sentence at this level (in the language you teach)', default: '', maxLength: 80 },
            { type: 'text', id: 'translation', label: 'The sentence in English', default: '', maxLength: 80 },
            { type: 'text', id: 'lesson', label: 'Lesson', help: 'The name of one of your lessons, or a word from it.', default: '', maxLength: 60, required: true },
          ],
          default: [
            { code: 'A1', name: 'Beginner', canDo: 'Say hello, order, say who you are.', example: 'Je m’appelle Léa. Je voudrais un café.', translation: 'My name is Léa. I’d like a coffee.', lesson: 'French Lesson' },
            { code: 'A2', name: 'Elementary', canDo: 'Talk about your day and what you did last weekend.', example: 'Samedi, je suis allée au marché.', translation: 'On Saturday I went to the market.', lesson: 'French Lesson' },
            { code: 'B1', name: 'Intermediate', canDo: 'Keep a conversation going, and say what you would do if…', example: 'Si j’avais plus de temps, je lirais davantage.', translation: 'If I had more time, I would read more.', lesson: 'Conversation Practice' },
            { code: 'B2', name: 'Upper intermediate', canDo: 'Argue a point and follow most films.', example: 'Je ne suis pas tout à fait d’accord, mais je comprends.', translation: 'I don’t entirely agree, but I understand.', lesson: 'Conversation Practice' },
            { code: 'C1', name: 'Advanced', canDo: 'Work and study in French with few pauses.', example: 'Il faudrait qu’on en reparle avant la réunion.', translation: 'We should talk it over again before the meeting.', lesson: 'French for Work' },
            { code: 'C2', name: 'Mastery', canDo: 'Catch nuance and irony — and polish the last of an accent.', example: 'C’est une nuance qui m’échappait jusqu’ici.', translation: 'That’s a nuance that had escaped me until now.', lesson: 'Pronunciation Clinic' },
          ],
        },
        {
          type: 'text',
          id: 'levels.note',
          label: 'Line under the levels',
          help: 'Leads to your placement conversation (its live length and price are added).',
          default: 'Not sure? We find your level together in the placement conversation.',
          maxLength: 110,
        },
        {
          type: 'image',
          id: 'levels.photo',
          label: 'Photo (portrait 4:5)',
          help: `Shown beside the levels on wide screens. Remove it for text only. ${SAMPLE_HELP}`,
          default: P('levels-talk', 'A young woman at a library table talks animatedly, pointing to one side, as another woman listens with her back to the camera.'),
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'lessons',
      label: 'Lessons & prices',
      description: 'The words around your lessons. Names, descriptions, lengths and prices are edited in Services — keep descriptions to a sentence or two.',
      fields: [
        ...entry('lessons', 'tarif', '/ta.ʁif/', 'noun — price list.'),
        { type: 'text', id: 'lessons.title', label: 'Heading', help: EMPHASIS, default: 'Lessons *& prices.*', maxLength: 44, required: true },
        { type: 'text', id: 'lessons.intro', label: 'Line under the heading', default: 'One student, one teacher, one lesson at a time.', maxLength: 90 },
        {
          type: 'text',
          id: 'lessons.weekly',
          label: 'Coming every week',
          default: 'Coming every week? Book each lesson here — most students book a few weeks ahead.',
          maxLength: 120,
        },
        { type: 'text', id: 'lessons.footnote', label: 'Small print', default: 'Paid at the studio by card or cash. Nothing is paid online — no deposits, no packages.', maxLength: 140 },
      ],
    },
    {
      id: 'method',
      label: 'How lessons go',
      description: 'A few principles, each with an example sentence and its English, beside a photograph.',
      fields: [
        ...entry('method', 'méthode', '/me.tɔd/', 'noun — method.'),
        { type: 'text', id: 'method.title', label: 'Heading', help: EMPHASIS, default: 'Mostly, *you talk.*', maxLength: 48, required: true },
        {
          type: 'list',
          id: 'method.items',
          label: 'Principles',
          help: 'Up to four. Keep each to a sentence.',
          itemLabel: 'Principle',
          maxItems: 4,
          fields: [
            { type: 'text', id: 'title', label: 'Title', default: '', maxLength: 32, required: true },
            { type: 'text', id: 'text', label: 'Sentence', default: '', maxLength: 120 },
            { type: 'text', id: 'example', label: 'Example (in the language you teach)', default: '', maxLength: 70 },
            { type: 'text', id: 'translation', label: 'The example in English', default: '', maxLength: 70 },
          ],
          default: [
            { title: 'Speaking first', text: 'Every lesson opens with ten minutes of real conversation, whatever your level.', example: 'Alors, cette semaine ?', translation: 'So, how was your week?' },
            { title: 'Grammar when you need it', text: 'Rules come from the mistakes you actually make, not from chapter seven.', example: 'On dit « je suis allée », pas « j’ai allé ».', translation: 'We say “je suis allée”, not “j’ai allé”.' },
            { title: 'Your own words', text: 'You leave with a page of the phrases you reached for and didn’t have.', example: 'Comment dit-on « deadline » ?', translation: 'How do you say “deadline”?' },
          ],
        },
        {
          type: 'image',
          id: 'method.photo',
          label: 'Photo (wide)',
          help: `Wide (3:2). A lesson at the table reads best. Remove it for text only. ${SAMPLE_HELP}`,
          default: L('method-table', 'Two women face each other across a dark table with books and a tablet, mid-conversation, in a light room with plants.'),
          aspectRatio: 3 / 2,
        },
      ],
    },
    {
      id: 'studio',
      label: 'The studio',
      description: 'Who teaches and who lessons are for, in a few words, over a wide photograph.',
      fields: [
        ...entry('studio', 'salle', '/sal/', 'noun — room.'),
        { type: 'text', id: 'studio.title', label: 'Heading', help: EMPHASIS, default: 'One table, *one student.*', maxLength: 56, required: true },
        {
          type: 'longText',
          id: 'studio.text',
          label: 'A few sentences',
          help: 'In your own words. Add qualifications only if you hold them — the sample says none.',
          default: 'A small, independent French studio on the second floor of an old Marigny house. One teacher, books on every wall, tea on the go, and no question too basic.',
          maxLength: 260,
          rows: 3,
        },
        { type: 'longText', id: 'studio.for', label: 'Who lessons are for', help: LINES, default: 'Complete beginners\nComing back to French\nMoving for work\nExam candidates\nTravellers\nTeens with a parent', maxLength: 180, rows: 5 },
        {
          type: 'text',
          id: 'studio.minors',
          label: 'Students under 18',
          default: 'Under 18? A parent or guardian books with their own details and is welcome to sit in.',
          maxLength: 130,
        },
        {
          type: 'image',
          id: 'studio.photo',
          label: 'Photo (wide 2:1)',
          help: `Wide (2:1), running the width of the page. Your room reads best. ${SAMPLE_HELP}`,
          default: { src: '/photos/studio-room-1440.webp', alt: 'A long, light room with tall windows onto bare winter trees and a wall of books; two women talk at a table at the far end.', width: 1440, height: 720 },
          aspectRatio: 2,
        },
      ],
    },
    {
      id: 'faq',
      label: 'Questions',
      description: 'Short answers and policies. Until you edit them they are labelled “Sample policies”.',
      fields: [
        ...entry('faq', 'pourquoi', '/puʁ.kwa/', 'adverb — why.'),
        { type: 'text', id: 'faq.title', label: 'Heading', help: EMPHASIS, default: 'Fair *questions.*', maxLength: 44, required: true },
        {
          type: 'list',
          id: 'faq.items',
          label: 'Questions',
          itemLabel: 'Question',
          maxItems: 10,
          fields: [
            { type: 'text', id: 'question', label: 'Question', default: '', maxLength: 90, required: true },
            { type: 'longText', id: 'answer', label: 'Answer', default: '', maxLength: 400, rows: 3 },
          ],
          default: [
            { question: 'How fast will I be fluent?', answer: 'No one can honestly promise that. It depends on where you start, how often you come and how much French you hear between lessons.' },
            { question: 'Do you run group classes or online lessons?', answer: 'No — every lesson is one to one, in person at the studio.' },
            { question: 'Can I book a course or a package?', answer: 'Each booking is one lesson. Coming weekly? Book a few weeks ahead; you pay lesson by lesson.' },
            { question: 'Will I pass my exam?', answer: 'We prepare you for the format and practise it with you. The result is the exam board’s, and we don’t register candidates — you book your exam with the official centre.' },
            { question: 'What should I bring?', answer: 'Yourself and a notebook. Any course book you already use is welcome.' },
            { question: 'Cancelling or paying?', answer: 'Please give 24 hours’ notice. Lessons are paid at the studio by card or cash, never online.' },
          ],
        },
      ],
    },
    {
      id: 'book',
      label: 'Booking',
      description: 'The closing booking band and the top of the booking sheet.',
      fields: [
        ...entry('book', 'réserver', '/ʁe.zɛʁ.ve/', 'verb — to book.'),
        { type: 'text', id: 'book.title', label: 'Heading', help: EMPHASIS, default: 'See you *at the table.*', maxLength: 56, required: true },
        { type: 'text', id: 'book.intro', label: 'Line under the heading', default: 'A 6-digit code from your email confirms it. No account, nothing to pay online.', maxLength: 120 },
        {
          type: 'image',
          id: 'book.photo',
          label: 'Photo (wide)',
          help: `Wide (3:2), shown in the closing booking band. Remove it for text only. ${SAMPLE_HELP}`,
          default: L('book-window', 'Two women stand talking by a tall window with plants, one gesturing as she explains, the other listening.'),
          aspectRatio: 3 / 2,
        },
      ],
    },
    {
      id: 'visit',
      label: 'The studio address',
      description: 'Hours, address, phone and email come from your Business settings. Add how to find the studio.',
      fields: [
        ...entry('visit', 'venir', '/və.niʁ/', 'verb — to come.'),
        { type: 'text', id: 'visit.title', label: 'Heading', help: EMPHASIS, default: 'Find *the studio.*', maxLength: 44, required: true },
        {
          type: 'longText',
          id: 'visit.note',
          label: 'Finding the studio',
          default: 'Second floor, the green door beside the bookshop. Street parking on Chartres; the Rampart streetcar stops two blocks away.',
          maxLength: 240,
          rows: 3,
        },
        {
          type: 'image',
          id: 'visit.photo',
          label: 'Photo (portrait 4:5)',
          help: `Portrait (4:5). Your studio reads best. ${SAMPLE_HELP}`,
          default: P('visit-shelf', 'A young woman in a dotted dress reaches for a book on tall white shelves in a light room.'),
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'footer',
      label: 'Footer',
      fields: [{ type: 'text', id: 'footer.tagline', label: 'Line under the name', default: 'French lessons, one student at a time.', maxLength: 90 }],
    },
    {
      id: 'seo',
      label: 'Search & sharing',
      description: 'Search engines and link previews show new text after the website is next deployed.',
      fields: [
        {
          type: 'text',
          id: 'seo.title',
          label: 'Page title',
          help: 'Search engines and link previews show new text after the website is next deployed.',
          default: 'Parole — private French lessons in New Orleans',
          maxLength: 80,
          required: true,
        },
        {
          type: 'longText',
          id: 'seo.description',
          label: 'Page description',
          help: 'One or two sentences for search results. Updated after the next deploy.',
          default: 'One-to-one French lessons in New Orleans for adults and teens — conversation, pronunciation, exam preparation and French for work. Book online.',
          maxLength: 180,
          rows: 3,
          required: true,
        },
      ],
    },
  ],
});
