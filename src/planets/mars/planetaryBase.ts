import { JulianDay, PlanetConstants } from '../types'
import { getFractionalYear } from '../dates'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getFractionalYear(jd)
  return Math.floor(0.53166 * (decimalYear - 2001.78))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2452195.026 + 686.9957857 * kdash - 0.0000001187 * kdash * kdash
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2452195.026 + 686.9957857 * k - 0.0000001187 * k * k
}

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetConstants = {
  equatorialRadius: 3396.19,
  meanRadius: 3389.50,
  mass: 0.641712,
  bulkDensity: 3.9341,
  siderealRotationPeriod: 1.02595676,
  siderealOrbitPeriod: 1.8808476,
  visualMagnitude: -1.52,
  geometricAlbedo: 0.150,
  equatorialGravity: 3.71,
  escapeVelocity: 5.03
}
