'use strict'

import moment from 'moment'

const J1970 = 2440588
const J2000 = 2451545
const dayMs = 1000 * 60 * 60 * 24

class JulianDay {
  constructor (...args) {
    let date = null
    if (args.length === 0) {
      date = new Date()
    } else if (args.length === 1) {
      date = args[0]
    }
    this.value = moment(date).toDate().valueOf() / dayMs - 0.5 + J1970
  }
}

export default {
  J1970,
  J2000,
  JulianDay
}
