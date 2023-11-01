import Decimal from '@/decimal'
import { JulianDay } from '@/types'
import { getFractionalYear } from '@/dates'

// The value of K must be an integer
function getK (jd: JulianDay | number): Decimal {
  const decimalYear = getFractionalYear(jd)
  return Decimal.floor(new Decimal(0.01190).mul(decimalYear.minus(2051.1)))
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay | number): JulianDay {
  const kdash = getK(jd).plus(0.5)
  return new Decimal(2470213.5)
    .plus(new Decimal(30694.8767).mul(kdash))
    .minus(new Decimal(0.00541).mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay | number): JulianDay {
  const k = getK(jd)
  return new Decimal(2470213.5)
    .plus(new Decimal(30694.8767).mul(k))
    .minus(new Decimal(0.00541).mul(k.pow(2)))
}
