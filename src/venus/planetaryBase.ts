import { JulianDay, PlanetConstants } from '../types'
import { fractionalYear } from '../dates'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return Math.floor(1.62549 * (decimalYear - 2000.53))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2451738.233 + 224.7008188 * kdash - 0.0000000327 * kdash * kdash
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2451738.233 + 224.7008188 * k - 0.0000000327 * k * k
}

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
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
