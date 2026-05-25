import { getElementInfo } from '@/shared/data/element-info';
import {
  getElectronShells,
  getNeutronCount,
} from '@/shared/lib/atom-structure';
import type { Element, ElementDetails } from '@/shared/types/element';

export function enrichElement(element: Element): ElementDetails {
  return {
    ...element,
    electronShells: getElectronShells(element.atomicNumber),
    neutrons: getNeutronCount(element.atomicNumber, element.atomicMass),
    info: getElementInfo(element.atomicNumber),
  };
}
