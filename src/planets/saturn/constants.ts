import Decimal from 'decimal.js'
import { AstronomicalUnit, Degree, Equinox, LengthArray, PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: new Decimal(60268),
  meanRadius: new Decimal(58232),
  mass: new Decimal(568.3174),
  bulkDensity: new Decimal(0.6871),
  siderealRotationPeriod: new Decimal(0.44401),
  siderealOrbitPeriod: new Decimal(29.447498),
  visualMagnitude: new Decimal(-8.88),
  geometricAlbedo: new Decimal(0.47),
  equatorialGravity: new Decimal(10.44),
  escapeVelocity: new Decimal(36.09)
}

/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: [9.554_909_192, -0.000_002_1390, 0.000_000_004, 0]
    .map(v => new Decimal(v)) as LengthArray<AstronomicalUnit, 4>,

  eccentricity: [0.055_548_14, -0.000_346_641, -0.000_000_6436, 0.000_000_003_40]
    .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

  [Equinox.MeanOfTheDate]: {
    meanLongitude: [50.077_444, 1223.511_0686, 0.000_519_08, -0.000_000_030]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    inclination: [2.488_879, -0.003_7362, -0.000_015_19, 0.000_000_087]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfAscendingNode: [113.665_503, 0.877_0880, -0.000_121_76, -0.000_002_249]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfPerihelion: [93.057_237, 1.963_7613, 0.000_837_53, 0.000_004_928]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,
  },

  [Equinox.StandardJ2000]: {
    meanLongitude: [50.077_444, 1222.113_8488, 0.000_210_04, -0.000_000_046]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    inclination: [2.488_879, 0.002_5514, -0.000_049_06, 0.000_000_017]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfAscendingNode: [113.665_503, -0.256_6722, -0.000_183_99, 0.000_000_480]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,

    longitudeOfPerihelion: [93.057_237, 0.566_5415, 0.000_528_50, 0.000_004_912]
      .map(v => new Decimal(v)) as LengthArray<Degree, 4>,
  }
}
