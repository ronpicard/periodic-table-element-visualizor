export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  atomicMass: number;
  gridRow: number;
  gridColumn: number;
}

export type ElementOccurrence = 'natural' | 'synthetic' | 'both';

export interface ElementInfo {
  discovery: string;
  isotopes: string;
  uses: string;
  characteristics: string;
  occurrence: ElementOccurrence;
}

export interface ElementDetails extends Element {
  electronShells: number[];
  neutrons: number;
  info: ElementInfo;
}
