import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = 1.62549 * decimalYear - 2000.53
  return decimalK > 0 ? Math.floor(decimalK) : Math.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Venus
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2451738.233 + 224.700_8188 * kdash - 0.000_000_0327 * Math.pow(kdash, 2)
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Venus
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2451738.233 + 224.7008188 * k - 0.000_000_0327 * Math.pow(k, 2)
}
