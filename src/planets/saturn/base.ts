import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = 0.03393 * (decimalYear - 2003.52)
  return decimalK >= 0 ? Math.floor(decimalK) : Math.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Saturn
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2452830.12 + 10764.216_76 * kdash + 0.000_827 * Math.pow(kdash, 2)
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Saturn
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2452830.12 + 10764.216_76 * k + 0.000_827 * Math.pow(k, 2)
}
