'use strict'

import moment from 'moment'
import constants from './constants'

const J1970 = 2440588
const J2000 = 2451545
const dayMs = 1000 * 60 * 60 * 24

function getLocalSiderealTime (julianDay, longitude) {
  // Equ 12.1
  const t = (julianDay - 2451545) / 36525

  // Greenwhich SiderealTime in degrees! Equ. 12.4 of AA, p. 88
  let gmst = 280.46061837 + 360.98564736629 * (julianDay - 2451545) + 0.000387933 * t * t - t * t * t / 38710000

  while (gmst < 0) {
    gmst = gmst + 360
  }

  return Math.fmod((gmst + longitude) * constants.DEGREES_TO_HOURS + 24, 24)
}

class JulianDay {
  constructor (...args) {
    if (args.length === 0) {
      args[0] = new Date()
    }
    if (args[0] instanceof Date) {
      this.value = moment(args[0]).toDate().valueOf() / dayMs - 0.5 + J1970
    } else if (Math.isNumber(args[0])) {
      this.value = parseFloat(args[0])
    }
  }

  getMJDValue () {
    return this.value - 2400000.5
  }

  toDate () {
    return new Date((this.value + 0.5 - J1970) * dayMs)
  }

  getLocalSiderealTime (longitude) {
    return getLocalSiderealTime(this.value, longitude)
  }

  getMidnightJulianDay () {
    return new JulianDay(Math.floor(this.value - 0.5) + 0.5)
  }
}

export default {
  J1970,
  J2000,
  getLocalSiderealTime,
  JulianDay
}
