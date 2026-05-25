import type { Element, ElementCategory } from '@/shared/types/element';

type ElementSeed = [symbol: string, name: string, category: ElementCategory, atomicMass: number];

const ELEMENT_SEEDS: ElementSeed[] = [
  ['H', 'Hydrogen', 'nonmetal', 1.008],
  ['He', 'Helium', 'noble-gas', 4.003],
  ['Li', 'Lithium', 'alkali-metal', 6.94],
  ['Be', 'Beryllium', 'alkaline-earth', 9.012],
  ['B', 'Boron', 'metalloid', 10.81],
  ['C', 'Carbon', 'nonmetal', 12.011],
  ['N', 'Nitrogen', 'nonmetal', 14.007],
  ['O', 'Oxygen', 'nonmetal', 15.999],
  ['F', 'Fluorine', 'halogen', 18.998],
  ['Ne', 'Neon', 'noble-gas', 20.18],
  ['Na', 'Sodium', 'alkali-metal', 22.99],
  ['Mg', 'Magnesium', 'alkaline-earth', 24.305],
  ['Al', 'Aluminum', 'post-transition', 26.982],
  ['Si', 'Silicon', 'metalloid', 28.085],
  ['P', 'Phosphorus', 'nonmetal', 30.974],
  ['S', 'Sulfur', 'nonmetal', 32.06],
  ['Cl', 'Chlorine', 'halogen', 35.45],
  ['Ar', 'Argon', 'noble-gas', 39.948],
  ['K', 'Potassium', 'alkali-metal', 39.098],
  ['Ca', 'Calcium', 'alkaline-earth', 40.078],
  ['Sc', 'Scandium', 'transition-metal', 44.956],
  ['Ti', 'Titanium', 'transition-metal', 47.867],
  ['V', 'Vanadium', 'transition-metal', 50.942],
  ['Cr', 'Chromium', 'transition-metal', 51.996],
  ['Mn', 'Manganese', 'transition-metal', 54.938],
  ['Fe', 'Iron', 'transition-metal', 55.845],
  ['Co', 'Cobalt', 'transition-metal', 58.933],
  ['Ni', 'Nickel', 'transition-metal', 58.693],
  ['Cu', 'Copper', 'transition-metal', 63.546],
  ['Zn', 'Zinc', 'transition-metal', 65.38],
  ['Ga', 'Gallium', 'post-transition', 69.723],
  ['Ge', 'Germanium', 'metalloid', 72.63],
  ['As', 'Arsenic', 'metalloid', 74.922],
  ['Se', 'Selenium', 'nonmetal', 78.971],
  ['Br', 'Bromine', 'halogen', 79.904],
  ['Kr', 'Krypton', 'noble-gas', 83.798],
  ['Rb', 'Rubidium', 'alkali-metal', 85.468],
  ['Sr', 'Strontium', 'alkaline-earth', 87.62],
  ['Y', 'Yttrium', 'transition-metal', 88.906],
  ['Zr', 'Zirconium', 'transition-metal', 91.224],
  ['Nb', 'Niobium', 'transition-metal', 92.906],
  ['Mo', 'Molybdenum', 'transition-metal', 95.95],
  ['Tc', 'Technetium', 'transition-metal', 98],
  ['Ru', 'Ruthenium', 'transition-metal', 101.07],
  ['Rh', 'Rhodium', 'transition-metal', 102.906],
  ['Pd', 'Palladium', 'transition-metal', 106.42],
  ['Ag', 'Silver', 'transition-metal', 107.868],
  ['Cd', 'Cadmium', 'transition-metal', 112.414],
  ['In', 'Indium', 'post-transition', 114.818],
  ['Sn', 'Tin', 'post-transition', 118.71],
  ['Sb', 'Antimony', 'metalloid', 121.76],
  ['Te', 'Tellurium', 'metalloid', 127.6],
  ['I', 'Iodine', 'halogen', 126.904],
  ['Xe', 'Xenon', 'noble-gas', 131.293],
  ['Cs', 'Cesium', 'alkali-metal', 132.905],
  ['Ba', 'Barium', 'alkaline-earth', 137.327],
  ['La', 'Lanthanum', 'lanthanide', 138.905],
  ['Ce', 'Cerium', 'lanthanide', 140.116],
  ['Pr', 'Praseodymium', 'lanthanide', 140.908],
  ['Nd', 'Neodymium', 'lanthanide', 144.242],
  ['Pm', 'Promethium', 'lanthanide', 145],
  ['Sm', 'Samarium', 'lanthanide', 150.36],
  ['Eu', 'Europium', 'lanthanide', 151.964],
  ['Gd', 'Gadolinium', 'lanthanide', 157.25],
  ['Tb', 'Terbium', 'lanthanide', 158.925],
  ['Dy', 'Dysprosium', 'lanthanide', 162.5],
  ['Ho', 'Holmium', 'lanthanide', 164.93],
  ['Er', 'Erbium', 'lanthanide', 167.259],
  ['Tm', 'Thulium', 'lanthanide', 168.934],
  ['Yb', 'Ytterbium', 'lanthanide', 173.054],
  ['Lu', 'Lutetium', 'lanthanide', 174.967],
  ['Hf', 'Hafnium', 'transition-metal', 178.49],
  ['Ta', 'Tantalum', 'transition-metal', 180.948],
  ['W', 'Tungsten', 'transition-metal', 183.84],
  ['Re', 'Rhenium', 'transition-metal', 186.207],
  ['Os', 'Osmium', 'transition-metal', 190.23],
  ['Ir', 'Iridium', 'transition-metal', 192.217],
  ['Pt', 'Platinum', 'transition-metal', 195.084],
  ['Au', 'Gold', 'transition-metal', 196.967],
  ['Hg', 'Mercury', 'transition-metal', 200.592],
  ['Tl', 'Thallium', 'post-transition', 204.383],
  ['Pb', 'Lead', 'post-transition', 207.2],
  ['Bi', 'Bismuth', 'post-transition', 208.98],
  ['Po', 'Polonium', 'metalloid', 209],
  ['At', 'Astatine', 'halogen', 210],
  ['Rn', 'Radon', 'noble-gas', 222],
  ['Fr', 'Francium', 'alkali-metal', 223],
  ['Ra', 'Radium', 'alkaline-earth', 226],
  ['Ac', 'Actinium', 'actinide', 227],
  ['Th', 'Thorium', 'actinide', 232.038],
  ['Pa', 'Protactinium', 'actinide', 231.036],
  ['U', 'Uranium', 'actinide', 238.029],
  ['Np', 'Neptunium', 'actinide', 237],
  ['Pu', 'Plutonium', 'actinide', 244],
  ['Am', 'Americium', 'actinide', 243],
  ['Cm', 'Curium', 'actinide', 247],
  ['Bk', 'Berkelium', 'actinide', 247],
  ['Cf', 'Californium', 'actinide', 251],
  ['Es', 'Einsteinium', 'actinide', 252],
  ['Fm', 'Fermium', 'actinide', 257],
  ['Md', 'Mendelevium', 'actinide', 258],
  ['No', 'Nobelium', 'actinide', 259],
  ['Lr', 'Lawrencium', 'actinide', 266],
  ['Rf', 'Rutherfordium', 'transition-metal', 267],
  ['Db', 'Dubnium', 'transition-metal', 268],
  ['Sg', 'Seaborgium', 'transition-metal', 269],
  ['Bh', 'Bohrium', 'transition-metal', 270],
  ['Hs', 'Hassium', 'transition-metal', 269],
  ['Mt', 'Meitnerium', 'unknown', 278],
  ['Ds', 'Darmstadtium', 'unknown', 281],
  ['Rg', 'Roentgenium', 'unknown', 282],
  ['Cn', 'Copernicium', 'unknown', 285],
  ['Nh', 'Nihonium', 'unknown', 286],
  ['Fl', 'Flerovium', 'unknown', 289],
  ['Mc', 'Moscovium', 'unknown', 290],
  ['Lv', 'Livermorium', 'unknown', 293],
  ['Ts', 'Tennessine', 'unknown', 294],
  ['Og', 'Oganesson', 'unknown', 294],
];

