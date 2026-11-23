import type { SiteValues } from './content';

/**
 * The language the headwords and example sentences are in (brand.language), as a `lang` attribute —
 * so screen readers pronounce "parler" as French. Anything that is not a plausible BCP 47 tag
 * ("fr", "es-MX", "pt-BR", "zh-Hant") is ignored rather than written into the page.
 */
export function langOf(values: SiteValues): string | undefined {
  const raw = values['brand.language'].trim();
  return /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8}){0,2}$/.test(raw) ? raw : undefined;
}

/** A headword's thumb-index letter: its first letter, accents dropped, in capitals ("écrire" → "E"). */
export function thumbLetter(word: string): string {
  const first = word.trim().normalize('NFKD').replace(/[̀-ͯ]/g, '').match(/\p{L}/u);
  return first ? first[0].toLocaleUpperCase() : '';
}
