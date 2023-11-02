import Decimal from '@/decimal'
import { SunConstants } from '@/types'

/**
 * Sun constants, copied from the JPL, for completeness.
 * @property {Kilometer} equatorialRadius Sun's equatorial radius
 * @memberof module:Sun
 */
export const constants: SunConstants = {
  equatorialRadius: new Decimal('695990.0')
}
