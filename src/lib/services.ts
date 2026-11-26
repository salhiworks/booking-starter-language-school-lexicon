import { formatMoney } from '@profitstudio/booking-engine';
import type { Service } from '@profitstudio/booking-engine';

/**
 * The school's lessons. The engine (2.0.0) has no service categories and no per-service
 * metadata, and a service's id is a database UUID this site cannot know when it is built — so everything
 * is read from the service's own engine data:
 *
 *   1. its KIND (intro · lesson · conversation · pronunciation · exam · work · travel), from its NAME,
 *      else its description, else "other" — it groups the booking sheet, labels each lesson on the
 *      price list and lets "Where are you on the scale?" point at a lesson by kind;
 *   2. who it is GOOD FOR: the part after "Good for:" in the description;
 *   3. its LENGTH: the time at the table; its PRICE: the price of THAT lesson, paid at the studio —
 *      never online, never a package, a term or a course.
 *
 * The site never invents a lesson: an owner who renames, removes or adds services sees exactly the
 * engine's list. Stable categories need an engine version — see docs/ENGINE-PROPOSAL-language-school.md
 * in the Niche Pack workspace.
 */
export type SessionKind = 'intro' | 'exam' | 'pronunciation' | 'conversation' | 'work' | 'travel' | 'lesson' | 'other';

/** Checked in this order: "Exam Conversation Practice" is exam before conversation; "lesson" comes last. */
const KINDS: { id: Exclude<SessionKind, 'other'>; test: RegExp }[] = [
  { id: 'intro', test: /\b(placement|level check|trial|intro\w*|discovery|first (call|chat|conversation|lesson|meeting)|get acquainted|consultation)\b/i },
  { id: 'exam', test: /\b(exams?|tests?|delf|dalf|tcf|tef|dele|siele|ielts|toefl|cambridge|goethe|testdaf|celi|cils|hsk|jlpt|certificat\w*)\b/i },
  { id: 'pronunciation', test: /\b(pronunciation|accent|phonetics?|sounds?|diction)\b/i },
  { id: 'conversation', test: /\b(conversation|speaking|talk|chat|discussion)\b/i },
  { id: 'work', test: /\b(work|business|professional|career|office|corporate)\b/i },
  { id: 'travel', test: /\b(travel\w*|holiday|trip|survival)\b/i },
  { id: 'lesson', test: /\b(lessons?|course|classes?|grammar|writing|reading|tutoring|general)\b/i },
];

export const KIND_LABEL: Record<SessionKind, string> = {
  intro: 'Start here',
  lesson: 'Lesson',
  conversation: 'Speaking',
  pronunciation: 'Sounds',
  exam: 'Exams',
  work: 'Work',
  travel: 'Travel',
  other: 'Lesson',
};

const norm = (s: string | null | undefined) => (s ?? '').trim().replace(/\s+/g, ' ');

function kindFromText(text: string): SessionKind | null {
  for (const k of KINDS) if (k.test.test(text)) return k.id;
  return null;
}

/** "Pronunciation Clinic" → pronunciation; "Exam Preparation (DELF)" → exam; "Gift Voucher" → other. */
export function kindOf(service: Pick<Service, 'name' | 'description'>): SessionKind {
  return kindFromText(service.name) ?? kindFromText(lead(service.description)) ?? 'other';
}

/**
 * The name without a bracketed aside ("Exam Preparation (DELF · DALF · TCF)" → "Exam Preparation"), for
 * tight places. The full name stays in the price list, the booking sheet, the summary and every email.
 */
export function shortName(name: string): string {
  const stripped = norm(
    name
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/\s*[—–\-·:|/(),&]+\s*$/g, '')
      .replace(/^\s*[—–\-·:|/(),&]+\s*/g, ''),
  );
  return stripped.length >= 3 ? stripped : norm(name);
}

/** For the booking sheet: the placement conversation first, then the lessons. */
export interface Kind {
  id: 'start' | 'sessions' | 'next';
  label: string;
  services: Service[];
}

export function kinds(services: readonly Service[]): Kind[] {
  const list = indexOrder(services);
  const intro = list.filter((s) => kindOf(s) === 'intro');
  const rest = list.filter((s) => kindOf(s) !== 'intro');
  const groups: Kind[] = [];
  if (intro.length) groups.push({ id: 'start', label: 'Not sure of your level?', services: intro });
  if (rest.length) groups.push({ id: 'sessions', label: 'Lessons', services: rest });
  return groups;
}

/** The services in page order: the owner's order, with the placement conversation first. */
export function indexOrder(services: readonly Service[]): Service[] {
  const rank = (s: Service) => (kindOf(s) === 'intro' ? 0 : 1);
  return services.map((s, i) => ({ s, i })).sort((a, b) => rank(a.s) - rank(b.s) || a.i - b.i).map((x) => x.s);
}

/** The first service of a kind, in page order. */
export function firstOfKind(services: readonly Service[], kind: SessionKind): Service | null {
  return indexOrder(services).find((s) => kindOf(s) === kind) ?? null;
}

