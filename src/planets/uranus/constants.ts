import Decimal from '@/decimal'
import { AstronomicalUnit, Degree, Equinox, LengthArray, PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: new Decimal(25559.0),
  meanRadius: new Decimal(25362),
  mass: new Decimal(86.8127),
  bulkDensity: new Decimal(1.270),
  siderealRotationPeriod: new Decimal(-0.71833), // negative
  siderealOrbitPeriod: new Decimal(84.016846),
  visualMagnitude: new Decimal(-7.19),
  geometricAlbedo: new Decimal(0.51),
  equatorialGravity: new Decimal(8.87),
  escapeVelocity: new Decimal(21.38)
}


/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: [19.218_446_062, -0.000_000_0372, 0.000_000_000_98, 0]
    .map(v => new Decimal(v)) as LengthArray<AstronomicalUnit, 4>,

  eccentricity: [0.046_381_22, -0.000_027_293, 0.000_000_0789, 0.000_000_000_24]
    .map(v => new Decimal(v)) as LengthArray<Decimal, 4>,

  [Equinox.MeanOfTheDate]: {
    meanLongitude: [314.055_005, 429.824_0561, 0.000_303_90, 0.000_000_026]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    inclination: [0.773_197, 0.000_7744, 0.000_037_49, -0.000_000_092]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfAscendingNode: [74.005_957, 0.521_1278, 0.001_339_47, 0.000_018_484]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfPerihelion: [173.005_291, 1.486_3790, 0.000_214_06, 0.000_000_434]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>
  },
  [Equinox.StandardJ2000]: {
    meanLongitude: [314.055_005, 428.466_9983, -0.000_004_86, 0.000_000_006]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    inclination: [0.773_197, -0.001_6869, 0.000_003_49, 0.000_000_016]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfAscendingNode: [74.005_957, 0.074_1431, 0.000_405_39, 0.000_000_119]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfPerihelion: [173.005_291, 0.089_3212, -0.000_094_70, 0.000_000_414]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>
  }
}
