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

export function getNucleusLayout(atomicNumber: number, neutrons: number) {
  const total = atomicNumber + neutrons;
  const clusterRadius = 0.16 * Math.cbrt(total);
  const particleScale = Math.min(0.075, Math.max(0.028, 0.55 / Math.cbrt(total)));
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const protons: Array<[number, number, number]> = [];
  const neutronPositions: Array<[number, number, number]> = [];

  for (let i = 0; i < total; i += 1) {
    const t = i + 0.5;
    const radius = clusterRadius * Math.cbrt(t / total);
    const inclination = Math.acos(1 - (2 * t) / total);
    const azimuth = goldenAngle * i;
    const position: [number, number, number] = [
      radius * Math.sin(inclination) * Math.cos(azimuth),
      radius * Math.sin(inclination) * Math.sin(azimuth),
      radius * Math.cos(inclination),
    ];

    if (i < atomicNumber) {
      protons.push(position);
    } else {
      neutronPositions.push(position);
    }
  }

  return { protons, neutrons: neutronPositions, particleScale };
}
