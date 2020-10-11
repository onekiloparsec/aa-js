'use strict'

import dayjs from 'dayjs'
import { DEG2H } from './constants'

const J1970 = 2440588
const J2000 = 2451545
const dayMs = 1000 * 60 * 60 * 24

function date (julianDayValue) {
  return new Date((julianDayValue + 0.5 - J1970) * dayMs)
}

function julianDay (...args) {
  if (args.length === 0) {
    args[0] = new Date()
  }
  if (args[0] instanceof Date) {
    return dayjs(args[0]).toDate().valueOf() / dayMs - 0.5 + J1970
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
  J1970,
  J2000,
  date,
  julianDay,
  localSiderealTime,
  modifiedJulianDay,
  julianDayMidnight
}