function getGridPosition(atomicNumber: number): { gridRow: number; gridColumn: number } {
  if (atomicNumber === 1) return { gridRow: 1, gridColumn: 1 };
  if (atomicNumber === 2) return { gridRow: 1, gridColumn: 18 };
  if (atomicNumber >= 3 && atomicNumber <= 4) {
    return { gridRow: 2, gridColumn: atomicNumber - 2 };
  }
  if (atomicNumber >= 5 && atomicNumber <= 10) {
    return { gridRow: 2, gridColumn: atomicNumber + 8 };
  }
  if (atomicNumber >= 11 && atomicNumber <= 12) {
    return { gridRow: 3, gridColumn: atomicNumber - 10 };
  }
  if (atomicNumber >= 13 && atomicNumber <= 18) {
    return { gridRow: 3, gridColumn: atomicNumber };
  }
  if (atomicNumber >= 19 && atomicNumber <= 36) {
    return { gridRow: 4, gridColumn: atomicNumber - 18 };
  }
  if (atomicNumber >= 37 && atomicNumber <= 54) {
    return { gridRow: 5, gridColumn: atomicNumber - 36 };
  }
  if (atomicNumber === 55) return { gridRow: 6, gridColumn: 1 };
  if (atomicNumber === 56) return { gridRow: 6, gridColumn: 2 };
  if (atomicNumber === 57) return { gridRow: 6, gridColumn: 3 };
  if (atomicNumber >= 58 && atomicNumber <= 71) {
    return { gridRow: 8, gridColumn: atomicNumber - 54 };
  }
  if (atomicNumber >= 72 && atomicNumber <= 86) {
    return { gridRow: 6, gridColumn: atomicNumber - 68 };
  }
  if (atomicNumber === 87) return { gridRow: 7, gridColumn: 1 };
  if (atomicNumber === 88) return { gridRow: 7, gridColumn: 2 };
  if (atomicNumber === 89) return { gridRow: 7, gridColumn: 3 };
  if (atomicNumber >= 90 && atomicNumber <= 103) {
    return { gridRow: 9, gridColumn: atomicNumber - 86 };
  }
  if (atomicNumber >= 104 && atomicNumber <= 118) {
    return { gridRow: 7, gridColumn: atomicNumber - 100 };
  }

  return { gridRow: 1, gridColumn: 1 };
}

export const ELEMENTS: Element[] = ELEMENT_SEEDS.map(([symbol, name, category, atomicMass], index) => {
  const atomicNumber = index + 1;
  const { gridRow, gridColumn } = getGridPosition(atomicNumber);

  return {
    atomicNumber,
    symbol,
    name,
    category,
    atomicMass,
    gridRow,
    gridColumn,
  };
});

export function getElementByNumber(atomicNumber: number): Element | undefined {
  return ELEMENTS.find((element) => element.atomicNumber === atomicNumber);
}
