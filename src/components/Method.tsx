import type { SiteValues } from '../lib/content';
import { langOf } from '../lib/lang';
import { Emphasis } from './Emphasis';
import { Entry, Thumb } from './Entry';
import { Photo } from './Photo';

/**
 * How lessons go: the principles numbered like a dictionary's senses, each with a usage example in
 * the language taught (italic, with its `lang`) and its English — beside a wide photograph of a lesson
 * at the table. No promised level or pace.
 */
export function Method({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const items = values['method.items'];
  const photo = values['method.photo'];
  const lang = langOf(values);
  return (
    <section className={`method section${photo ? '' : ' method--text'}`} id="method" aria-labelledby="method-title">
      <Thumb word={values['method.word']} step={3} />
      <div className="shell method__grid">
        <div className="method__body">
          <Entry word={values['method.word']} ipa={values['method.ipa']} gloss={values['method.gloss']} lang={lang} />
          <h2 id="method-title" className="section-title" data-reveal="">
            <Emphasis text={values['method.title']} />
          </h2>
          {items.length > 0 && (
            <ol className="usage" role="list">
              {items.map((item, i) => (
                <li className="use" key={`${i}-${item.title}`} data-reveal="">
                  <span className="use__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div className="use__body">
                    <h3 className="use__title">{item.title}</h3>
                    {item.text && <p className="use__text">{item.text}</p>}
                    {item.example && (
                      <p className="use__example">
                        <span className="use__phrase" lang={lang}>
                          {item.example}
                        </span>
                        {item.translation && <span className="use__gloss">{item.translation}</span>}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        {photo && (
          <figure className="method__photo" data-reveal="">
            <Photo image={photo} sizes="(min-width: 960px) 46vw, 100vw" />
            {!ownerFields.includes('method.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}
