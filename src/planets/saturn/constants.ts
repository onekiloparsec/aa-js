/**
 @module Saturn
 */

import { Equinox, PlanetConstants, PlanetOrbitalElements } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: {@link https://ssd.jpl.nasa.gov/?planet_phys_par}
 * @property {Kilometer} equatorialRadius Planet's equatorial radius
 * @property {Kilometer} meanRadius Planet's mean radius
 * @property {Kilogram24} mass Planet's mass
 * @property {GramPerCubicCentimeter} bulkDensity Planet's bulk density
 * @property {Day} siderealRotationPeriod Planet's sidereal rotation period
 * @property {Year} siderealOrbitPeriod Planet's orbit rotation period
 * @property {Magnitude} visualMagnitude Planet's visual magnitude
 * @property {Albedo} geometricAlbedo Planet's geometric albedo
 * @property {MeterPerSquareSecond} equatorialGravity Planet's equatorial gravity
 * @property {KilometerPerSecond} Planet's escale velocity
 * @memberof module:Saturn
 */
export const constants: PlanetConstants = {
  equatorialRadius: 60268,
  meanRadius: 58232,
  mass: 568.3174,
  bulkDensity: 0.6871,
  siderealRotationPeriod: 0.44401,
  siderealOrbitPeriod: 29.447_498,
  visualMagnitude: -8.88,
  geometricAlbedo: 0.47,
  equatorialGravity: 10.44,
  escapeVelocity: 36.09
}

/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: [9.554_909_192, -0.000_002_1390, 0.000_000_004, 0],
  eccentricity: [0.055_548_14, -0.000_346_641, -0.000_000_6436, 0.000_000_003_40],
  
  [Equinox.MeanOfTheDate]: {
    meanLongitude: [50.077_444, 1223.511_0686, 0.000_519_08, -0.000_000_030],
    inclination: [2.488_879, -0.003_7362, -0.000_015_19, 0.000_000_087],
    longitudeOfAscendingNode: [113.665_503, 0.877_0880, -0.000_121_76, -0.000_002_249],
    longitudeOfPerihelion: [93.057_237, 1.963_7613, 0.000_837_53, 0.000_004_928],
  },
  
  [Equinox.StandardJ2000]: {
    meanLongitude: [50.077_444, 1222.113_8488, 0.000_210_04, -0.000_000_046],
    inclination: [2.488_879, 0.002_5514, -0.000_049_06, 0.000_000_017],
    longitudeOfAscendingNode: [113.665_503, -0.256_6722, -0.000_183_99, 0.000_000_480],
    longitudeOfPerihelion: [93.057_237, 0.566_5415, 0.000_528_50, 0.000_004_912],
  }
}
