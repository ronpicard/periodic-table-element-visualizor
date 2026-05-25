import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, InstancedMesh } from 'three';
import { Object3D } from 'three';
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

function InstancedParticles({
  positions,
  color,
  scale,
}: {
  positions: Array<[number, number, number]>;
  color: string;
  scale: number;
}) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || positions.length === 0) {
      return;
    }

    const dummy = new Object3D();

    positions.forEach((position, index) => {
      dummy.position.set(...position);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, scale]);

  if (positions.length === 0) {
    return null;
  }

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.45}
        roughness={0.35}
        metalness={0.1}
      />
    </instancedMesh>
  );
}

function Nucleus({ element }: { element: ElementDetails }) {
  const { protons, neutrons, particleScale } = useMemo(
    () => getNucleusLayout(element.atomicNumber, element.neutrons),
    [element.atomicNumber, element.neutrons],
  );

  return (
    <group>
      <InstancedParticles positions={protons} color={PROTON_COLOR} scale={particleScale} />
      <InstancedParticles positions={neutrons} color={NEUTRON_COLOR} scale={particleScale} />
    </group>
  );
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
