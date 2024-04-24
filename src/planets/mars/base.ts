import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = 0.531_66 * decimalYear - 2001.78
  return decimalK > 0 ? Math.floor(decimalK) : Math.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Mars
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2452195.026 + 686.995_7857 * kdash - 0.000_000_1187 * Math.pow(kdash, 2)
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Mars
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2452195.026 + 686.995_7857 * k - 0.000_000_1187 * Math.pow(k, 2)
}
