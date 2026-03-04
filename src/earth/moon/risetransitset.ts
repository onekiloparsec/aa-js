import { GeographicCoordinates, JulianDay, RiseTransitSet } from '@/types'
import { STANDARD_ALTITUDE_MOON } from '@/constants'
import { getJulianDayMidnightDynamicalTime } from '@/juliandays'
import { getRiseTransitSetTimes } from '@/risetransitset'
import { getApparentGeocentricEquatorialCoordinates } from './coordinates'

/**
 * Rise, transit and set times of the Moon for a given julian day and geographic coordinates.
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The geographic coordinates
 * @returns {RiseTransitSet}
 * @memberof module:Earth
 */
export function getRiseTransitSet (jd: JulianDay, geoCoords: GeographicCoordinates): RiseTransitSet {
  const jd0 = getJulianDayMidnightDynamicalTime(jd)
  const moonCoords = getApparentGeocentricEquatorialCoordinates(jd0)
  return getRiseTransitSetTimes(jd, moonCoords, geoCoords, STANDARD_ALTITUDE_MOON)
}
