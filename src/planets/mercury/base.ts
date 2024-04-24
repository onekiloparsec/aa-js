import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = 4.152_01 * decimalYear - 2000.12
  return decimalK > 0 ? Math.floor(decimalK) : Math.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Mercury
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2451590.257 + 87.969_349_63 * kdash
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Mercury
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2451590.257 + 87.969_349_63 * k
}
