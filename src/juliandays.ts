import dayjs from 'dayjs'
import { DAYMS, DEG2H, J1970, MJD_START } from './constants'
import { Degree, Hour, JulianDay } from './types'
import { fmod, isNumber } from './utils'


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
export function getJulianDay (...args: any[]): JulianDay | undefined {
  if (args.length === 0) {
    return new Date().valueOf() / DAYMS - 0.5 + J1970
  } else if (args.length === 1) {
    const value = args[0]
    if (value instanceof Date) {
      // @ts-ignore
      return value.valueOf() / DAYMS - 0.5 + J1970
    } else if (value instanceof String) {
      // @ts-ignore
      return dayjs(value).toDate().valueOf() / DAYMS - 0.5 + J1970
    } else if (isNumber(value)) {
      // @ts-ignore
      const year = Math.floor(value)
      // @ts-ignore
      const month = Math.floor(value - year) * 12 // the month is 0-indexed
      // @ts-ignore
      const day = Math.floor(((value - year) * 12 - month) * 365)
      const UTCDate = new Date(Date.UTC(year, month, day))
      return UTCDate.valueOf() / DAYMS - 0.5 + J1970
    }
  } else if (args.length === 2) {
    const UTCDate = new Date(Date.UTC(args[0], args[1], 0))
    return UTCDate.valueOf() / DAYMS - 0.5 + J1970
  } else if (args.length === 3) {
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
  // Equ 12.1
  const T = getJulianCentury(jd)

  // Greenwich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
  let gmst: Degree = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - T * T * T / 38710000

  while (gmst < 0) {
    gmst = gmst + 360
  }

  return fmod((gmst + lng) * DEG2H + 24, 24)
}

/**
 * Modified julian day
 * @param {JulianDay} jd The julian day
 * @return {number} The modified Julian Day
 */
export function getModifiedJulianDay (jd: JulianDay): number {
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

export function getJulianCentury (jd: JulianDay) {
  return (jd - 2451545) / 36525
}

export function getJulianMillenium (jd: JulianDay) {
  return (jd - 2451545) / 365250 // julian day millennia, not centuries!
}
