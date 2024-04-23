
import { JulianDay } from '@/types'
import { getDecimalYear } from '@/times'

// The value of K must be an integer
function getK (jd: JulianDay): number {
  const decimalYear = getDecimalYear(jd)
  const decimalK = new Decimal('1.62549').mul(decimalYear.minus('2000.53'))
  return decimalK.isPositive() ? Decimal.floor(decimalK) : Decimal.ceil(decimalK)
}

/**
 * Aphelion (time of passage at the closest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Venus
 */
export function getAphelion (jd: JulianDay): JulianDay {
  const kdash = getK(jd).plus('0.5')
  return new Decimal('2451738.233')
    .plus(new Decimal('224.700_8188').mul(kdash))
    .minus(new Decimal('0.000_000_0327').mul(kdash.pow(2)))
}

/**
 * Perihelion (time of passage at the farthest point to the Sun)
 * @param {JulianDay} jd The julian day
 * @returns {JulianDay}
 * @memberof module:Venus
 */
export function getPerihelion (jd: JulianDay): JulianDay {
  const k = getK(jd)
  return new Decimal('2451738.233')
    .plus(new Decimal('224.7008188').mul(k))
    .minus(new Decimal('0.000_000_0327').mul(k.pow(2)))
}
