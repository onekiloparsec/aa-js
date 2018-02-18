'use strict'

const moment = require('moment')

const J1970 = 2440588
const J2000 = 2451545
const dayMs = 1000 * 60 * 60 * 24

class JulianDay {
    constructor(...args) {
        let date = null
        if (args.length === 0) {
            date = new Date()
        } else if (args.length === 1) {
            date = args[0]
        }
        this.value = moment(args[0]).toDate().valueOf() / dayMs - 0.5 + J1970
    }
}

module.exports = {
    J1970,
    J2000,
    JulianDay
}
