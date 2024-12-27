import { JulianDay } from '@/js/types'
import { getDecimalYear } from '@/js/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = 0.01190 * (decimalYear - 2051.1)
  return decimalK >= 0 ? Math.floor(decimalK) : Math.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Uranus
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2470213.5 + 30694.8767 * kdash - 0.005_41 * Math.pow(kdash, 2)
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Uranus
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2470213.5 + 30694.8767 * k - 0.005_41 * Math.pow(k, 2)
}
