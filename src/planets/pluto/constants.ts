import Decimal from '@/decimal'
import { PlanetConstants } from '@/types'

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: new Decimal(1188.3),
  meanRadius: new Decimal(1188.3),
  mass: new Decimal(0.013030),
  bulkDensity: new Decimal(1.89),
  siderealRotationPeriod: new Decimal(-6.3872),
  siderealOrbitPeriod: new Decimal(247.92065),
  visualMagnitude: new Decimal(-1.0),
  geometricAlbedo: new Decimal(0.3),
  equatorialGravity: new Decimal(0.62),
  escapeVelocity: new Decimal(1.21)
}
