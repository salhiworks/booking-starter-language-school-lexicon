import type { CSSProperties } from 'react';
import { thumbLetter } from '../lib/lang';

interface EntryProps {
  /** The headword, in the language taught ("niveau"). */
  word: string;
  /** Its pronunciation ("/ni.vo/"); empty hides it. */
  ipa: string;
  /** Its gloss ("noun — level."). */
  gloss: string;
  lang?: string;
  tone?: 'ink';
}

/**
 * A section opens like a dictionary entry: the headword in bold, its pronunciation in the accent's
 * italic, the gloss after it. Plain text (read in the page's order before the heading); the headword
 * carries the taught language's `lang`.
 */
export function Entry({ word, ipa, gloss, lang, tone }: EntryProps) {
  const w = word.trim();
  if (!w && !gloss.trim()) return null;
  return (
    <p className={`entry${tone ? ` entry--${tone}` : ''}`} data-reveal="">
      {w && (
        <span className="entry__word" lang={lang}>
          {w}
        </span>
      )}
      {ipa.trim() && (
        <span className="entry__ipa" lang={lang ? `${lang}-fonipa` : undefined}>
          {ipa.trim()}
        </span>
      )}
      {gloss.trim() && <span className="entry__gloss">{gloss.trim()}</span>}
    </p>
  );
}

/**
 * The one ornament: a dictionary's thumb index. Each section carries a half-round tab cut into the
 * page's right edge with its headword's first letter, and each tab sits a step lower than the last —
 * as the tabs of a real dictionary step down its fore-edge. Decorative (the headword is the text).
 */
export function Thumb({ word, step, tone }: { word: string; step: number; tone?: 'ink' }) {
  const letter = thumbLetter(word);
  if (!letter) return null;
  return (
    <span className={`thumb${tone ? ` thumb--${tone}` : ''}`} style={{ '--step': step } as CSSProperties} aria-hidden="true">
      {letter}
    </span>
  );
}
