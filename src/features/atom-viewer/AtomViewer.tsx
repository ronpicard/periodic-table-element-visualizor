import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AtomModel, getViewRadiusForElement } from '@/features/atom-viewer/AtomModel';
import { Starfield } from '@/features/atom-viewer/Starfield';
import { ViewControls } from '@/features/atom-viewer/ViewControls';
import { ElementFacts } from '@/features/atom-viewer/ElementFacts';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/shared/lib/category-colors';
import type { ElementDetails } from '@/shared/types/element';

interface AtomViewerProps {
  element: ElementDetails;
}

function Scene({ element, viewRadius }: AtomViewerProps & { viewRadius: number }) {
  return (
    <>
      <color attach="background" args={['#030508']} />
      <ambientLight intensity={0.55} />
      <pointLight position={[6, 8, 6]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-5, -4, -6]} intensity={0.45} color="#d0d0d0" />
      <Starfield />
      <AtomModel element={element} />
      <ViewControls viewRadius={viewRadius} />
    </>
  );
}

export function AtomViewer({ element }: AtomViewerProps) {
  const categoryColor = CATEGORY_COLORS[element.category];
  const shellSummary = element.electronShells.join(', ');
  const viewRadius = getViewRadiusForElement(element);

  return (
    <section
      className="panel atom-viewer"
      aria-labelledby="atom-viewer-title"
      style={{ ['--category-color' as string]: categoryColor }}
    >
      <div className="atom-viewer__body">
        <header className="atom-viewer__header">
          <div className="atom-viewer__title-block">
            <p className="atom-viewer__atomic-number">{element.atomicNumber}</p>
            <div>
              <h2 id="atom-viewer-title" className="atom-viewer__title">
                {element.name}
                <span className="atom-viewer__symbol">({element.symbol})</span>
              </h2>
              <p className="atom-viewer__subtitle">
                <span className="atom-viewer__category-pill">{CATEGORY_LABELS[element.category]}</span>
                <span aria-hidden="true">·</span>
                <span>{element.atomicMass.toFixed(3)} u</span>
              </p>
            </div>
          </div>
          <span
            className="atom-viewer__badge"
            style={{
              backgroundColor: `${categoryColor}22`,
              color: categoryColor,
            }}
          >
            {element.symbol}
          </span>
        </header>

        <div className="atom-viewer__canvas-wrap">
          <Canvas
            key={element.atomicNumber}
            camera={{ position: [0, 3, viewRadius * 1.45], fov: 50, near: 0.1, far: 1000 }}
          >
            <Suspense fallback={null}>
              <Scene element={element} viewRadius={viewRadius} />
            </Suspense>
          </Canvas>
          <p className="atom-viewer__hint">Drag to rotate · Scroll to zoom</p>
        </div>

        <dl className="atom-viewer__stats">
          <div>
            <dt>Protons</dt>
            <dd>{element.atomicNumber}</dd>
          </div>
          <div>
            <dt>Neutrons</dt>
            <dd>{element.neutrons}</dd>
          </div>
          <div>
            <dt>Electrons</dt>
            <dd>{element.atomicNumber}</dd>
          </div>
          <div>
            <dt>Shells</dt>
            <dd>{shellSummary}</dd>
          </div>
        </dl>

        <ElementFacts info={element.info} />
      </div>
    </section>
  );
}
