import dayjs from 'dayjs'
import { DAYMS, DEG2H, J1970 } from './constants'
import { fmod, isNumber } from './utils'


export function getDate(jd: number): Date {
  return new Date((jd + 0.5 - J1970) * DAYMS)
}

export function getJulianDay(...args): number {
  if (args.length === 0) {
    args[0] = new Date()
  }
  if (args[0] instanceof Date) {
    return dayjs(args[0]).toDate().valueOf() / DAYMS - 0.5 + J1970
  } else if (isNumber(args[0])) {
    return parseFloat(args[0])
  }
}

export function localSiderealTime(jd: number, lng: number): number {
  // Equ 12.1
  const t = (jd - 2451545) / 36525

  // Greenwhich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * t * t - t * t * t / 38710000

  while (gmst < 0) {
    gmst = gmst + 360
  }

  return fmod((gmst + lng) * DEG2H + 24, 24)
}

export function modifiedJulianDay(jd: number): number {
  return jd - 2400000.5
}

export function julianDayMidnight(jd: number): number {
  return Math.floor(jd - 0.5) + 0.5
}
