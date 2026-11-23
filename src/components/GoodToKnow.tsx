import type { SiteValues } from '../lib/content';
import { langOf } from '../lib/lang';
import { Emphasis } from './Emphasis';
import { Entry, Thumb } from './Entry';

/**
 * Fair questions: the practical questions as native disclosure rows (keyboard and screen-reader
 * ready), the entry and heading standing beside them on wide screens. Until the owner edits them, they are
 * labelled as sample policies.
 */
export function GoodToKnow({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const items = values['faq.items'];
  if (items.length === 0) return null;
  return (
    <section className="faq section" id="questions" aria-labelledby="faq-title">
      <Thumb word={values['faq.word']} step={5} />
      <div className="shell">
        <div className="faq__grid">
          <header className="faq__head">
            <Entry word={values['faq.word']} ipa={values['faq.ipa']} gloss={values['faq.gloss']} lang={langOf(values)} />
            <h2 id="faq-title" className="section-title" data-reveal="">
              <Emphasis text={values['faq.title']} />
            </h2>
            {!ownerFields.includes('faq.items') && (
              <p className="sample-note">
                <span className="tag">Sample policies</span> Example answers and policies the studio edits in the dashboard — please check the details with the
                studio before you rely on them.
              </p>
            )}
          </header>
          <div className="faq__list">
            {items.map((item, i) => (
              <details className="qa" key={`${i}-${item.question}`} open={i === 0}>
                <summary>
                  <span className="qa__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="qa__q">{item.question}</span>
                  <span className="qa__icon" aria-hidden="true" />
                </summary>
                {item.answer && <p className="qa__a prewrap">{item.answer}</p>}
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
