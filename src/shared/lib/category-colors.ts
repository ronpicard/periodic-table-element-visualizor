import type { ElementCategory } from '@/shared/types/element';

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali-metal': '#ff6b6b',
  'alkaline-earth': '#ffa94d',
  'transition-metal': '#ffd43b',
  'post-transition': '#69db7c',
  metalloid: '#38d9a9',
  nonmetal: '#4dabf7',
  halogen: '#748ffc',
  'noble-gas': '#da77f2',
  lanthanide: '#f783ac',
  actinide: '#e599f7',
  unknown: '#868e96',
};

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali metal',
  'alkaline-earth': 'Alkaline earth',
  'transition-metal': 'Transition metal',
  'post-transition': 'Post-transition',
  metalloid: 'Metalloid',
  nonmetal: 'Nonmetal',
  halogen: 'Halogen',
  'noble-gas': 'Noble gas',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
  unknown: 'Unknown',
};
