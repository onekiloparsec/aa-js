/**
 @module Mars
 */
import Decimal from 'decimal.js'
import { Degree, LengthArray, PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: new Decimal(3396.19),
  meanRadius: new Decimal(3389.50),
  mass: new Decimal(0.641_712),
  bulkDensity: new Decimal(3.9341),
  siderealRotationPeriod: new Decimal(1.025_956_76),
  siderealOrbitPeriod: new Decimal(1.880_847_6),
  visualMagnitude: new Decimal(-1.52),
  geometricAlbedo: new Decimal(0.150),
  equatorialGravity: new Decimal(3.71),
  escapeVelocity: new Decimal(5.03)
}


/**
 * Orbital Elements for the mean equinox of date
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-213 (Table 31.A).
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: new Decimal(1.523_679_342),

  meanLongitude: [355.433, 19141.696_447_1, 0.000_310_52, 0.000_000_016]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  eccentricity: [0.093_400_65, 0.000_090_484, -0.000_000_080_6, -0.000_000_00025]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  inclination: [1.849_726, -0.000_601_1, 0.000_012_76, -0.000_000_007]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  longitudeOfAscendingNode: [49.558_093, 0.772_095_9, 0.000_015_57, 0.000_002_267]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  longitudeOfPerihelion: [336.060_234, 1.841_044_9, 0.000_134_77, 0.000_000_536]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>
}

/**
 * Orbital Elements for the standard equinox J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-213 (Table 31.B).
 */
export const orbitalElementsJ2000: PlanetOrbitalElements = {
  semiMajorAxis: orbitalElements.semiMajorAxis,

  meanLongitude: [355.433, 19140.299_3039, 0.000_002_62, -0.000_000_003]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  eccentricity: orbitalElements.eccentricity,

  inclination: [1.849_726, -0.008_147_7, -0.000_022_55, -0.000_000_29]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  longitudeOfAscendingNode: [49.558_093, -0.295_025, -0.000_640_48, -0.000_001_964]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  longitudeOfPerihelion: [336.060_234, 0.443_901_6, -0.000_173_13, 0.000_000_518]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>
}
