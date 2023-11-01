import Decimal from '@/decimal'
import { JulianDay } from '@/types'
import { getFractionalYear } from '@/dates'

// The value of K must be an integer
function getK (jd: JulianDay | number): Decimal {
  const decimalYear = getFractionalYear(jd)
  return Decimal.floor(new Decimal(0.08430).mul(decimalYear.minus(2011.20)))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay | number): JulianDay {
  const kdash = getK(jd).plus(0.5)
  return new Decimal(2455636.936)
    .plus(new Decimal(4332.897065).mul(kdash))
    .plus(new Decimal(0.0001367).mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay | number): JulianDay {
  const k = getK(jd)
  return new Decimal(2455636.936)
    .plus(new Decimal(4332.897065).mul(k))
    .plus(new Decimal(0.0001367).mul(k.pow(2)))
}
