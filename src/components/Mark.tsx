/**
 * The studio's mark: a closed book seen from its fore-edge, one thumb-index tab cut into it.
 * Decorative (the name beside it is the text).
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
      <path d="M8 4.5h15.5a1.5 1.5 0 0 1 1.5 1.5v20a1.5 1.5 0 0 1-1.5 1.5H8Z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8 4.5v23" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path className="mark__tab" d="M25 10.5a4.5 4.5 0 0 0 0 9Z" />
    </svg>
  );
}
