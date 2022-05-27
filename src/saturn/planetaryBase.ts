import { JulianDay, PlanetaryConstants } from 'aa.js'
import { fractionalYear } from '../dates'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return Math.floor(0.03393 * (decimalYear - 2003.52))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2452830.12 + 10764.21676 * kdash + 0.000827 * kdash * kdash
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2452830.12 + 10764.21676 * k + 0.000827 * k * k
}

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetaryConstants = {
  equatorialRadius: 60268,
  meanRadius: 58232,
  mass: 568.3174,
  bulkDensity: 0.6871,
  siderealRotationPeriod: 0.44401,
  siderealOrbitPeriod: 29.447498,
  visualMagnitude: -8.88,
  geometricAlbedo: 0.47,
  equatorialGravity: 10.44,
  escapeVelocity: 36.09
}
