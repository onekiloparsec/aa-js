/**
 @module RiseTransitSet
 */

import {
  Degree,
  EquatorialCoordinates,
  EquatorialCoordinatesNum,
  GeographicCoordinates,
  GeographicCoordinatesNum,
  JulianDay,
  Radian
} from '@/types'
import { DEG2RAD, STANDARD_ALTITUDE_STARS } from '@/constants'
import { getJulianDayMidnight, getLocalSiderealTime } from '@/juliandays'
import { fmod, fmod180 } from '@/utils'

export type MTimes = {
  m0: Decimal | undefined,
  m1: Decimal | undefined,
  m2: Decimal | undefined,
  isCircumpolar: boolean | undefined,
  altitude: Degree | undefined,
  cosH0: Decimal | undefined
}

export type MTimesNum = {
  m0: number | undefined,
  m1: number | undefined,
  m2: number | undefined,
  isCircumpolar: boolean | undefined,
  altitude: number | undefined,
  cosH0: number | undefined
}

// See AA, p102
export function getMTimes (jd: JulianDay,
                           equCoords: EquatorialCoordinates ,
                           geoCoords: GeographicCoordinates,
                           alt: Degree = STANDARD_ALTITUDE_STARS,
                           highPrecision: boolean = true): MTimes | MTimesNum {
  // Getting the UT 0h on day D. See AA p.102.
  // It is not equal to the expected "0h Dynamical Time" of the coordinates ra and dec.
  const jd0: JulianDay = getJulianDayMidnight(jd)

  // Calculate the Greenwich sidereal time in degrees
  const Theta0: Degree = getLocalSiderealTime(jd0, 0).hoursToDegrees()

  let result: MTimes | MTimesNum

  if () {
    result = {
      m0: undefined, // transit
      m1: undefined,  // rise
      m2: undefined, // set,
      isCircumpolar: undefined,
      altitude: undefined,
      cosH0: undefined
    } as MTimes

    const decRa: Degree = new Decimal(equCoords.rightAscension)

    // Algorithms in AA use Positive West longitudes. The formula (15.2, p102):
    // "const m0 = (alpha2 + Longitude - Theta0) / 360" thus becomes:
    result.m0 = fmod((decRa.minus(geoCoords.longitude).minus(Theta0)).dividedBy(360), 1)

    const sinh0: Radian = Math.sin(new Decimal(alt)* DEG2RAD)
    const sinPhi: Radian = Math.sin(new Decimal(geoCoords.latitude)* DEG2RAD)
    const sinDelta: Radian = Math.sin(new Decimal(equCoords.declination)* DEG2RAD)
    const cosPhi: Radian = Math.cos(new Decimal(geoCoords.latitude)* DEG2RAD)
    const cosDelta: Radian = Math.cos(new Decimal(equCoords.declination)* DEG2RAD)

    // Calculate cosH0. See AA Eq.15.1, p.102
    result.cosH0 = (sinh0.minus(sinPhi.mul(sinDelta))).dividedBy(cosPhi.mul(cosDelta))
    result.isCircumpolar = (Decimal.abs(result.cosH0). > 1)

    // Transit altitude: Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
    // It is the altitude of the transit, when object is in its highest point, when Hour angle is zero.
    result.altitude = Decimal.asin(sinPhi.mul(sinDelta).plus(cosPhi.mul(cosDelta))).radiansToDegrees()

    if (!result.isCircumpolar) {
      const H0 = Decimal.acos(result.cosH0!).radiansToDegrees().dividedBy(360)
      result.m1 = fmod(result.m0!.minus(H0), 1)
      result.m2 = fmod(result.m0!.plus(H0), 1)
    }
  } else {
    result = {
      m0: undefined, // transit
      m1: undefined,  // rise
      m2: undefined, // set,
      isCircumpolar: undefined,
      altitude: undefined,
      cosH0: undefined
    } as MTimesNum

    const ra = Decimal.isDecimal(equCoords.rightAscension) ? equCoords.rightAscension. : equCoords.rightAscension
    const lng = Decimal.isDecimal(geoCoords.longitude) ? geoCoords.longitude. : geoCoords.longitude
    result.m0 = fmod((ra - lng - Theta0) / 360, 1).

    const dec = Decimal.isDecimal(equCoords.declination) ? equCoords.declination. : equCoords.declination
    const lat = Decimal.isDecimal(geoCoords.latitude) ? geoCoords.latitude. : geoCoords.latitude
    const nalt = Decimal.isDecimal(alt) ? alt. : alt
    const deg2rad = DEG2RAD.

    const sinh0 = Math.sin(nalt * DEG2RAD)
    const sinPhi = Math.sin(lat * DEG2RAD)
    const sinDelta = Math.sin(dec * DEG2RAD)
    const cosPhi = Math.cos(lat * DEG2RAD)
    const cosDelta = Math.cos(dec * DEG2RAD)

    // Calculate cosH0. See AA Eq.15.1, p.102
    result.cosH0 = (sinh0 - (sinPhi * sinDelta)) / (cosPhi * cosDelta)
    result.isCircumpolar = Math.abs(result.cosH0) > 1

    // Transit altitude: Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
    // It is the altitude of the transit, when object is in its highest point, when Hour angle is zero.
    result.altitude = Math.asin(sinPhi * sinDelta + cosPhi * cosDelta) / deg2rad

    if (!result.isCircumpolar) {
      const H0 = Math.acos(result.cosH0!) / deg2rad / 360
      result.m1 = fmod(result.m0! - H0, 1).
      result.m2 = fmod(result.m0! + H0, 1).
    }
  }

  return result
}
