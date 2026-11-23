import { Fragment } from 'react';

/**
 * The owner's text with *asterisks* turned into the emphasis — the words set in the display face's
 * italic, in the accent's red ink (CSS: `.hl`). Still rendered as text, never as HTML.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em className="hl" key={i}>
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
