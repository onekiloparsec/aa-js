
import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = new Decimal('0.006_07').mul(decimalYear.minus('2047.5'))
  return decimalK.isPositive() ? Decimal.floor(decimalK) : Decimal.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Neptune
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd).plus(0.5)
  return new Decimal('2468895.1')
    .plus(new Decimal('60190.33').mul(kdash))
    .plus(new Decimal('0.034_29').mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Neptune
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return new Decimal('2468895.1')
    .plus(new Decimal('60190.33').mul(k))
    .plus(new Decimal('0.034_29').mul(k.pow(2)))
}
