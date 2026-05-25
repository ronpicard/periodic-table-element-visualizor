import { CATEGORY_COLORS } from '@/shared/lib/category-colors';
import type { Element } from '@/shared/types/element';

interface ElementTileProps {
  element: Element;
  selected: boolean;
  onSelect: (element: Element) => void;
}

export function ElementTile({ element, selected, onSelect }: ElementTileProps) {
  const color = CATEGORY_COLORS[element.category];

  return (
    <button
      type="button"
      className={`element-tile${selected ? ' element-tile--selected' : ''}`}
      style={{
        gridRow: element.gridRow,
        gridColumn: element.gridColumn,
        ['--element-color' as string]: color,
      }}
      onClick={() => onSelect(element)}
      aria-pressed={selected}
      aria-label={`${element.name}, atomic number ${element.atomicNumber}`}
    >
      <span className="element-tile__number">{element.atomicNumber}</span>
      <span className="element-tile__symbol">{element.symbol}</span>
      <span className="element-tile__name">{element.name}</span>
    </button>
  );
}
