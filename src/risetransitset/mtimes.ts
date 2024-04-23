/**
 @module RiseTransitSet
 */

import { Degree, EquatorialCoordinates, GeographicCoordinates, JulianDay } from '@/types'
import { DEG2RAD, H2DEG, STANDARD_ALTITUDE_STARS } from '@/constants'
import { getJulianDayMidnight, getLocalSiderealTime } from '@/juliandays'
import { fmod } from '@/utils'

export type MTimes = {
  m0: number | undefined,
  m1: number | undefined,
  m2: number | undefined,
  isCircumpolar: boolean | undefined,
  altitude: number | undefined,
  cosH0: number | undefined
}

// See AA, p102
export function getMTimes (jd: JulianDay,
                           equCoords: EquatorialCoordinates,
                           geoCoords: GeographicCoordinates,
                           alt: Degree = STANDARD_ALTITUDE_STARS): MTimes {
  // Getting the UT 0h on day D. See AA p.102.
  // It is not equal to the expected "0h Dynamical Time" of the coordinates ra and dec.
  const jd0: JulianDay = getJulianDayMidnight(jd)
  
  // Calculate the Greenwich sidereal time in degrees
  const Theta0: Degree = getLocalSiderealTime(jd0, 0) * H2DEG
  
  const result: MTimes = {
    m0: undefined, // transit
    m1: undefined,  // rise
    m2: undefined, // set,
    isCircumpolar: undefined,
    altitude: undefined,
    cosH0: undefined
  }
  
  const ra = equCoords.rightAscension
  const lng = geoCoords.longitude
  
  result.m0 = fmod((ra - lng - Theta0) / 360, 1)
  
  const dec = equCoords.declination
  const lat = geoCoords.latitude
  
  const sinh0 = Math.sin(alt * DEG2RAD)
  const sinPhi = Math.sin(lat * DEG2RAD)
  const sinDelta = Math.sin(dec * DEG2RAD)
  const cosPhi = Math.cos(lat * DEG2RAD)
  const cosDelta = Math.cos(dec * DEG2RAD)
  
  // Calculate cosH0. See AA Eq.15.1, p.102
  result.cosH0 = (sinh0 - (sinPhi * sinDelta)) / (cosPhi * cosDelta)
  result.isCircumpolar = Math.abs(result.cosH0) > 1
  
  // Transit altitude: Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
  // It is the altitude of the transit, when object is in its highest point, when Hour angle is zero.
  result.altitude = Math.asin(sinPhi * sinDelta + cosPhi * cosDelta) / DEG2RAD
  
  if (!result.isCircumpolar) {
    const H0 = Math.acos(result.cosH0!) / DEG2RAD / 360
    result.m1 = fmod(result.m0! - H0, 1)
    result.m2 = fmod(result.m0! + H0, 1)
  }
  
  return result
}
