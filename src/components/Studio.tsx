import type { SiteValues } from '../lib/content';
import { langOf } from '../lib/lang';
import { Emphasis } from './Emphasis';
import { Entry, Thumb } from './Entry';
import { Photo } from './Photo';

const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

/**
 * The studio: the room as a wide photograph across the page, and over its lower corner a paper card —
 * the entry, a short statement, who lessons are for (as quiet pills) and how students under 18 book.
 * No teacher's name, credentials, years or reviews unless the owner adds their own.
 */
export function Studio({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const photo = values['studio.photo'];
  const forList = lines(values['studio.for']);
  const lang = langOf(values);
  return (
    <section className={`studio section${photo ? '' : ' studio--text'}`} id="studio" aria-labelledby="studio-title">
      <Thumb word={values['studio.word']} step={4} />
      <div className="shell">
        {photo && (
          <figure className="studio__photo" data-reveal="">
            <Photo image={photo} sizes="(min-width: 1664px) 1600px, 96vw" />
            {!ownerFields.includes('studio.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
          </figure>
        )}
        <div className="studio__card" data-reveal="">
          <Entry word={values['studio.word']} ipa={values['studio.ipa']} gloss={values['studio.gloss']} lang={lang} />
          <h2 id="studio-title" className="section-title">
            <Emphasis text={values['studio.title']} />
          </h2>
          {values['studio.text'] && <p className="studio__text">{values['studio.text']}</p>}
          {forList.length > 0 && (
            <ul className="pills" role="list" aria-label="Lessons are for">
              {forList.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          )}
          {values['studio.minors'] && <p className="studio__minors">{values['studio.minors']}</p>}
        </div>
      </div>
    </section>
  );
}
