import { useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { KeyboardEvent } from 'react';
import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import { langOf } from '../lib/lang';
import type { Resource } from '../lib/resource';
import { KIND_LABEL, durationSpoken, firstOfKind, kindOf, minutesLabel, priceTerms, serviceFor, splitDescription } from '../lib/services';
import { Emphasis } from './Emphasis';
import { Entry, Thumb } from './Entry';
import { Photo } from './Photo';

interface LevelsProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  onBook: StartBooking;
}

/** The chosen level as a booking-note line, so the teacher knows where to start. */
const levelNote = (code: string, name: string) => `Level (my own guess): ${code.trim()}${name.trim() ? ` — ${name.trim()}` : ''}`;

/**
 * "Where are you on the scale?" — on an ink band, the six levels as one horizontal scale (a tab list:
 * arrow keys, Home, End), a red mark riding to the chosen step. Under it the level as a dictionary
 * would print it: its code set huge, its name, what you can do, and a sentence at that level in the
 * language taught (with its `lang`) and its English. Beside it, the lesson that fits (`serviceFor`:
 * the owner names it) with its LIVE length and price and Book — which writes "Level (my own guess):
 * B1 — Intermediate" into the booking note. Under the scale, a line to the placement conversation.
 * A level whose lesson isn't offered (renamed or removed in the dashboard) keeps its words but loses
 * its Book; with no levels at all the section is hidden. Nothing here promises a level or a result.
 */
export function Levels({ values, ownerFields, services, business, onBook }: LevelsProps) {
  const levels = values['levels.items'];
  const list = services.status === 'ready' ? services.data : [];
  const [active, setActive] = useState(Math.min(2, Math.max(0, levels.length - 1)));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const lang = langOf(values);
  const photo = values['levels.photo'];
  if (levels.length === 0) return null;
  const index = Math.min(active, levels.length - 1);
  const level = levels[index];
  const service = serviceFor(list, level.lesson);
  const intro = firstOfKind(list, 'intro');
  const locale = business?.locale ?? 'en-US';
  const price = service ? priceTerms(service, locale) : null;
  const goodFor = service ? splitDescription(service.description).goodFor : null;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = levels.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = moves[e.key];
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className={`levels section${photo ? ' levels--photo' : ''}`} id="levels" aria-labelledby="levels-title">
      <Thumb word={values['levels.word']} step={1} tone="ink" />
      <div className="shell">
        <div className="levels__head">
          <div className="levels__words">
            <Entry word={values['levels.word']} ipa={values['levels.ipa']} gloss={values['levels.gloss']} lang={lang} tone="ink" />
            <h2 id="levels-title" className="section-title" data-reveal="">
              <Emphasis text={values['levels.title']} />
            </h2>
            {values['levels.intro'] && <p className="section-intro">{values['levels.intro']}</p>}
          </div>
          {photo && (
            <figure className="levels__photo" data-reveal="">
              <Photo image={photo} sizes="(min-width: 1200px) 20vw, (min-width: 960px) 28vw, 1px" />
              {!ownerFields.includes('levels.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
            </figure>
          )}
        </div>

        <div className="scale" role="tablist" aria-orientation="horizontal" aria-label="Levels" style={{ '--count': levels.length, '--at': index } as CSSProperties}>
          <span className="scale__track" aria-hidden="true">
            <span className="scale__mark" />
          </span>
          {levels.map((l, i) => (
            <button
              key={`${i}-${l.code}`}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === index}
              aria-controls={`${id}-panel`}
              tabIndex={i === index ? 0 : -1}
              className="step-tab"
              onClick={() => setActive(i)}
              onKeyDown={onKey}
            >
              <span className="step-tab__code">{l.code}</span>
              <span className="step-tab__name">{l.name}</span>
            </button>
          ))}
        </div>

        <div className="level" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`}>
          <div className="level__entry" key={index}>
            <p className="level__code" aria-hidden="true">
              {level.code}
            </p>
            <div className="level__words">
              <h3 className="level__name">
                <span className="sr-only">{level.code}: </span>
                {level.name}
              </h3>
              {level.canDo && <p className="level__can">{level.canDo}</p>}
              {level.example && (
                <blockquote className="level__example">
                  <p lang={lang}>{level.example}</p>
                  {level.translation && <p className="level__gloss">{level.translation}</p>}
                </blockquote>
              )}
            </div>
          </div>
          <div className="suggest" key={`s-${index}`}>
            <p className="suggest__kind">
              <span aria-hidden="true">Start with · </span>
              {service ? KIND_LABEL[kindOf(service)] : 'Lesson'}
            </p>
            <p className="suggest__name">{service ? service.name : level.lesson}</p>
            {goodFor && <p className="suggest__for">Good for: {goodFor}</p>}
            {service && price && (
              <div className="suggest__foot">
                <dl className="suggest__figures">
                  <div>
                    <dt>At the table</dt>
                    <dd>
                      <span aria-hidden="true">{minutesLabel(service.durationMinutes)}</span>
                      <span className="sr-only">{durationSpoken(service.durationMinutes)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>{price.label}</dt>
                    <dd>{price.amount}</dd>
                  </div>
                </dl>
                <a className="btn btn--primary" href="#book" onClick={bookLink(onBook, service.id, levelNote(level.code, level.name))}>
                  Book this<span className="sr-only">: {service.name}</span>
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>

        {values['levels.note'] && (
          <p className="levels__note">
            <span>{values['levels.note']}</span>
            {intro && (
              <a className="text-link text-link--ink" href="#book" onClick={bookLink(onBook, intro.id)}>
                {intro.name}
                <span className="levels__note-facts">
                  {'\u00a0·\u00a0'}
                  <span aria-hidden="true">{minutesLabel(intro.durationMinutes)}</span>
                  <span className="sr-only">{durationSpoken(intro.durationMinutes)}</span>
                  {'\u00a0·\u00a0'}
                  {priceTerms(intro, locale).amount}
                </span>
              </a>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
