import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Noto Serif Display (variable weight AND width, with its italic): the headwords, set condensed and
// heavy, the headings, and every pronunciation in italic. Noto Sans (variable weight): reading text,
// labels and figures. The Noto families were drawn to cover every script — the IPA symbols of a
// pronunciation (ʁ ɛ ɔ ə) render in the page's own face, never in a fallback.
import '@fontsource-variable/noto-serif-display/wdth.css';
import '@fontsource-variable/noto-serif-display/wdth-italic.css';
import '@fontsource-variable/noto-sans/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/site.css';
import './styles/booking.css';
import { App } from './App';
import { engine } from './lib/engine';
import type { DemoEngine } from './demo/engine';

if (__BOOKING_DEMO__) void import('./demo/engine/DemoBar').then((m) => m.mountDemoBar(engine as DemoEngine, 'site'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
