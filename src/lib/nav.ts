/** The page's sections, in order — the header, the phone menu and the footer all list these. */
export const NAV: readonly { href: string; label: string; header?: false }[] = [
  { href: '#levels', label: 'Levels' },
  { href: '#lessons', label: 'Lessons & prices' },
  { href: '#method', label: 'How lessons go' },
  { href: '#studio', label: 'The studio' },
  { href: '#questions', label: 'Questions', header: false },
  { href: '#visit', label: 'Visit' },
];
