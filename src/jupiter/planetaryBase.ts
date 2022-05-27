import { JulianDay, PlanetaryConstants } from 'aa.js'
import { fractionalYear } from '../dates'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return Math.floor(0.08430 * (decimalYear - 2011.20))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2455636.936 + 4332.897065 * kdash + 0.0001367 * kdash * kdash
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2455636.936 + 4332.897065 * k + 0.0001367 * k * k
}

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetaryConstants = {
  equatorialRadius: 71492.0,
  meanRadius: 69911.0,
  mass: 1898.187,
  bulkDensity: 1.3262,
  siderealRotationPeriod: 0.41354,
  siderealOrbitPeriod: 11.862615,
  visualMagnitude: -9.40,
  geometricAlbedo: 0.52,
  equatorialGravity: 24.79,
  escapeVelocity: 60.20
}
