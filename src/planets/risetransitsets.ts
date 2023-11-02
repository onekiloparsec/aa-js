import Decimal from '@/decimal'
import { EquatorialCoordinatesAtJulianDayFunction, GeographicCoordinates, JulianDay, RiseTransitSet } from '@/types'
import * as risetransitsets from '@/risetransitsets'

export function getPlanetRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates, getCoordsFunc: EquatorialCoordinatesAtJulianDayFunction): RiseTransitSet {
  const coords = getCoordsFunc(new Decimal(jd))
  return risetransitsets.getRiseTransitSetTimes(
    jd,
    coords.rightAscension,
    coords.declination,
    geoCoords.longitude,
    geoCoords.latitude
  )
}

export function getPlanetAccurateRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates, getCoordsFunc: EquatorialCoordinatesAtJulianDayFunction): RiseTransitSet {
  const coords0 = getCoordsFunc(new Decimal(jd).minus(1))
  const coords1 = getCoordsFunc(new Decimal(jd))
  const coords2 = getCoordsFunc(new Decimal(jd).plus(1))
  return risetransitsets.getAccurateRiseTransitSetTimes(
    jd,
    [coords0.rightAscension, coords1.rightAscension, coords2.rightAscension],
    [coords0.declination, coords1.declination, coords2.declination],
    geoCoords.longitude,
    geoCoords.latitude
  )
}
