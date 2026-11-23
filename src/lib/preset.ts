import type { Preset } from '@profitstudio/booking-engine';

/**
 * Parole's own preset (INTEGRATION.md §5): the sample lessons, hours and policies preview mode shows,
 * and the starter set the dashboard offers an owner who has no services yet (<BookingAdmin presets>).
 * Prices are in US dollars, in cents.
 *
 * WHAT A BOOKING IS HERE. One booking = ONE lesson: a reserved block of the one teacher's time, for ONE
 * student, for one kind of lesson, on the school's one calendar, in person at the studio's fixed
 * address. Its length is the time at the table; the buffer after it is the teacher's notes and a fresh
 * page for the next student.
 *
 * WHAT A PRICE IS HERE. The engine has one price per service: the price of THAT lesson, paid at the
 * studio — never online, no deposits, no packages, no terms. Free is the placement conversation.
 *
 * In person only. The engine's booking emails print the studio's address as the place of every lesson,
 * so online (video) lessons are not offered on this site — see docs/ENGINE-PROPOSAL-language-school.md.
 *
 * Honest teaching: a description says what the lesson COVERS, never an outcome — no promised level,
 * fluency, exam result or certificate, no "fluent in X weeks". The studio is not an exam centre and
 * registers nobody for an exam. No invented teacher name, degrees, nationality, years, reviews or
 * testimonials. A description may end with "Good for: …" — who it usually suits. The website shows it
 * as its own line.
 *
 * The website reads each lesson's KIND (intro · lesson · conversation · pronunciation · exam · work ·
 * travel) from its name (src/lib/services.ts) — to group the booking sheet, to label each lesson on the
 * price list and to answer "Where are you on the scale?".
 */
export const sitePreset = {
  id: 'language-school',
  label: 'Private Language School',
  terminology: { customer: 'student', customers: 'students', booking: 'lesson', bookings: 'lessons' },
  previewBusiness: {
    name: 'Sample Language Studio',
    currency: 'USD',
    locale: 'en-US',
    contact: {
      email: 'hello@example.com',
      phone: '+1 504-555-0100',
      address: '100 Example Street, New Orleans, LA',
    },
  },
  policies: {
    slotIntervalMinutes: 15,
    minNoticeMinutes: 1440,
    maxAdvanceDays: 56,
    autoConfirm: true,
    requirePhone: false,
    pendingHoldMinutes: 720,
    verificationWindowMinutes: 15,
  },
  // One teacher, one table: late-morning to early-evening lessons on weekdays (after work too), a short
  // Friday and a Saturday morning; closed on Sundays.
  workingHours: [
    { weekday: 1, start: '10:00', end: '19:00' },
    { weekday: 2, start: '10:00', end: '19:00' },
    { weekday: 3, start: '10:00', end: '19:00' },
    { weekday: 4, start: '10:00', end: '19:00' },
    { weekday: 5, start: '10:00', end: '15:00' },
    { weekday: 6, start: '09:00', end: '13:00' },
  ],
  services: [
    {
      name: 'Placement Conversation',
      description:
        'Twenty free minutes, in English and a little French: where you are, what you want French for, and which lesson fits. Good for: starting, or starting again',
      durationMinutes: 20,
      bufferAfterMinutes: 10,
      priceCents: 0,
      priceFrom: false,
    },
    {
      name: 'French Lesson',
      description:
        'A full lesson shaped around your level: speaking first, then the grammar it needs, then practice. Good for: steady weekly progress',
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      priceCents: 7200,
      priceFrom: false,
    },
    {
      name: 'Conversation Practice',
      description:
        'Mostly, you talk — your week, the news, a book. Corrections come at the end, not mid-sentence. Good for: rusty speakers, B1 and up',
      durationMinutes: 45,
      bufferAfterMinutes: 15,
      priceCents: 5400,
      priceFrom: false,
    },
    {
      name: 'Pronunciation Clinic',
      description:
        'The sounds English doesn’t have — the French r, u and the nasal vowels — one at a time, slowly. Good for: any level',
      durationMinutes: 30,
      bufferAfterMinutes: 15,
      priceCents: 3800,
      priceFrom: false,
    },
    {
      name: 'Exam Preparation (DELF · DALF · TCF)',
      description:
        'The format, timed practice and feedback on your speaking and writing. No promised score. Good for: a test date already booked',
      durationMinutes: 75,
      bufferAfterMinutes: 15,
      priceCents: 9600,
      priceFrom: false,
    },
    {
      name: 'French for Work',
      description:
        'Meetings, emails and phone calls, with the vocabulary of your own job. Good for: a new role or a move in French',
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      priceCents: 8400,
      priceFrom: false,
    },
  ],
} satisfies Preset;
