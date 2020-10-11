'use strict'

import dayjs from 'dayjs'
import { DAYMS, DEG2H, J1970 } from './constants'


function getDate (jd) {
  return new Date((jd + 0.5 - J1970) * DAYMS)
}

function getJulianDay (...args) {
  if (args.length === 0) {
    args[0] = new Date()
  }
  if (args[0] instanceof Date) {
    return dayjs(args[0]).toDate().valueOf() / DAYMS - 0.5 + J1970
  } else if (Math.isNumber(args[0])) {
    return parseFloat(args[0])
  }
}

function localSiderealTime (julianDayValue, longitude) {
  // Equ 12.1
  const t = (julianDayValue - 2451545) / 36525

  // Greenwhich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
  let gmst = 280.46061837 + 360.98564736629 * (julianDayValue - 2451545) + 0.000387933 * t * t - t * t * t / 38710000

  while (gmst < 0) {
    gmst = gmst + 360
  }

  return Math.fmod((gmst + longitude) * DEG2H + 24, 24)
}

function modifiedJulianDay (julianDayValue) {
  return julianDayValue - 2400000.5
}

function julianDayMidnight (julianDayValue) {
  return Math.floor(julianDayValue - 0.5) + 0.5
}

export default {
  getDate,
  getJulianDay,
  localSiderealTime,
  modifiedJulianDay,
  julianDayMidnight
}
