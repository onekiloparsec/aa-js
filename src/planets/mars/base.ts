import Decimal from '@/decimal'
import { JulianDay } from '@/types'
import { getFractionalYear } from '@/dates'

// The value of K must be an integer
function getK (jd: JulianDay | number): Decimal {
  const decimalYear = getFractionalYear(jd)
  return Decimal.floor(new Decimal(0.53166).mul(decimalYear.minus(2001.78)))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay | number): JulianDay {
  const kdash = getK(jd).plus(0.5)
  return new Decimal(2452195.026)
    .plus(new Decimal(686.9957857).mul(kdash))
    .minus(new Decimal(0.0000001187).mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay | number): JulianDay {
  const k = getK(jd)
  return new Decimal(2452195.026)
    .plus(new Decimal(686.9957857).mul(k))
    .minus(new Decimal(0.0000001187).mul(k.pow(2)))
}
