import { lazy, Suspense, useMemo, useState } from 'react';
import { PeriodicTable } from '@/features/periodic-table';
import { getElementByNumber } from '@/shared/data/elements';
import { enrichElement } from '@/shared/lib/enrich-element';
import type { Element } from '@/shared/types/element';

const AtomViewer = lazy(() =>
  import('@/features/atom-viewer').then((module) => ({ default: module.AtomViewer })),
);

export default function App() {
  const [selectedAtomicNumber, setSelectedAtomicNumber] = useState(6);

  const selectedElement = useMemo(() => {
    const element = getElementByNumber(selectedAtomicNumber) ?? getElementByNumber(1)!;
    return enrichElement(element);
  }, [selectedAtomicNumber]);

  const handleSelect = (element: Element) => {
    setSelectedAtomicNumber(element.atomicNumber);
  };

  return (
    <div className="app">
      <header className="app__hero">
        <p className="app__eyebrow">Interactive chemistry</p>
        <h1>Periodic Element Visualizer</h1>
        <p className="app__lede">
          Browse the periodic table and inspect a Bohr-style 3D model of each atom&apos;s nucleus
          and electron shells.
        </p>
      </header>

      <main className="app__layout">
        <PeriodicTable
          selectedAtomicNumber={selectedAtomicNumber}
          onSelect={handleSelect}
        />
        <Suspense
          fallback={
            <section className="atom-viewer atom-viewer--loading">
              <p>Loading 3D viewer…</p>
            </section>
          }
        >
          <AtomViewer element={selectedElement} />
        </Suspense>
      </main>
    </div>
  );
}
