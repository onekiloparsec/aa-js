import Decimal from '@/decimal'
import { EquatorialCoordinatesAtJulianDayFunction, GeographicCoordinates, JulianDay, RiseTransitSet } from '@/types'
import * as risetransitset from '@/risetransitset'
import { STANDARD_ALTITUDE_STARS } from '@/constants'

/** @private */
export function getPlanetRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates, getCoordsFunc: EquatorialCoordinatesAtJulianDayFunction, highPrecision: boolean = true): RiseTransitSet {
  const coords = getCoordsFunc(new Decimal(jd))
  return risetransitset.getRiseTransitSetTimes(jd, coords, geoCoords, STANDARD_ALTITUDE_STARS, highPrecision)
}

/** @private */
export function getPlanetAccurateRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates, getCoordsFunc: EquatorialCoordinatesAtJulianDayFunction, highPrecision: boolean = true): RiseTransitSet {
  const coords0 = getCoordsFunc(new Decimal(jd).minus(1))
  const coords1 = getCoordsFunc(new Decimal(jd))
  const coords2 = getCoordsFunc(new Decimal(jd).plus(1))
  return risetransitset.getAccurateRiseTransitSetTimes(jd, [coords0, coords1, coords2], geoCoords, STANDARD_ALTITUDE_STARS, 1, highPrecision)
}
