import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { InstancedMesh, Mesh } from 'three';
import { Object3D, Quaternion, Vector3 } from 'three';
import type { ElectronOrbitLayout } from '@/shared/lib/atom-structure';
import {
  getAtomViewRadius,
  getElectronOrbitalLayout,
  getNucleusLayout,
} from '@/shared/lib/atom-structure';
import type { ElementDetails } from '@/shared/types/element';

interface AtomModelProps {
  element: ElementDetails;
}

const PROTON_COLOR = '#4dabf7';
const NEUTRON_COLOR = '#868e96';
const ELECTRON_COLOR = '#ff4757';
const SHELL_COLORS = ['#ffd43b', '#69db7c', '#748ffc', '#da77f2', '#ff922b', '#38d9a9', '#e599f7'];

function InstancedNucleonLayer({
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
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, positions.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 14, 14]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.55}
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
      <InstancedNucleonLayer positions={neutrons} color={NEUTRON_COLOR} scale={particleScale} />
      <InstancedNucleonLayer positions={protons} color={PROTON_COLOR} scale={particleScale} />
    </group>
  );
}

const ORBIT_AXIS = new Vector3(0, 0, 1);

function getOrbitBasis(normal: [number, number, number]) {
  const normalVector = new Vector3(...normal);
  const reference = Math.abs(normalVector.z) < 0.9 ? new Vector3(0, 0, 1) : new Vector3(1, 0, 0);
  const tangentU = new Vector3().crossVectors(normalVector, reference).normalize();
  const tangentV = new Vector3().crossVectors(normalVector, tangentU).normalize();

  return {
    tangentU: tangentU.toArray() as [number, number, number],
    tangentV: tangentV.toArray() as [number, number, number],
  };
}

function OrbitalRing({ orbit, color }: { orbit: ElectronOrbitLayout; color: string }) {
  const alignment = useMemo(() => {
    const quaternion = new Quaternion();
    quaternion.setFromUnitVectors(ORBIT_AXIS, new Vector3(...orbit.normal));
    return quaternion;
  }, [orbit.normal]);

  return (
    <group quaternion={alignment}>
      <mesh>
        <torusGeometry args={[orbit.radius, 0.014, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

function OrbitingElectron({
  orbit,
  phase,
}: {
  orbit: ElectronOrbitLayout;
  phase: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const basis = useMemo(() => getOrbitBasis(orbit.normal), [orbit.normal]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const angle = phase + clock.getElapsedTime() * orbit.angularSpeed;
    const [ux, uy, uz] = basis.tangentU;
    const [vx, vy, vz] = basis.tangentV;
    const radius = orbit.radius;

    mesh.position.set(
      radius * (Math.cos(angle) * ux + Math.sin(angle) * vx),
      radius * (Math.cos(angle) * uy + Math.sin(angle) * vy),
      radius * (Math.cos(angle) * uz + Math.sin(angle) * vz),
    );
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.065, 12, 12]} />
      <meshStandardMaterial
        color={ELECTRON_COLOR}
        emissive={ELECTRON_COLOR}
        emissiveIntensity={0.9}
        roughness={0.2}
      />
    </mesh>
  );
}

function ElectronShell({
  shellIndex,
  electronCount,
  shellColor,
}: {
  shellIndex: number;
  electronCount: number;
  shellColor: string;
}) {
  const orbits = useMemo(
    () => getElectronOrbitalLayout(shellIndex, electronCount),
    [shellIndex, electronCount],
  );

  return (
    <group>
      {orbits.map((orbit, orbitIndex) => (
        <group key={`${shellIndex}-${orbitIndex}-${orbit.normal.join(',')}`}>
          <OrbitalRing orbit={orbit} color={shellColor} />
          {orbit.phases.map((phase, electronIndex) => (
            <OrbitingElectron
              key={`${orbitIndex}-${electronIndex}`}
              orbit={orbit}
              phase={phase}
            />
          ))}
        </group>
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
          shellColor={SHELL_COLORS[shellIndex % SHELL_COLORS.length]}
        />
      ))}
    </group>
  );
}

export function getViewRadiusForElement(element: ElementDetails): number {
  return getAtomViewRadius(element.electronShells.length);
}
