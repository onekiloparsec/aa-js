import Decimal from 'decimal.js'
import { JulianDay } from '@/types'
import { getFractionalYear } from '@/dates'

// The value of K must be an integer
function getK (jd: JulianDay | number): Decimal {
  const decimalYear = getFractionalYear(jd)
  return Decimal.floor(new Decimal(0.03393).mul(decimalYear.minus(2003.52)))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay | number): JulianDay {
  const kdash = getK(jd).plus(0.5)
  return new Decimal(2452830.12)
    .plus(new Decimal(10764.21676).mul(kdash))
    .plus(new Decimal(0.000827).mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay | number): JulianDay {
  const k = getK(jd)
  return new Decimal(2452830.12)
    .plus(new Decimal(10764.21676).mul(k))
    .plus(new Decimal(0.000827).mul(k.pow(2)))
}
