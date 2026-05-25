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

const SUBSHELL_MAX_ELECTRONS = [2, 6, 10, 14] as const;

export interface ElectronOrbitLayout {
  radius: number;
  /** Unit normal of the orbital plane (electron travels in the perpendicular plane). */
  normal: [number, number, number];
  /** Starting angles (radians) for each electron on this orbit. */
  phases: number[];
  /** Radians per second; inner Bohr shells orbit faster (~1/n²). */
  angularSpeed: number;
}

interface SubshellAllocation {
  subshellIndex: number;
  electronCount: number;
}

/** How many electrons sit in each subshell (s, p, d, f) for principal shell n. */
export function getSubshellAllocations(shellIndex: number, electronCount: number): SubshellAllocation[] {
  const principalQuantumNumber = shellIndex + 1;
  const allocations: SubshellAllocation[] = [];
  let remaining = electronCount;

  for (let subshellIndex = 0; subshellIndex < SUBSHELL_MAX_ELECTRONS.length && remaining > 0; subshellIndex += 1) {
    if (principalQuantumNumber <= subshellIndex) {
      break;
    }

    const capacity = SUBSHELL_MAX_ELECTRONS[subshellIndex];
    const assigned = Math.min(remaining, capacity);
    allocations.push({ subshellIndex, electronCount: assigned });
    remaining -= assigned;
  }

  return allocations;
}

const P_ORBITAL_NORMALS: Array<[number, number, number]> = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

/** Five d-orbital plane orientations (mutually distinct). */
const D_ORBITAL_NORMALS: Array<[number, number, number]> = [
  [0, 0, 1],
  [1, 0, 0],
  [0, 1, 0],
  [0.707, 0.707, 0],
  [0.707, 0, 0.707],
];

function normalizeVector(vector: [number, number, number]): [number, number, number] {
  const length = Math.hypot(vector[0], vector[1], vector[2]);
  if (length === 0) {
    return [0, 0, 1];
  }

  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function getOrbitalPlaneNormals(subshellIndex: number): Array<[number, number, number]> {
  if (subshellIndex === 0) {
    return [[0, 0, 1]];
  }

  if (subshellIndex === 1) {
    return P_ORBITAL_NORMALS.map(normalizeVector);
  }

  if (subshellIndex === 2) {
    return D_ORBITAL_NORMALS.map(normalizeVector);
  }

  const count = 7;
  const normals: Array<[number, number, number]> = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const inclination = Math.acos(1 - (2 * (i + 0.5)) / count);
    const azimuth = goldenAngle * i;
    normals.push(
      normalizeVector([
        Math.sin(inclination) * Math.cos(azimuth),
        Math.sin(inclination) * Math.sin(azimuth),
        Math.cos(inclination),
      ]),
    );
  }

  return normals;
}

/** Spread electrons across orbitals (max 2 per orbital, paired at opposite phases). */
export function assignElectronsToOrbitals(
  electronCount: number,
  orbitalCount: number,
  maxPerOrbital = 2,
): number[] {
  const perOrbital = Array<number>(orbitalCount).fill(0);
  let remaining = electronCount;
  let orbitalIndex = 0;

  while (remaining > 0) {
    if (perOrbital[orbitalIndex] < maxPerOrbital) {
      perOrbital[orbitalIndex] += 1;
      remaining -= 1;
    }

    orbitalIndex = (orbitalIndex + 1) % orbitalCount;
  }

  return perOrbital;
}

export function getElectronPhasesOnOrbit(electronCount: number): number[] {
  if (electronCount <= 0) {
    return [];
  }

  if (electronCount === 1) {
    return [0];
  }

  return Array.from({ length: electronCount }, (_, index) => (index * Math.PI * 2) / electronCount);
}

/** Bohr-style angular speed: inner shells complete orbits faster. */
export function getShellAngularSpeed(shellIndex: number): number {
  const principalQuantumNumber = shellIndex + 1;
  return 1.35 / principalQuantumNumber ** 2;
}

export function getElectronOrbitalLayout(shellIndex: number, electronCount: number): ElectronOrbitLayout[] {
  if (electronCount <= 0) {
    return [];
  }

  const radius = getShellRadius(shellIndex);
  const angularSpeed = getShellAngularSpeed(shellIndex);
  const orbits: ElectronOrbitLayout[] = [];
  const allocations = getSubshellAllocations(shellIndex, electronCount);

  for (const { subshellIndex, electronCount: subshellElectrons } of allocations) {
    const planeNormals = getOrbitalPlaneNormals(subshellIndex);
    const electronsPerOrbital = assignElectronsToOrbitals(subshellElectrons, planeNormals.length);

    electronsPerOrbital.forEach((count, orbitalIndex) => {
      if (count <= 0) {
        return;
      }

      orbits.push({
        radius,
        normal: planeNormals[orbitalIndex],
        phases: getElectronPhasesOnOrbit(count),
        angularSpeed,
      });
    });
  }

  return orbits;
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
