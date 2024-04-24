import { STANDARD_ALTITUDE_STARS } from '@/constants'
import { Degree, EquatorialCoordinates, GeographicCoordinates, JulianDay, RiseTransitSet } from '@/types'
import { getMTimes, MTimesNum } from './mtimes'
import { getJDatUTC } from './utils'

/**
 * Compute the times of rise, set and transit of an object at a given date,
 * and observer's location on Earth. It runs a low accuracy algoritm (very similar to the accurate ones,
 * but without iterations).
 * @see getAccurateRiseTransitSetTimes
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} equCoords The apparent equatorial coordinates of the day of interest, at midnight
 * Dynamical Time (see juliandays.getJulianDayMidnightDynamicalTime)
 * @param {GeographicCoordinates} geoCoords The observer's location.
 * @param {Degree} alt The local altitude of the object's center to consider
 * for rise and set times. It's value isn't 0. For stars, it is affected by
 * aberration (value = -0.5667 degree)
 * @return {RiseTransitSet}
 */
export function getRiseTransitSetTimes (jd: JulianDay,
                                        equCoords: EquatorialCoordinates,
                                        geoCoords: GeographicCoordinates,
                                        alt: Degree = STANDARD_ALTITUDE_STARS): RiseTransitSet {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.
  
  const result: RiseTransitSet = {
    rise: {
      utc: undefined,
      julianDay: undefined
    },
    set: {
      utc: undefined,
      julianDay: undefined
    },
    transit: {
      utc: undefined,
      julianDay: undefined,
      altitude: undefined,
      refAltitude: alt,
      isAboveHorizon: false,
      isAboveAltitude: false,
      isCircumpolar: false,
      internals: {
        m0: undefined,
        cosH0: undefined
      }
    }
  }
  
  // Calculate the Greenwich sidereal time in degrees
  const mTimes = getMTimes(jd, equCoords, geoCoords, alt) as MTimesNum
  result.transit.altitude = mTimes.altitude!
  result.transit.utc = mTimes.m0! * 24
  result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)
  
  result.transit.internals.m0 = mTimes.m0!
  result.transit.internals.cosH0 = mTimes.cosH0!
  
  result.transit.isCircumpolar = mTimes.isCircumpolar!
  result.transit.isAboveHorizon = (mTimes.altitude! > STANDARD_ALTITUDE_STARS)
  result.transit.isAboveAltitude = (mTimes.altitude! > alt)
  
  if (!mTimes.isCircumpolar) {
    result.rise.utc = mTimes.m1! * 24
    result.set.utc = mTimes.m2! * 24
    
    result.rise.julianDay = getJDatUTC(jd, result.rise.utc!)
    result.set.julianDay = getJDatUTC(jd, result.set.utc!)
    
    if (result.rise.julianDay && result.transit.julianDay && result.rise.julianDay > result.transit.julianDay) {
      result.rise.julianDay = result.rise.julianDay - 1
    }
    if (result.set.julianDay && result.transit.julianDay && result.set.julianDay < result.transit.julianDay) {
      result.set.julianDay = result.set.julianDay + 1
    }
  }
  
  return result
}
