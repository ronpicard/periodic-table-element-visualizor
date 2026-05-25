import { ElementTile } from '@/features/periodic-table/ElementTile';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/shared/lib/category-colors';
import { ELEMENTS } from '@/shared/data/elements';
import type { Element, ElementCategory } from '@/shared/types/element';

interface PeriodicTableProps {
  selectedAtomicNumber: number;
  onSelect: (element: Element) => void;
}

const LEGEND_CATEGORIES: ElementCategory[] = [
  'alkali-metal',
  'alkaline-earth',
  'transition-metal',
  'post-transition',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown',
];

export function PeriodicTable({ selectedAtomicNumber, onSelect }: PeriodicTableProps) {
  return (
    <section className="periodic-table" aria-labelledby="periodic-table-title">
      <header className="periodic-table__header">
        <h2 id="periodic-table-title">Periodic table</h2>
        <p>Click any element to explore its atomic structure in 3D.</p>
      </header>

      <div className="periodic-table__grid" role="grid" aria-label="Periodic table of elements">
        {ELEMENTS.map((element) => (
          <ElementTile
            key={element.atomicNumber}
            element={element}
            selected={element.atomicNumber === selectedAtomicNumber}
            onSelect={onSelect}
          />
        ))}
      </div>

      <ul className="periodic-table__legend" aria-label="Element categories">
        {LEGEND_CATEGORIES.map((category) => (
          <li key={category}>
            <span
              className="periodic-table__legend-swatch"
              style={{ backgroundColor: CATEGORY_COLORS[category] }}
            />
            {CATEGORY_LABELS[category]}
          </li>
        ))}
      </ul>
    </section>
  );
}
