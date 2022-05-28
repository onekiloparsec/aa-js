import { PlanetaryConstants } from '../types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetaryConstants = {
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
