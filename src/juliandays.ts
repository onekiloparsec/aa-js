/**
 @module JulianDays
 */
import dayjs from 'dayjs'
import { DAYMS, DEG2H, J1970, MJD_START } from './constants'
import { Degree, Hour, JulianCentury, JulianDay, JulianMillenium } from './types'
import { fmod24, fmod360, isNumber } from './utils'
import Decimal from '@/decimal'


/**
 * Computes the date corresponding to the Julian Day
 * @param {JulianDay} jd The julian day
 * @returns {Date}
 */
export function getDate (jd: JulianDay | number): Date {
  return new Date(new Decimal(jd).plus(0.5).minus(J1970).mul(DAYMS).toNumber())
}

/**
 * Computes the Julian day for a given date.
 * @param args
 * @returns {JulianDay} The julian day
 */
export function getJulianDay (...args: any[]): JulianDay | undefined {
  if (args.length === 0) {
    return new Decimal(new Date().valueOf()).dividedBy(DAYMS).minus(0.5).plus(J1970)
  } else if (args.length === 1) {
    const value = args[0]
    if (value instanceof Date) {
      return new Decimal(value.valueOf()).dividedBy(DAYMS).minus(0.5).plus(J1970)
    } else if (value instanceof String) {
      // We use the parsing of dayjs.
      return new Decimal(dayjs(value as string).toDate().valueOf()).dividedBy(DAYMS).minus(0.5).plus(J1970)
    } else if (isNumber(value)) {
      const dvalue = new Decimal(value)
      const year = dvalue.floor() // integer
      const month = Decimal.floor(dvalue.minus(year)).mul(12) // the month is 0-indexed // integer
      const day = Decimal.floor((dvalue.minus(year)).mul(12).minus(month)).mul(365) // float
      const UTCDate = new Date(Date.UTC(year.toNumber(), month.toNumber(), day.toNumber()))
      return new Decimal(UTCDate.valueOf()).dividedBy(DAYMS).minus(0.5).plus(J1970)
    }
  } else if (args.length === 2) {
    const UTCDate = new Date(Date.UTC(args[0], args[1], 0))
    return new Decimal(UTCDate.valueOf()).dividedBy(DAYMS).minus(0.5).plus(J1970)
  } else if (args.length === 3) {
    const UTCDate = new Date(Date.UTC(args[0], args[1], args[2]))
    return new Decimal(UTCDate.valueOf()).dividedBy(DAYMS).minus(0.5).plus(J1970)
  }
}

/**
 * The local mean sidereal time (sun's clock time) for a given julian day
 * at a given longitude on Earth
 * @param {JulianDay} jd The julian day
 * @param {Degree} lng The longitude
 * @return {Hour}
 */
export function getLocalSiderealTime (jd: JulianDay | number, lng: Degree | number): Hour {
  const T = getJulianCentury(jd)

  // Greenwich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
  const gmst: Decimal = new Decimal(280.46061837)
    .plus(new Decimal(360.98564736629).mul(new Decimal(jd).minus(2451545)))
    .plus(new Decimal(0.000387933).mul(T.pow(2)))
    .minus(T.pow(3).dividedBy(38710000))

  return fmod24(fmod360(gmst).plus(lng).mul(DEG2H))
}

/**
 * Modified julian day
 * @param {JulianDay} jd The julian day
 * @return {number} The modified Julian Day
 */
export function getModifiedJulianDay (jd: JulianDay | number): JulianDay {
  return new Decimal(jd).minus(MJD_START)
}

/**
 * The Julian Day of Midnight UTC for a given Julian Day.
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianDay}
 */
export function getJulianDayMidnight (jd: JulianDay | number): JulianDay {
  return Decimal.floor(new Decimal(jd).minus(0.5)).plus(0.5)
}

/**
 * The Julian Century (time interval of 36525 days)
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianCentury}
 */
export function getJulianCentury (jd: JulianDay | number): JulianCentury {
  // AA, Equ 12.1.
  return new Decimal(jd).minus(2451545).dividedBy(36525)
}

/**
 * The Julian Millenium (time interval of 365250 days)
 * @param {JulianDay} jd The initial julian day
 * @returns {JulianMillenium}
 */
export function getJulianMillenium (jd: JulianDay | number): JulianMillenium {
  return new Decimal(jd).minus(2451545).dividedBy(365250) // julian day millennia, not centuries!
}
