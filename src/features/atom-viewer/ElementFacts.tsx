import { OCCURRENCE_LABELS } from '@/shared/data/element-info';
import type { ElementInfo } from '@/shared/types/element';

interface ElementFactsProps {
  info: ElementInfo;
}

export function ElementFacts({ info }: ElementFactsProps) {
  return (
    <section className="element-facts" aria-label="Element facts">
      <dl className="element-facts__list">
        <div>
          <dt>Discovery</dt>
          <dd>{info.discovery}</dd>
        </div>
        <div>
          <dt>Known isotopes</dt>
          <dd>{info.isotopes}</dd>
        </div>
        <div>
          <dt>Common uses</dt>
          <dd>{info.uses}</dd>
        </div>
        <div>
          <dt>Notable traits</dt>
          <dd>{info.characteristics}</dd>
        </div>
        <div>
          <dt>Origin</dt>
          <dd>{OCCURRENCE_LABELS[info.occurrence]}</dd>
        </div>
      </dl>
    </section>
  );
}
