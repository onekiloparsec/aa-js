/**
 @module Neptune
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
 * @memberof module:Neptune
 */
export const constants: PlanetConstants = {
  equatorialRadius: 24764,
  meanRadius: 24622,
  mass: 102.4126,
  bulkDensity: 1.638,
  siderealRotationPeriod: 0.67125,
  siderealOrbitPeriod: 164.79132,
  visualMagnitude: -6.87,
  geometricAlbedo: 0.41,
  equatorialGravity: 11.15,
  escapeVelocity: 23.56
}

/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: [30.110_386_869, -0.000_000_1663, 0, 0],
  eccentricity: [0.009_455_75, 0.000_006_033, 0, -0.000_000_000_05],
  
  [Equinox.MeanOfTheDate]: {
    meanLongitude: [304.348_665, 219.883_3092, 0.000_308_82, 0.000_000_018],
    inclination: [1.769_953, -0.009_3082, -0.000_007_08, 0.000_000_27],
    longitudeOfAscendingNode: [131.784_057, 1.102_2039, 0.000_259_52, -0.000_000_637],
    longitudeOfPerihelion: [48.120_276, 1.426_2957, 0.000_384_34, 0.000_000_020]
  },
  
  [Equinox.StandardJ2000]: {
    meanLongitude: [304.348_665, 218.486_2002, 0.000_000_59, -0.000_000_002],
    inclination: [1.769_953, 0.000_2256, 0.000_000_23, 0],
    longitudeOfAscendingNode: [131.784_057, -0.006_1651, -0.000_002_19, -0.000_000_078],
    longitudeOfPerihelion: [48.120_276, 0.029_1866, 0.000_076_10, 0]
  }
}
