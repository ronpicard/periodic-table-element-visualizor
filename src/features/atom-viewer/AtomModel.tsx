import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, InstancedMesh } from 'three';
import { Color, Object3D } from 'three';
import type { NucleonSpherePosition } from '@/shared/lib/atom-structure';
import {
  getAtomViewRadius,
  getNucleusLayout,
  getShellRadius,
} from '@/shared/lib/atom-structure';
import type { ElementDetails } from '@/shared/types/element';

interface AtomModelProps {
  element: ElementDetails;
}

const PROTON_COLOR = '#4dabf7';
const NEUTRON_COLOR = '#868e96';
const ELECTRON_COLOR = '#ff4757';
const SHELL_COLORS = ['#ffd43b', '#69db7c', '#748ffc', '#da77f2', '#ff922b', '#38d9a9', '#e599f7'];

const NUCLEON_COLORS: Record<NucleonSpherePosition['kind'], string> = {
  proton: PROTON_COLOR,
  neutron: NEUTRON_COLOR,
};

function InstancedNucleons({
  nucleons,
  scale,
}: {
  nucleons: NucleonSpherePosition[];
  scale: number;
}) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || nucleons.length === 0) {
      return;
    }

    const dummy = new Object3D();
    const color = new Color();

    nucleons.forEach((nucleon, index) => {
      dummy.position.set(...nucleon.position);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      color.set(NUCLEON_COLORS[nucleon.kind]);
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [nucleons, scale]);

  if (nucleons.length === 0) {
    return null;
  }

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, nucleons.length]}>
      <sphereGeometry args={[1, 14, 14]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.45}
        roughness={0.35}
        metalness={0.1}
      />
    </instancedMesh>
  );
}

function Nucleus({ element }: { element: ElementDetails }) {
  const { nucleons, particleScale } = useMemo(
    () => getNucleusLayout(element.atomicNumber, element.neutrons),
    [element.atomicNumber, element.neutrons],
  );

  return <InstancedNucleons nucleons={nucleons} scale={particleScale} />;
}

function ElectronShell({
  shellIndex,
  electronCount,
  spinOffset,
  shellColor,
}: {
  shellIndex: number;
  electronCount: number;
  spinOffset: number;
  shellColor: string;
}) {
  const groupRef = useRef<Group>(null);
  const radius = getShellRadius(shellIndex);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * (0.35 + shellIndex * 0.08) + spinOffset;
    groupRef.current.rotation.x = shellIndex * 0.55;
    groupRef.current.rotation.z = shellIndex * 0.25;
  });

  const electrons = useMemo(() => {
    return Array.from({ length: electronCount }, (_, index) => {
      const angle = (index / electronCount) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0,
      };
    });
  }, [electronCount, radius]);

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.014, 8, 96]} />
        <meshBasicMaterial color={shellColor} transparent opacity={0.42} />
      </mesh>
      {electrons.map((position, index) => (
        <mesh key={index} position={[position.x, position.y, position.z]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial
            color={ELECTRON_COLOR}
            emissive={ELECTRON_COLOR}
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function AtomModel({ element }: AtomModelProps) {
  return (
    <group>
      <Nucleus element={element} />
      {element.electronShells.map((count, shellIndex) => (
        <ElectronShell
          key={shellIndex}
          shellIndex={shellIndex}
          electronCount={count}
          spinOffset={shellIndex * 1.2}
          shellColor={SHELL_COLORS[shellIndex % SHELL_COLORS.length]}
        />
      ))}
    </group>
  );
}

export function getViewRadiusForElement(element: ElementDetails): number {
  return getAtomViewRadius(element.electronShells.length);
}