/** Lower-case words, accents and punctuation dropped: "French for Work" → "french for work". */
const words = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/**
 * The lesson the owner's words point at ("Conversation Practice", or just "Conversation"): 1. a service
 * with exactly that name; 2. a service whose name contains those words, from the start of a word; 3. the
 * first service of the kind those words name. Null when nothing matches — no Book button then.
 */
export function serviceFor(services: readonly Service[], sessionWords: string): Service | null {
  const want = words(sessionWords);
  if (!want) return null;
  const list = indexOrder(services);
  const exact = list.find((s) => words(s.name) === want);
  if (exact) return exact;
  const startOfWord = new RegExp(`(^| )${want.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`);
  const partial = list.find((s) => startOfWord.test(words(s.name)));
  if (partial) return partial;
  const kind = kindFromText(sessionWords);
  return kind ? firstOfKind(list, kind) : null;
}

export interface Described {
  lead: string;
  /** "Steady weekly progress" — the part after "Good for:", or null. */
  goodFor: string | null;
}

const GOOD_FOR = /(?:^|[\s.])(?:good for|best for|ideal for)\s*:\s*/i;

function lead(description: string | null | undefined): string {
  return splitDescription(description).lead;
}

/** "…then practice. Good for: steady progress" → { lead: "…then practice.", goodFor: "Steady progress" }. */
export function splitDescription(description: string | null | undefined): Described {
  const text = (description ?? '').trim();
  const m = GOOD_FOR.exec(text);
  if (!m) return { lead: text, goodFor: null };
  const raw = text.slice(m.index + m[0].length).trim().replace(/\.$/, '');
  return {
    lead: text.slice(0, m.index + (m[0].startsWith('.') ? 1 : 0)).trim(),
    goodFor: raw ? raw[0].toUpperCase() + raw.slice(1) : null,
  };
}

/** Kept for the shared booking flow: every lesson is at the studio, so there is no format to show. */
export function formatOf(_service: Pick<Service, 'description'>): { kind: 'studio'; label: string } | null {
  return null;
}

/** The booking sheet shows the lesson's full name. */
export function splitName(name: string): { base: string; size: string | null } {
  return { base: name, size: null };
}

export type Role = SessionKind;
export function roleOf(service: Pick<Service, 'name'>): Role {
  return kindOf({ name: service.name, description: null });
}

/** "45 min", "1 h 30 min", "2 h" — the lesson's length, straight from the engine. */
export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** "20 min", "60 min", "90 min", then "2 h". */
export function minutesLabel(minutes: number): string {
  return minutes <= 90 ? `${minutes} min` : durationLabel(minutes);
}

/** The same, for screen readers. */
export function durationSpoken(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${minutes} minutes`;
  const hours = `${h} hour${h > 1 ? 's' : ''}`;
  return m ? `${hours} ${m} minutes` : hours;
}

/** What the booking's LENGTH means: the time at the table with the teacher. */
export interface TimeTerms {
  role: Role;
  label: string;
  note: string | null;
}

export function timeTerms(service: Pick<Service, 'name' | 'description'>): TimeTerms {
  const role = kindOf(service);
  if (role === 'intro') return { role, label: 'At the table', note: 'A conversation about your level and goals' };
  return { role, label: 'At the table', note: null };
}

type PriceInput = Pick<Service, 'priceCents' | 'priceFrom' | 'currency' | 'name' | 'description'>;

/** Whole dollars print without ".00" — "$72", not "$72.00". */
const money = (cents: number, currency: string, locale: string) => formatMoney(cents, currency, locale).replace(/([.,])00(?!\d)/, '');

/**
 * What the engine's price MEANS here — the price of THIS lesson, paid at the studio:
 *   free    → no charge (the placement conversation)
 *   from    → a starting price (the owner's choice; agreed before the lesson starts)
 *   fixed   → the lesson's price
 *   request → no price shown: ask the studio
 * Never the price of a course, a term or a package.
 */
export interface PriceTerms {
  kind: 'free' | 'from' | 'fixed' | 'request';
  label: string;
  amount: string;
  note: string | null;
}

export function priceTerms(service: PriceInput, locale: string): PriceTerms {
  if (service.priceCents === null) return { kind: 'request', label: 'Price', amount: 'Ask us', note: null };
  if (service.priceCents === 0) return { kind: 'free', label: 'Price', amount: 'Free', note: 'No charge' };
  const amount = money(service.priceCents, service.currency, locale);
  if (service.priceFrom) return { kind: 'from', label: 'Price from', amount, note: 'The price is agreed with you before the lesson starts' };
  return { kind: 'fixed', label: 'Price', amount, note: null };
}

/** One line: "$72", "from $54", "Free", "Ask us". */
export function priceLabel(service: PriceInput, locale: string): string {
  const t = priceTerms(service, locale);
  if (t.kind === 'from') return `from ${t.amount}`;
  return t.amount;
}

/** The lowest priced service in a list, or null. */
export function cheapest(services: readonly Service[]): Service | null {
  const priced = services.filter((s) => s.priceCents !== null && s.priceCents > 0);
  priced.sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0));
  return priced[0] ?? null;
}
