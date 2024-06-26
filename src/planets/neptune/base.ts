import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = 0.006_07 * (decimalYear - 2047.5)
  return decimalK >= 0 ? Math.floor(decimalK) : Math.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Neptune
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2468895.1 + 60190.33 * kdash + 0.034_29 * Math.pow(kdash, 2)
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Neptune
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2468895.1 + 60190.33 * k + 0.034_29 * Math.pow(k, 2)
}
