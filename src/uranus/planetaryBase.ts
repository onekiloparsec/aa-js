import { JulianDay, PlanetaryConstants } from 'aa.js'
import { fractionalYear } from '../dates'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return Math.floor(0.01190 * (decimalYear - 2051.1))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2470213.5 + 30694.8767 * kdash - 0.00541 * kdash * kdash
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2470213.5 + 30694.8767 * k - 0.00541 * k * k
}

/**
 * Planet constants, copied from the JPL
 * Reference: https://ssd.jpl.nasa.gov/?planet_phys_par
 */
export const constants: PlanetaryConstants = {
  equatorialRadius: 25559,
  meanRadius: 25362,
  mass: 86.8127,
  bulkDensity: 1.270,
  siderealRotationPeriod: -0.71833, // negative
  siderealOrbitPeriod: 84.016846,
  visualMagnitude: -7.19,
  geometricAlbedo: 0.51,
  equatorialGravity: 8.87,
  escapeVelocity: 21.38
}
