/**
 @module JulianDays
 */
import dayjs from 'dayjs'
import { DAYMS, DEG2H, J1970, MJD_START } from './constants'
import { Degree, Hour, JulianCentury, JulianDay, JulianMillenium } from './types'
import { isNumber } from './utils'
import Decimal from 'decimal.js'


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
      const year = Decimal.floor(value).toNumber()
      const month = Decimal.floor(value - year).toNumber() * 12 // the month is 0-indexed
      const day = Decimal.floor(((value - year) * 12 - month) * 365).toNumber()
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
  const T = new Decimal(getJulianCentury(jd))

  // Greenwich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
  const gmst: Decimal = new Decimal(280.46061837)
    .plus(new Decimal(360.98564736629).mul(jd - 2451545))
    .plus(new Decimal(0.000387933).mul(T.pow(2)))
    .minus(T.pow(3).dividedBy(38710000))
    .modulo(360)

  Decimal.set({ modulo: Decimal.EUCLID })
  return gmst.plus(lng).mul(DEG2H).modulo(24).toNumber()
}

/**
 * Modified julian day
 * @param {JulianDay} jd The julian day
 * @return {number} The modified Julian Day
 */
export function getModifiedJulianDay (jd: JulianDay): number {
  return new Decimal(jd).minus(MJD_START).toNumber()
}

/**
 * The Julian Day of Midnight UTC for a given Julian Day.
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianDay}
 */
export function getJulianDayMidnight (jd: JulianDay): JulianDay {
  return Decimal.floor(jd - 0.5).plus(0.5).toNumber()
}

/**
 * The Julian Century (time interval of 36525 days)
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianCentury}
 */
export function getJulianCentury (jd: JulianDay): JulianCentury {
  // AA, Equ 12.1.
  return new Decimal(jd).minus(2451545).dividedBy(36525).toNumber()
}

/**
 * The Julian Millenium (time interval of 365250 days)
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianMillenium}
 */
export function getJulianMillenium (jd: JulianDay): JulianMillenium {
  return new Decimal(jd).minus(2451545).dividedBy(365250).toNumber() // julian day millennia, not centuries!
}
