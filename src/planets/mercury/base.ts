import Decimal from '@/decimal'
import { JulianDay } from '@/types'
import { getDecimalYear } from '@/dates'

// The value of K must be an integer
function getK (jd: JulianDay | number): Decimal {
  const decimalYear = getDecimalYear(jd)
  const decimalK = new Decimal('4.15201').mul(decimalYear.minus('2000.12'))
  return decimalK.isPositive() ? Decimal.floor(decimalK) : Decimal.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getAphelion (jd: JulianDay | number): JulianDay {
  const kdash = getK(jd).plus(0.5)
  return new Decimal('2451590.257')
    .plus(new Decimal('87.96934963').mul(kdash))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 */
export function getPerihelion (jd: JulianDay | number): JulianDay {
  const k = getK(jd)
  return new Decimal('2451590.257')
    .plus(new Decimal('87.96934963').mul(k))
}
