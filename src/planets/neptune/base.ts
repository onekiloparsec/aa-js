import { JulianDay } from '@/types'
import { getFractionalYear } from '@/dates'
import Decimal from 'decimal.js'

// The value of K must be an integer
function getK (jd: JulianDay | number): Decimal {
  const decimalYear = getFractionalYear(jd)
  return Decimal.floor(new Decimal(0.00607).mul(decimalYear.minus(2047.5)))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay | number): JulianDay {
  const kdash = getK(jd).plus(0.5)
  return new Decimal(2468895.1)
    .plus(new Decimal(60190.33).mul(kdash))
    .plus(new Decimal(0.03429).mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay | number): JulianDay {
  const k = getK(jd)
  return new Decimal(2468895.1)
    .plus(new Decimal(60190.33).mul(k))
    .plus(new Decimal(0.03429).mul(k.pow(2)))
}
