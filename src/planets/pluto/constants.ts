/**
 @module Pluto
 */

import { PlanetConstants } from '@/types'

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
 * @memberof module:Pluto
 */
export const constants: PlanetConstants = {
  equatorialRadius: 1188.3,
  meanRadius: 1188.3,
  mass: 0.013030,
  bulkDensity: 1.89,
  siderealRotationPeriod: -6.3872,
  siderealOrbitPeriod: 247.92065,
  visualMagnitude: -1.0,
  geometricAlbedo: 0.3,
  equatorialGravity: 0.62,
  escapeVelocity: 1.21
}
