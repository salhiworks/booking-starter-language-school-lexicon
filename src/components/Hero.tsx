import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import { langOf } from '../lib/lang';
import type { Resource } from '../lib/resource';
import { durationSpoken, indexOrder, kindOf, minutesLabel, priceLabel } from '../lib/services';
import type { OpeningInfo } from '../lib/useOpening';
import { Emphasis } from './Emphasis';
import { Thumb } from './Entry';
import { Photo } from './Photo';

/** imagesizes must match the preload in index.html. */
export const HERO_SIZES = '(min-width: 960px) 40vw, 100vw';

interface HeroProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  opening: OpeningInfo;
  onBook: StartBooking;
}

/**
 * The first screen is a dictionary entry on India paper. The headword ("parler") set as large as the
 * column allows; under it the pronunciation in the accent's italic and the part of speech; then the
 * senses — 1. the gloss ("to speak."), 2. the headline (the page's h1: "What you'll do from your first
 * lesson."). One sentence, the main action and three live facts (the free placement conversation and
 * the lowest lesson price, both from the engine, and the open status). Beside it the tall photograph,
 * with the first thumb-index tab cut into the page's edge. Phones: entry, action and facts, then the photo.
 */
export function Hero({ values, ownerFields, services, business, opening, onBook }: HeroProps) {
  const photo = values['hero.photo'];
  const own = ownerFields.includes('hero.photo');
  const lang = langOf(values);
  const kicker = values['hero.kicker'].trim();
  const place = values['hero.place'].trim();
  const secondary = values['hero.secondary'].trim();
  const word = values['hero.word'].trim();
  const ipa = values['hero.ipa'].trim();
  const [pos, ...rest] = values['hero.gloss'].split(/\s+[—–-]\s+/);
  const gloss = rest.join(' — ').trim();
  return (
    <section className={`hero${photo ? '' : ' hero--no-photo'}`} id="top" aria-labelledby="hero-title">
      <Thumb word={word} step={0} />
      <div className="hero__grid">
        <div className="hero__text">
          <p className="hero__kicker">
            {kicker && <span>{kicker}</span>}
            {place && <span className="hero__place">{place}</span>}
          </p>
          {word && (
            <p className="headword" lang={lang}>
              {word}
            </p>
          )}
          <p className="hero__pron">
            {ipa && (
              <span className="hero__ipa" lang={lang ? `${lang}-fonipa` : undefined}>
                {ipa}
              </span>
            )}
            {(gloss ? pos : '').trim() && <span className="hero__pos">{pos.trim()}</span>}
          </p>
          <ol className="senses" role="list">
            {(gloss || pos.trim()) && (
              <li className="sense">
                <span className="sense__n" aria-hidden="true">
                  1
                </span>
                <span className="sense__text">{gloss || pos.trim()}</span>
              </li>
            )}
            <li className="sense sense--main">
              <span className="sense__n" aria-hidden="true">
                2
              </span>
              <h1 id="hero-title" className="hero__title">
                <Emphasis text={values['hero.title']} />
              </h1>
            </li>
          </ol>
          {values['hero.lede'] && <p className="hero__lede">{values['hero.lede']}</p>}
          <div className="hero__actions">
            <a className="btn btn--primary btn--large" href="#book" onClick={bookLink(onBook)}>
              {values['hero.cta']}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            {secondary && (
              <a className="text-link" href="#levels">
                {secondary}
              </a>
            )}
          </div>
          <Facts services={services} business={business} opening={opening} onBook={onBook} />
        </div>
        {photo && (
          <figure className="hero__figure">
            <Photo image={photo} sizes={HERO_SIZES} priority className="frame--hero" />
            {!own && <figcaption className="photo-label">Sample photo</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}

/**
 * Three live facts under the action, set like a dictionary's usage notes: the free placement
 * conversation (if offered) and the lowest priced lesson — each a link that opens that lesson — then
 * today's open status.
 */
function Facts({ services, business, opening, onBook }: { services: Resource<Service[]>; business: Business | null; opening: OpeningInfo; onBook: StartBooking }) {
  if (services.status === 'loading') return <div className="facts facts--loading" aria-hidden="true" />;
  const locale = business?.locale ?? 'en-US';
  const list = services.status === 'ready' ? indexOrder(services.data) : [];
  const intro = list.find((s) => kindOf(s) === 'intro' && s.priceCents === 0) ?? null;
  const priced = list.filter((s) => (s.priceCents ?? 0) > 0).sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0))[0] ?? null;
  return (
    <ul className="facts" role="list">
      {intro && (
        <li>
          <a className="fact" href="#book" onClick={bookLink(onBook, intro.id)}>
            <span className="fact__value">Free</span>
            <span className="fact__term">
              <span aria-hidden="true">{minutesLabel(intro.durationMinutes)} placement</span>
              <span className="sr-only">
                {durationSpoken(intro.durationMinutes)} — book {intro.name}
              </span>
            </span>
          </a>
        </li>
      )}
      {priced && (
        <li>
          <a className="fact" href="#book" onClick={bookLink(onBook, priced.id)}>
            <span className="fact__value">
              <span className="fact__from">from </span>
              {priceLabel(priced, locale)}
            </span>
            <span className="fact__term">
              Lessons<span className="sr-only"> — book {priced.name}</span>
            </span>
          </a>
        </li>
      )}
      {opening.status && (
        <li className="fact fact--status" data-open={opening.status.open}>
          <span className="fact__dot" aria-hidden="true" />
          <span className="fact__term">{opening.status.text}</span>
        </li>
      )}
    </ul>
  );
}
