const SHELL_CAPACITY = [2, 8, 18, 32, 32, 18, 8];

export function getElectronShells(atomicNumber: number): number[] {
  const shells: number[] = [];
  let remaining = atomicNumber;

  for (const capacity of SHELL_CAPACITY) {
    if (remaining <= 0) break;
    const count = Math.min(remaining, capacity);
    shells.push(count);
    remaining -= count;
  }

  return shells;
}

export function getNeutronCount(atomicNumber: number, atomicMass: number): number {
  return Math.max(0, Math.round(atomicMass) - atomicNumber);
}

export function getShellRadius(shellIndex: number): number {
  return 1.4 + shellIndex * 0.85;
}

export function getAtomViewRadius(shellCount: number): number {
  if (shellCount <= 0) {
    return 4;
  }

  return getShellRadius(shellCount - 1) + 2.2;
}

export type NucleonKind = 'proton' | 'neutron';

export interface NucleonSpherePosition {
  position: [number, number, number];
  kind: NucleonKind;
}

/** Evenly space protons among nucleon slots so they mix through the nucleus volume. */
export function distributeProtonSlots(total: number, protonCount: number): boolean[] {
  const slots = Array<boolean>(total).fill(false);

  if (total <= 0 || protonCount <= 0) {
    return slots;
  }

  if (protonCount >= total) {
    return slots.fill(true);
  }

  let accumulator = 0;
  for (let i = 0; i < total; i += 1) {
    accumulator += protonCount;
    if (accumulator >= total) {
      slots[i] = true;
      accumulator -= total;
    }
  }

  return slots;
}

function getNucleusParticleScale(total: number): number {
  if (total <= 0) {
    return 0.05;
  }

  return Math.min(0.09, Math.max(0.022, 0.5 / Math.cbrt(total)));
}

/** Radius that fits `total` same-size spheres in close-packed arrangement. */
function getNucleusClusterRadius(total: number, particleScale: number): number {
  if (total <= 0) {
    return 0;
  }

  const closePackedRadius = particleScale * Math.pow((9 * total) / (8 * Math.PI), 1 / 3);
  return closePackedRadius * 1.02;
}

function getFibonacciSpherePosition(
  index: number,
  total: number,
  clusterRadius: number,
  goldenAngle: number,
): [number, number, number] {
  const t = index + 0.5;
  const radius = clusterRadius * Math.cbrt(t / total);
  const inclination = Math.acos(1 - (2 * t) / total);
  const azimuth = goldenAngle * index;

  return [
    radius * Math.sin(inclination) * Math.cos(azimuth),
    radius * Math.sin(inclination) * Math.sin(azimuth),
    radius * Math.cos(inclination),
  ];
}

export function getNucleusLayout(atomicNumber: number, neutrons: number) {
  const protonCount = Math.max(0, atomicNumber);
  const neutronCount = Math.max(0, neutrons);
  const total = protonCount + neutronCount;
  const particleScale = getNucleusParticleScale(total);
  const clusterRadius = getNucleusClusterRadius(total, particleScale);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const protonSlots = distributeProtonSlots(total, protonCount);

  const nucleons: NucleonSpherePosition[] = [];
  const protons: Array<[number, number, number]> = [];
  const neutronPositions: Array<[number, number, number]> = [];

  for (let i = 0; i < total; i += 1) {
    const position = getFibonacciSpherePosition(i, total, clusterRadius, goldenAngle);
    const kind: NucleonKind = protonSlots[i] ? 'proton' : 'neutron';

    nucleons.push({ position, kind });

    if (kind === 'proton') {
      protons.push(position);
    } else {
      neutronPositions.push(position);
    }
  }

  return { nucleons, protons, neutrons: neutronPositions, particleScale };
}
