/**
 * @module Uranus
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
 * @memberof module:Uranus
 */
export const constants: PlanetConstants = {
  equatorialRadius: 25559.0,
  meanRadius: 25362,
  mass: 86.8127,
  bulkDensity: 1.270,
  siderealRotationPeriod: -0.71833, // negative
  siderealOrbitPeriod: 84.016846,
  visualMagnitude: -7.19,
  geometricAlbedo: 0.51,
  equatorialGravity: 8.87,
  escapeVelocity: 21.38
}


/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 * @memberof module:Uranus
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: [19.218_446_062, -0.000_000_0372, 0.000_000_000_98, 0],
  eccentricity: [0.046_381_22, -0.000_027_293, 0.000_000_0789, 0.000_000_000_24],
  
  [Equinox.MeanOfTheDate]: {
    meanLongitude: [314.055_005, 429.824_0561, 0.000_303_90, 0.000_000_026],
    inclination: [0.773_197, 0.000_7744, 0.000_037_49, -0.000_000_092],
    longitudeOfAscendingNode: [74.005_957, 0.521_1278, 0.001_339_47, 0.000_018_484],
    longitudeOfPerihelion: [173.005_291, 1.486_3790, 0.000_214_06, 0.000_000_434]
  },
  [Equinox.StandardJ2000]: {
    meanLongitude: [314.055_005, 428.466_9983, -0.000_004_86, 0.000_000_006],
    inclination: [0.773_197, -0.001_6869, 0.000_003_49, 0.000_000_016],
    longitudeOfAscendingNode: [74.005_957, 0.074_1431, 0.000_405_39, 0.000_000_119],
    longitudeOfPerihelion: [173.005_291, 0.089_3212, -0.000_094_70, 0.000_000_414]
  }
}
