/**
 @module Venus
 */

import { Equinox, PlanetConstants, PlanetOrbitalElements } from '@/js/types'

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
 * @memberof module:Venus
 */
export const constants: PlanetConstants = {
  equatorialRadius: 6051.8,
  meanRadius: 6051.8,
  mass: 4.86747,
  bulkDensity: 5.243,
  siderealRotationPeriod: -243.018, // negative
  siderealOrbitPeriod: 0.61519726,
  visualMagnitude: -4.47,
  geometricAlbedo: 0.65,
  equatorialGravity: 8.87,
  escapeVelocity: 10.36
}

/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: [0.723_329_820, 0, 0, 0],
  eccentricity: [0.006_771_92, -0.000_047_765, 0.000_000_0981, 0.000_000_000_46],
  
  [Equinox.MeanOfTheDate]: {
    meanLongitude: [181.979_801, 58519.213_0302, 0.000_310_14, 0.000_000_015],
    inclination: [3.394_662, 0.001_0037, -0.000_000_88, -0.000_000_007],
    longitudeOfAscendingNode: [76.679_920, 0.901_1206, 0.000_406_18, -0.000_000_093],
    longitudeOfPerihelion: [131.563_703, 1.402_2288, -0.001_076_18, -0.000_005_678]
  },
  
  [Equinox.StandardJ2000]: {
    meanLongitude: [181.979_801, 58517.815_6760, 0.000_001_65, -0.000_000_002],
    inclination: [3.394_662, -0.000_8568, -0.000_032_44, 0.000_000_09],
    longitudeOfAscendingNode: [76.679_920, -0.278_0134, -0.000_142_57, -0.000_000_164],
    longitudeOfPerihelion: [131.563_703, 0.004_8746, -0.001_384_67, -0.000_005_695],
  }
}
