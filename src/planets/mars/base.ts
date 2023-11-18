import Decimal from '@/decimal'
import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay | number): Decimal {
  const decimalYear = getDecimalYear(jd)
  const decimalK = new Decimal('0.531_66').mul(decimalYear.minus('2001.78'))
  return decimalK.isPositive() ? Decimal.floor(decimalK) : Decimal.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Mars
 */
export function getAphelion (jd: JulianDay | number): JulianDay {
  const kdash = getK(jd).plus(0.5)
  return new Decimal('2452195.026')
    .plus(new Decimal('686.995_7857').mul(kdash))
    .minus(new Decimal('0.000_000_1187').mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Mars
 */
export function getPerihelion (jd: JulianDay | number): JulianDay {
  const k = getK(jd)
  return new Decimal('2452195.026')
    .plus(new Decimal('686.995_7857').mul(k))
    .minus(new Decimal('0.000_000_1187').mul(k.pow(2)))
}
