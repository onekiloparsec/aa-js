/**
 @module JulianDays
 */
import dayjs from 'dayjs'
import { DAYMS, DEG2H, J1970, J2000, MJD_START } from './constants'
import { ArcSecond, Degree, Hour, JulianCentury, JulianDay, JulianMillenium, Radian } from './types'
import { transformUTC2TT } from '@/times'
import { Earth } from '@/earth'
import { fmod24, fmod360, isNumber } from './utils'


/**
 * Computes the date corresponding to the Julian Day
 * @param {JulianDay} jd The julian day
 * @returns {Date}
 */
export function getDate (jd: JulianDay): Date {
  return new Date((jd + 0.5 - J1970) * DAYMS)
}

/**
 * Computes the Julian day for a given date.
 * @param args
 * @returns {JulianDay} The julian day
 */
export function getJulianDay (...args: any[]): JulianDay {
  if (args.length === 0) {
    return new Date().valueOf() / DAYMS - 0.5 + J1970
  } else if (args.length === 1) {
    const value = args[0]
    if (value instanceof Date) {
      // @ts-ignore
      return value.valueOf() / DAYMS - 0.5 + J1970
    } else if (value instanceof String || typeof value === 'string') {
      // @ts-ignore
      return dayjs(value).toDate().valueOf() / DAYMS - 0.5 + J1970
    } else if (isNumber(value)) {
      const year = Math.floor(value)
      const month = Math.floor(value - year) * 12 // the month is 0-indexed
      const day = Math.floor((value - year) * 12 - month) * 365)
      const UTCDate = new Date(Date.UTC(year, month, day))
      return UTCDate.valueOf() / DAYMS - 0.5 + J1970
    } else {
      console.warn(`Invalid input argument for JulianDay : ${value} (${typeof value}). Using J2000 in place.`)
      return J2000
    }
  } else if (args.length === 2) {
    const UTCDate = new Date(Date.UTC(args[0], args[1], 0))
    return UTCDate.valueOf() / DAYMS - 0.5 + J1970
  } else {
    const UTCDate = new Date(Date.UTC(args[0], args[1], args[2]))
    return UTCDate.valueOf() / DAYMS - 0.5 + J1970
  }
}

/**
 * The local mean sidereal time (sun's clock time) for a given julian day
 * at a given longitude on Earth
 * @param {JulianDay} jd The julian day
 * @param {Degree} lng The longitude
 * @return {Hour}
 */
export function getLocalSiderealTime (jd: JulianDay, lng: Degree): Hour {
  const t = getJulianCentury(jd)
  
  // Greenwich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
  const gmst = 280.460_618_37
    + 360.985_647_366_29 * (jd - 2451545)
    + 0.000_387_933 * t * t
    - t * t * t / 38_710_000
  
  return fmod24(fmod360(gmst + lng) * DEG2H)
}

/**
 * The apparent local mean sidereal time (sun's clock time) for a given julian day, corrected for the
 * nutation, at a given longitude on Earth
 * @param {JulianDay} jd The julian day
 * @param {Degree} lng The longitude
 * @return {Hour}
 */
export function getApparentLocalSiderealTime (jd: JulianDay, lng: Degree): Hour {
  const epsilon: Radian = Earth.getTrueObliquityOfEcliptic(jd)
  const deltaPsi: ArcSecond = Earth.getNutationInLongitude(jd)
  return getLocalSiderealTime(jd, lng) + deltaPsi * Math.cos(epsilon) * DEG2H
}

/**
 * Modified julian day
 * @param {JulianDay} jd The julian day
 * @return {number} The modified Julian Day
 */
export function getModifiedJulianDay (jd: JulianDay): JulianDay {
  return jd - MJD_START
}

/**
 * The Julian Day of Midnight UTC for a given Julian Day.
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianDay}
 */
export function getJulianDayMidnight (jd: JulianDay): JulianDay {
  return Math.floor(jd - 0.5) + 0.5
}

/**
 * The Julian Day of Midnight Dynamical Time (not exactly equal to UTC) for a given Julian Day.
 * When computing rise, transit and set times, the input equatorial coordinates must be first
 * computed at these times.
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianDay}
 */
export function getJulianDayMidnightDynamicalTime (jd: JulianDay): JulianDay {
  return transformUTC2TT(getJulianDayMidnight(jd))
}

/**
 * The Julian Century (time interval of 36525 days)
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianCentury}
 */
export function getJulianCentury (jd: JulianDay): JulianCentury {
  // AA, Equ 12.1.
  return (jd - 2451545) / 36525
}

/**
 * The Julian Millenium (time interval of 365250 days)
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianMillenium}
 */
export function getJulianMillenium (jd: JulianDay): JulianMillenium {
  return (jd - 2451545) / 365250
}
