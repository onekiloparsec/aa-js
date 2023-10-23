import Decimal from 'decimal.js'
import { AstronomicalUnit, Degree, LengthArray, PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: new Decimal(6051.8),
  meanRadius: new Decimal(6051.8),
  mass: new Decimal(4.86747),
  bulkDensity: new Decimal(5.243),
  siderealRotationPeriod: new Decimal(-243.018), // negative
  siderealOrbitPeriod: new Decimal(0.61519726),
  visualMagnitude: new Decimal(-4.47),
  geometricAlbedo: new Decimal(0.65),
  equatorialGravity: new Decimal(8.87),
  escapeVelocity: new Decimal(10.36)
}

/**
 * Orbital Elements for the mean equinox of date
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-213 (Table 31.A).
 */
export const orbitalElements: PlanetOrbitalElements = {
  meanLongitude: [181.979_801, 58519.213_0302, 0.000_310_14, 0.000_000_015]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  semiMajorAxis: [0.723_329_820, 0, 0, 0]
    .map(v => new Decimal(v)) as LengthArray<AstronomicalUnit, 4>,

  eccentricity: [0.006_771_92, -0.000_047_765, 0.000_000_0981, 0.000_000_000_46]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  inclination: [3.394_662, 0.001_0037, -0.000_000_88, -0.000_000_007]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  longitudeOfAscendingNode: [76.679_920, 0.901_1206, 0.000_406_18, -0.000_000_093]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  longitudeOfPerihelion: [131.563_703, 1.402_2288, -0.001_076_18, -0.000_005_678]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>
}

/**
 * Orbital Elements for the standard equinox J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-213 (Table 31.B).
 */
export const orbitalElementsJ2000: PlanetOrbitalElements = {
  meanLongitude: [181.979_801, 58517.815_6760, 0.000_001_65, -0.000_000_002]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  semiMajorAxis: orbitalElements.semiMajorAxis,

  eccentricity: orbitalElements.eccentricity,

  inclination: [3.394_662, -0.000_8568, -0.000_032_44, 0.000_000_09]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  longitudeOfAscendingNode: [76.679_920, -0.278_0134, -0.000_142_57, -0.000_000_164]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  longitudeOfPerihelion: [131.563_703, 0.004_8746, -0.001_384_67, -0.000_005_695]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,
}
