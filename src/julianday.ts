import dayjs from 'dayjs'
import { DAYMS, DEG2H, Degree, Hour, J1970, JulianDay, MJD_START } from './constants'
import { fmod, isNumber } from './utils'


export function getDate(jd: JulianDay): Date {
  return new Date((jd + 0.5 - J1970) * DAYMS)
}

export function getJulianDay(...args: any[]): JulianDay | undefined {
  if (args.length === 0) {
    return new Date().valueOf() / DAYMS - 0.5 + J1970
  } else if (args.length === 1) {
    const value = args[0]
    if (value instanceof Date) {
      // @ts-ignore
      return dayjs(value).toDate().valueOf() / DAYMS - 0.5 + J1970
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

export function localSiderealTime(jd: JulianDay, lng: Degree): Hour {
  // Equ 12.1
  const t = (jd - 2451545) / 36525

  // Greenwhich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * t * t - t * t * t / 38710000

  while (gmst < 0) {
    gmst = gmst + 360
  }

  return fmod((gmst + lng) * DEG2H + 24, 24)
}

export function modifiedJulianDay(jd: JulianDay): number {
  return jd - MJD_START
}

export function julianDayMidnight(jd: JulianDay): JulianDay {
  return Math.floor(jd - 0.5) + 0.5
}
