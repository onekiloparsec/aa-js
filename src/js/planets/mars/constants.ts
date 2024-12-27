/**
 @module Mars
 */

import { AstronomicalUnit, Equinox, LengthArray, PlanetConstants, PlanetOrbitalElements } from '@/js/types'

/**
 * Planet constants, copied from the JPL, for completeness.
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
 * @memberof module:Mars
 */
export const constants: PlanetConstants = {
  equatorialRadius: 3396.19,
  meanRadius: 3389.50,
  mass: 0.641_712,
  bulkDensity: 3.9341,
  siderealRotationPeriod: 1.025_956_76,
  siderealOrbitPeriod: 1.880_847_6,
  visualMagnitude: -1.52,
  geometricAlbedo: 0.150,
  equatorialGravity: 3.71,
  escapeVelocity: 5.03
}

/**
 * Orbital Elements for the mean equinox of date and std J2000
 * Reference: Astronomical Algorithms, J. Meus, pp. 212-215 (Table 31.A & 31.B).
 * @property {LengthArray<AstronomicalUnit, 4>} semiMajorAxis Terms to compute time-dependent planets semi major-axis.
 * @property {LengthArray<number, 4>} eccentricity Terms to compute time-dependent planets eccentricity.
 * @memberof module:Mars
 */
export const orbitalElements: PlanetOrbitalElements = {
  semiMajorAxis: [1.523_679_342, 0, 0, 0],
  eccentricity: [0.093_400_65, 0.000_090_484, -0.000_000_080_6, -0.000_000_00025],
  
  [Equinox.MeanOfTheDate]: {
    meanLongitude: [355.433, 19141.696_4471, 0.000_310_52, 0.000_000_016],
    inclination: [1.849_726, -0.000_6011, 0.000_012_76, -0.000_000_007],
    longitudeOfAscendingNode: [49.558_093, 0.772_0959, 0.000_015_57, 0.000_002_267],
    longitudeOfPerihelion: [336.060_234, 1.841_0449, 0.000_134_77, 0.000_000_536],
  },
  
  [Equinox.StandardJ2000]: {
    meanLongitude: [355.433, 19140.299_3039, 0.000_002_62, -0.000_000_003],
    inclination: [1.849_726, -0.008_1477, -0.000_022_55, -0.000_000_29],
    longitudeOfAscendingNode: [49.558_093, -0.295_025, -0.000_640_48, -0.000_001_964],
    longitudeOfPerihelion: [336.060_234, 0.443_9016, -0.000_173_13, 0.000_000_518]
    
  }
}
