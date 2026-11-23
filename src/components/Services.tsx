import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import { langOf } from '../lib/lang';
import type { Resource } from '../lib/resource';
import { KIND_LABEL, durationSpoken, indexOrder, kindOf, minutesLabel, priceTerms, splitDescription } from '../lib/services';
import { Emphasis } from './Emphasis';
import { Entry, Thumb } from './Entry';
import { Notice } from './Notice';

interface ServicesProps {
  values: SiteValues;
  services: Resource<Service[]>;
  business: Business | null;
  onRetry: () => void;
  onBook: StartBooking;
}

/**
 * Lessons & prices, set as a dictionary page: two columns with a hairline between them, one entry per
 * engine service in page order (the placement conversation first, with a red "Start here" tab). Each
 * entry: the name in bold with a dotted leader to its price, the length and kind in italic where a
 * dictionary prints the pronunciation, the description's first part and its "Good for" line, and
 * "Book" — the whole entry is the link. Under the page: how weekly students book, and how lessons are
 * paid. Every figure is live from the engine.
 */
export function Services({ values, services, business, onRetry, onBook }: ServicesProps) {
  const locale = business?.locale ?? 'en-US';
  const lang = langOf(values);
  return (
    <section className="lessons section" id="lessons" aria-labelledby="lessons-title">
      <Thumb word={values['lessons.word']} step={2} />
      <div className="shell">
        <header className="lessons__head">
          <div>
            <Entry word={values['lessons.word']} ipa={values['lessons.ipa']} gloss={values['lessons.gloss']} lang={lang} />
            <h2 id="lessons-title" className="section-title" data-reveal="">
              <Emphasis text={values['lessons.title']} />
            </h2>
          </div>
          {values['lessons.intro'] && <p className="section-intro">{values['lessons.intro']}</p>}
        </header>

        {services.status === 'loading' && (
          <div className="dict dict--loading" aria-busy="true">
            <p className="sr-only" role="status">
              Loading lessons…
            </p>
            <span className="skeleton skeleton--block" aria-hidden="true" />
            <span className="skeleton skeleton--block" aria-hidden="true" />
          </div>
        )}
        {services.status === 'error' && services.error.code !== 'NOT_CONFIGURED' && (
          <Notice tone="error" action={{ label: 'Try again', onClick: onRetry }}>
            <p>We couldn’t load the lessons just now.</p>
          </Notice>
        )}
        {services.status === 'ready' && services.data.length > 0 && (
          <ul className="dict" role="list">
            {indexOrder(services.data).map((s) => {
              const kind = kindOf(s);
              const price = priceTerms(s, locale);
              const { lead, goodFor } = splitDescription(s.description);
              return (
                <li className={`lex${kind === 'intro' ? ' lex--start' : ''}`} key={s.id} data-reveal="">
                  <a className="lex__link" href="#book" onClick={bookLink(onBook, s.id)}>
                    <span className="lex__line">
                      <span className="lex__name">{s.name}</span>
                      <span className="lex__leader" aria-hidden="true" />
                      <span className="lex__price">
                        {price.kind === 'from' && <span className="lex__from">from </span>}
                        {price.amount}
                      </span>
                    </span>
                    <span className="lex__meta">
                      <span aria-hidden="true">{minutesLabel(s.durationMinutes)}</span>
                      <span className="sr-only">{durationSpoken(s.durationMinutes)}</span>
                      <span className="lex__kind">{kind === 'intro' ? 'start here' : KIND_LABEL[kind].toLowerCase()}</span>
                    </span>
                    {lead && <span className="lex__text">{lead}</span>}
                    {goodFor && (
                      <span className="lex__for">
                        <span className="lex__for-label">Good for</span> {goodFor}
                      </span>
                    )}
                    <span className="lex__book">
                      Book<span className="sr-only"> {s.name}</span> <span aria-hidden="true">→</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        {(values['lessons.weekly'] || values['lessons.footnote']) && (
          <div className="lessons__foot">
            {values['lessons.weekly'] && <p className="lessons__weekly">{values['lessons.weekly']}</p>}
            {values['lessons.footnote'] && <p className="lessons__small">{values['lessons.footnote']}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
