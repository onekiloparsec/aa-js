/**
 @module Jupiter
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
 * @memberof module:Jupiter
 */
export const constants: PlanetConstants = {
  equatorialRadius: 71492.0,
  meanRadius: 69911.0,
  mass: 1898.187,
  bulkDensity: 1.3262,
  siderealRotationPeriod: 0.413_54,
  siderealOrbitPeriod: 11.862_615,
  visualMagnitude: -9.40,
  geometricAlbedo: 0.52,
  equatorialGravity: 24.79,
  escapeVelocity: 60.20
}

/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 * @memberof module:Jupiter
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: [5.202_603_209, 0.000_000_1913, 0, 0],
  eccentricity: [0.048_497_93, 0.000_163_225, -0.000_000_4714, -0.000_000_002_01],
  
  [Equinox.MeanOfTheDate]: {
    meanLongitude: [34.351_519, 3036.302_7748, 0.000_223_30, 0.000_000_037],
    inclination: [1.303_267, -0.005_4965, 0.000_004_66, -0.000_000_002],
    longitudeOfAscendingNode: [100.464_407, 1.020_9774, 0.000_403_15, 0.000_000_404],
    longitudeOfPerihelion: [14.331_207, 1.612_6352, 0.001_030_42, -0.000_004_464]
  },
  
  [Equinox.StandardJ2000]: {
    meanLongitude: [34.351_519, 3034.905_6606, -0.000_085_01, 0.000_000_016],
    inclination: [1.303_267, -0.001_9877, 0.000_033_20, 0.000_000_097],
    longitudeOfAscendingNode: [100.464_407, 0.176_7232, 0.000_907, -0.000_007_272],
    longitudeOfPerihelion: [14.331_207, 0.215_5209, 0.000_722_11, -0.000_004_485]
  }
}


