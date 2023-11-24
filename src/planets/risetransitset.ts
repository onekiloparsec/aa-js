import Decimal from '@/decimal'
import { EquatorialCoordinatesAtJulianDayFunction, GeographicCoordinates, JulianDay, RiseTransitSet } from '@/types'
import { getAccurateRiseTransitSetTimes, getRiseTransitSetTimes } from '@/risetransitset'
import { STANDARD_ALTITUDE_STARS } from '@/constants'
import { getJulianDayMidnightDynamicalTime } from '@/juliandays'

/** @private */
export function getPlanetRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates, getCoordsFunc: EquatorialCoordinatesAtJulianDayFunction, highPrecision: boolean = true): RiseTransitSet {
  // See AA p 102. Theta0 is computed inside 'getRiseTransitSetTimes' function using 0h UT
  // But coordinates must be computed at 0h Dynamical Time.
  const jd0 = getJulianDayMidnightDynamicalTime(jd)
  const coords = getCoordsFunc(new Decimal(jd0))
  // Input jd, not jd0!
  return getRiseTransitSetTimes(jd, coords, geoCoords, STANDARD_ALTITUDE_STARS, highPrecision)
}

/** @private */
export function getPlanetAccurateRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates, getCoordsFunc: EquatorialCoordinatesAtJulianDayFunction, highPrecision: boolean = true): RiseTransitSet {
  // See AA p 102. Theta0 is computed inside 'getAccurateRiseTransitSetTimes' function using 0h UT
  // But coordinates must be computed at 0h Dynamical Time.
  const jd0 = getJulianDayMidnightDynamicalTime(jd)
  const coords0 = getCoordsFunc(new Decimal(jd0).minus(1))
  const coords1 = getCoordsFunc(new Decimal(jd0))
  const coords2 = getCoordsFunc(new Decimal(jd0).plus(1))
  // Input jd, not jd0!
  return getAccurateRiseTransitSetTimes(jd, [coords0, coords1, coords2], geoCoords, STANDARD_ALTITUDE_STARS, 1, highPrecision)
}
