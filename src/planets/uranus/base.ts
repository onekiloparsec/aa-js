
import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = new Decimal('0.01190').mul(decimalYear.minus('2051.1'))
  return decimalK.isPositive() ? Decimal.floor(decimalK) : Decimal.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Uranus
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd).plus('0.5')
  return new Decimal('2470213.5')
    .plus(new Decimal('30694.8767').mul(kdash))
    .minus(new Decimal('0.005_41').mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Uranus
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return new Decimal('2470213.5')
    .plus(new Decimal('30694.8767').mul(k))
    .minus(new Decimal('0.005_41').mul(k.pow(2)))
}
